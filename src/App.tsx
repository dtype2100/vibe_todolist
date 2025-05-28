import { useState, useEffect } from 'react'
import './App.css'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import type { DropResult } from '@hello-pangea/dnd'

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  dueDate: string | null;
}

type FilterType = 'all' | 'active' | 'completed';
type PriorityType = 'high' | 'medium' | 'low';
type SortType = 'priority' | 'dueDate' | 'none';

function App() {
  return <AppContent />;
}

function AppContent() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [priority, setPriority] = useState<PriorityType>('medium');
  const [dueDate, setDueDate] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortType>('none');

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    document.body.className = isDarkMode ? 'dark-mode' : '';
  }, [isDarkMode]);

  const addTodo = () => {
    if (input.trim() === '') return;
    setTodos([
      ...todos,
      { 
        id: Date.now(), 
        text: input, 
        completed: false, 
        priority,
        dueDate: dueDate || null
      },
    ]);
    setInput('');
    setDueDate('');
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setRemovingId(id);
    setTimeout(() => {
      setTodos(todos.filter(todo => todo.id !== id));
      setRemovingId(null);
    }, 300);
  };

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
    setPriority(todo.priority);
    setDueDate(todo.dueDate || '');
  };

  const saveEdit = (id: number) => {
    if (editText.trim() === '') return;
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, text: editText, priority, dueDate: dueDate || null } : todo
      )
    );
    setEditingId(null);
    setEditText('');
    setDueDate('');
  };

  const filteredTodos = todos.filter(todo => {
    const matchesFilter = filter === 'all' || 
      (filter === 'active' && !todo.completed) || 
      (filter === 'completed' && todo.completed);
    
    const matchesSearch = searchQuery === '' || 
      todo.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (todo.dueDate && formatDate(todo.dueDate).toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  const getPriorityColor = (priority: PriorityType) => {
    switch (priority) {
      case 'high':
        return '#ff4d4d';
      case 'medium':
        return '#ffa64d';
      case 'low':
        return '#4dff4d';
      default:
        return 'transparent';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isOverdue = (dateString: string | null) => {
    if (!dateString) return false;
    const dueDate = new Date(dateString);
    const today = new Date();
    return dueDate < today && !todos.find(todo => todo.dueDate === dateString)?.completed;
  };

  const getSortedTodos = (todos: Todo[]) => {
    switch (sortBy) {
      case 'priority':
        return [...todos].sort((a, b) => {
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
      case 'dueDate':
        return [...todos].sort((a, b) => {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        });
      default:
        return todos;
    }
  };

  const filteredAndSortedTodos = getSortedTodos(filteredTodos);

  const getStatistics = () => {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const active = total - completed;
    const priorityCounts = {
      high: todos.filter(todo => todo.priority === 'high').length,
      medium: todos.filter(todo => todo.priority === 'medium').length,
      low: todos.filter(todo => todo.priority === 'low').length
    };
    const overdue = todos.filter(todo => isOverdue(todo.dueDate)).length;

    return {
      total,
      completed,
      active,
      priorityCounts,
      overdue,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  };

  const stats = getStatistics();

  // 진행률 바 색상 변화용 데이터 속성
  const progressRate = stats.completionRate;

  // 아이콘용 유틸
  const priorityIcon = {
    high: '🔥',
    medium: '⚡',
    low: '🍃',
  };

  // 드래그 앤 드롭 순서 변경 핸들러
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const newTodos = Array.from(todos);
    const [removed] = newTodos.splice(result.source.index, 1);
    newTodos.splice(result.destination.index, 0, removed);
    setTodos(newTodos);
  };

  return (
    <div className={`todo-app ${isDarkMode ? 'dark' : ''}`}>
      <div className="header">
        <h1>Todo List</h1>
        <button 
          className="theme-toggle"
          onClick={() => setIsDarkMode(!isDarkMode)}
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </div>
      <div className="search-section">
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="할 일 검색..."
          className="search-input"
        />
      </div>
      <div className="input-section">
        <div className="input-row">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="할 일을 입력하세요"
            onKeyDown={e => e.key === 'Enter' && addTodo()}
            autoFocus
          />
        </div>
        <div className="input-row input-row-bottom">
          <input
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            className="date-input"
          />
          <select 
            value={priority} 
            onChange={e => setPriority(e.target.value as PriorityType)}
            className="priority-select"
          >
            <option value="high">높음</option>
            <option value="medium">중간</option>
            <option value="low">낮음</option>
          </select>
          <button onClick={addTodo} disabled={input.trim() === ''}>추가</button>
        </div>
      </div>
      <div className="filter-sort-section">
        <div className="filter-buttons">
          <button 
            className={filter === 'all' ? 'active' : ''} 
            onClick={() => setFilter('all')}
          >
            전체
          </button>
          <button 
            className={filter === 'active' ? 'active' : ''} 
            onClick={() => setFilter('active')}
          >
            진행중
          </button>
          <button 
            className={filter === 'completed' ? 'active' : ''} 
            onClick={() => setFilter('completed')}
          >
            완료
          </button>
        </div>
        <div className="sort-select-wrapper">
          <select 
            value={sortBy} 
            onChange={e => setSortBy(e.target.value as SortType)}
            className="sort-select"
          >
            <option value="none">정렬 안함</option>
            <option value="priority">우선순위순 ↓</option>
            <option value="dueDate">마감일순 ↑</option>
          </select>
        </div>
      </div>
      <div className="stats-section">
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">전체</span>
            <span className="stat-value">{stats.total}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">완료</span>
            <span className="stat-value">{stats.completed}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">진행중</span>
            <span className="stat-value">{stats.active}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">지연</span>
            <span className="stat-value">{stats.overdue}</span>
          </div>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${progressRate}%` }}
            data-rate={progressRate}
          />
          <span className="progress-text">{progressRate}% 완료</span>
        </div>
        <div className="priority-stats">
          <div className="priority-stat">
            <span className="priority-dot high">🔥</span>
            <span>높음: {stats.priorityCounts.high}</span>
          </div>
          <div className="priority-stat">
            <span className="priority-dot medium">⚡</span>
            <span>중간: {stats.priorityCounts.medium}</span>
          </div>
          <div className="priority-stat">
            <span className="priority-dot low">🍃</span>
            <span>낮음: {stats.priorityCounts.low}</span>
          </div>
        </div>
      </div>
      {filteredAndSortedTodos.length === 0 ? (
        <div className="empty-message">
          <span className="empty-icon" role="img" aria-label="할 일 없음">✅</span>
          <div>할 일이 없습니다.</div>
          <div className="empty-tip">할 일을 입력하고 추가 버튼을 눌러보세요!</div>
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="todo-list">
            {(provided) => (
              <ul className="todo-list" ref={provided.innerRef} {...provided.droppableProps}>
                {filteredAndSortedTodos.map((todo, index) => (
                  <Draggable key={todo.id} draggableId={todo.id.toString()} index={index}>
                    {(provided, snapshot) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`${todo.completed ? 'completed' : ''} ${removingId === todo.id ? 'removing' : ''} ${isOverdue(todo.dueDate) ? 'overdue' : ''} ${snapshot.isDragging ? 'dragging' : ''}`}
                        style={{
                          borderLeft: `4px solid ${getPriorityColor(todo.priority)}`,
                          ...provided.draggableProps.style
                        }}
                        tabIndex={0}
                        title="할 일 텍스트를 클릭하면 완료/미완료 전환, 모바일에서 길게 누르면 수정 가능"
                        onTouchStart={e => {
                          const timeout = setTimeout(() => startEditing(todo), 600);
                          e.currentTarget.ontouchend = () => clearTimeout(timeout);
                          e.currentTarget.ontouchmove = () => clearTimeout(timeout);
                        }}
                      >
                        {editingId === todo.id ? (
                          <div className="edit-section">
                            <input
                              type="text"
                              value={editText}
                              onChange={e => setEditText(e.target.value)}
                              onKeyDown={e => e.key === 'Enter' && saveEdit(todo.id)}
                              autoFocus
                            />
                            <input
                              type="date"
                              value={dueDate}
                              onChange={e => setDueDate(e.target.value)}
                              className="date-input"
                            />
                            <select 
                              value={priority} 
                              onChange={e => setPriority(e.target.value as PriorityType)}
                              className="priority-select"
                            >
                              <option value="high">높음</option>
                              <option value="medium">중간</option>
                              <option value="low">낮음</option>
                            </select>
                            <button onClick={() => saveEdit(todo.id)} aria-label="저장">저장</button>
                            <button onClick={() => setEditingId(null)} aria-label="취소">취소</button>
                          </div>
                        ) : (
                          <div className="todo-card-row">
                            <div className="todo-card-main">
                              <span className="priority-badge" title={`우선순위: ${todo.priority}`}>{priorityIcon[todo.priority]}</span>
                              <span className="todo-text" onClick={() => toggleTodo(todo.id)}>{todo.text}</span>
                              {todo.completed && <span className="state-badge completed">완료</span>}
                              {isOverdue(todo.dueDate) && !todo.completed && <span className="state-badge overdue">지연</span>}
                            </div>
                            <div className="todo-card-meta">
                              {todo.dueDate && (
                                <span className={`due-date ${isOverdue(todo.dueDate) ? 'overdue' : ''}`}>
                                  {formatDate(todo.dueDate)}
                                </span>
                              )}
                              <div className="button-group">
                                <button onClick={() => startEditing(todo)} aria-label="수정" className="icon-btn">
                                  <span role="img" aria-label="수정">✏️</span>
                                  <span className="btn-text">수정</span>
                                </button>
                                <button onClick={() => deleteTodo(todo.id)} aria-label="삭제" className="icon-btn">
                                  <span role="img" aria-label="삭제">🗑️</span>
                                  <span className="btn-text">삭제</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      )}
      <div className="mobile-tip">모바일에서는 할 일을 길게 누르면 수정할 수 있습니다.</div>
    </div>
  );
}

export default App
