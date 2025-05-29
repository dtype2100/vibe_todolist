import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import type { Todo, FilterType, SortType, PriorityType } from '../types';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  filter: FilterType;
  sortBy: SortType;
  searchQuery: string;
  removingId: number | null;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (todo: Todo) => void;
  onSaveEdit: (id: number, text: string, priority: PriorityType, dueDate: string) => void;
  onDragEnd: (result: DropResult) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  filter,
  sortBy,
  searchQuery,
  removingId,
  onToggle,
  onDelete,
  onEdit,
  onSaveEdit,
  onDragEnd
}) => {
  const filteredTodos = todos.filter(todo => {
    const matchesFilter = filter === 'all' || 
      (filter === 'active' && !todo.completed) || 
      (filter === 'completed' && todo.completed);
    
    const matchesSearch = searchQuery === '' || 
      todo.text.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

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

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="todos">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="todo-list"
          >
            {filteredAndSortedTodos.map((todo, index) => (
              <Draggable
                key={todo.id}
                draggableId={todo.id.toString()}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <TodoItem
                      todo={todo}
                      onToggle={onToggle}
                      onDelete={onDelete}
                      onEdit={onEdit}
                      onSaveEdit={onSaveEdit}
                      isRemoving={removingId === todo.id}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}; 