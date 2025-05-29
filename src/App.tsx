import { useState } from 'react'
import './App.css'
import type { DropResult } from '@hello-pangea/dnd'
import type { FilterType, SortType, PriorityType, Todo } from './types'
import { useTodoStore } from './store/todoStore'
import { useThemeStore } from './store/themeStore'
import { Header } from './components/Header'
import { TodoInput } from './components/TodoInput'
import { TodoList } from './components/TodoList'
import { Statistics } from './components/Statistics'

function App() {
  const { todos, addTodo, toggleTodo, deleteTodo, editTodo } = useTodoStore()
  const { isDarkMode, toggleDarkMode } = useThemeStore()
  const [filter, setFilter] = useState<FilterType>('all')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [removingId, setRemovingId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortType>('none')

  const handleDeleteTodo = (id: number) => {
    setRemovingId(id)
    setTimeout(() => {
      deleteTodo(id)
      setRemovingId(null)
    }, 300)
  }

  const handleSaveEdit = (id: number, text: string, priority: PriorityType, dueDate: string) => {
    editTodo(id, text, priority, dueDate)
    setEditingId(null)
  }

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return
    const newTodos = Array.from(todos)
    const [removed] = newTodos.splice(result.source.index, 1)
    newTodos.splice(result.destination.index, 0, removed)
    useTodoStore.getState().setTodos(newTodos)
  }

  const getStatistics = () => {
    const total = todos.length
    const completed = todos.filter(todo => todo.completed).length
    const active = total - completed
    const priorityCounts = {
      high: todos.filter(todo => todo.priority === 'high').length,
      medium: todos.filter(todo => todo.priority === 'medium').length,
      low: todos.filter(todo => todo.priority === 'low').length
    }
    const overdue = todos.filter(todo => {
      if (!todo.dueDate || todo.completed) return false
      const dueDate = new Date(todo.dueDate)
      const today = new Date()
      return dueDate < today
    }).length

    return {
      total,
      completed,
      active,
      priorityCounts,
      overdue,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    }
  }

  return (
    <div className={`todo-app ${isDarkMode ? 'dark' : ''}`}>
      <Header isDarkMode={isDarkMode} onThemeToggle={toggleDarkMode} />
      
      <div className="search-section">
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="할 일 검색..."
          className="search-input"
        />
      </div>

      <TodoInput onAdd={addTodo} />

      <div className="filter-section">
        <select value={filter} onChange={e => setFilter(e.target.value as FilterType)}>
          <option value="all">전체</option>
          <option value="active">진행중</option>
          <option value="completed">완료</option>
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value as SortType)}>
          <option value="none">정렬 없음</option>
          <option value="priority">우선순위</option>
          <option value="dueDate">마감일</option>
        </select>
      </div>

      <TodoList
        todos={todos}
        filter={filter}
        sortBy={sortBy}
        searchQuery={searchQuery}
        removingId={removingId}
        onToggle={toggleTodo}
        onDelete={handleDeleteTodo}
        onEdit={(todo: Todo) => setEditingId(todo.id)}
        onSaveEdit={handleSaveEdit}
        onDragEnd={onDragEnd}
      />

      <Statistics stats={getStatistics()} />
    </div>
  )
}

export default App
