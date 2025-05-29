import React, { useState } from 'react';
import type { Todo, PriorityType } from '../types';
import { formatDate, isOverdue } from '../utils/dateUtils';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (todo: Todo) => void;
  onSaveEdit: (id: number, text: string, priority: PriorityType, dueDate: string) => void;
  isRemoving: boolean;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggle,
  onDelete,
  onEdit,
  onSaveEdit,
  isRemoving
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editPriority, setEditPriority] = useState<PriorityType>(todo.priority);
  const [editDueDate, setEditDueDate] = useState(todo.dueDate || '');

  const handleSave = () => {
    if (editText.trim() === '') return;
    onSaveEdit(todo.id, editText, editPriority, editDueDate);
    setIsEditing(false);
  };

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

  const priorityIcon = {
    high: '🔥',
    medium: '⚡',
    low: '🍃',
  };

  if (isEditing) {
    return (
      <div className={`todo-item editing ${isRemoving ? 'removing' : ''}`}>
        <input
          type="text"
          value={editText}
          onChange={e => setEditText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSave()}
          autoFocus
        />
        <input
          type="date"
          value={editDueDate}
          onChange={e => setEditDueDate(e.target.value)}
          className="date-input"
        />
        <select
          value={editPriority}
          onChange={e => setEditPriority(e.target.value as PriorityType)}
          className="priority-select"
        >
          <option value="high">높음</option>
          <option value="medium">중간</option>
          <option value="low">낮음</option>
        </select>
        <button onClick={handleSave}>저장</button>
        <button onClick={() => setIsEditing(false)}>취소</button>
      </div>
    );
  }

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''} ${isRemoving ? 'removing' : ''}`}>
      <div className="todo-content">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
        />
        <div className="todo-text">
          <span className="priority-icon" style={{ color: getPriorityColor(todo.priority) }}>
            {priorityIcon[todo.priority]}
          </span>
          <span className={todo.completed ? 'completed-text' : ''}>
            {todo.text}
          </span>
          {todo.dueDate && (
            <span className={`due-date ${isOverdue(todo.dueDate, todo.completed) ? 'overdue' : ''}`}>
              {formatDate(todo.dueDate)}
            </span>
          )}
        </div>
      </div>
      <div className="todo-actions">
        <button onClick={() => onEdit(todo)}>수정</button>
        <button onClick={() => onDelete(todo.id)}>삭제</button>
      </div>
    </div>
  );
}; 