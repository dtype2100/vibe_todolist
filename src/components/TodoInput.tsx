import React, { useState } from 'react';
import type { PriorityType } from '../types';

interface TodoInputProps {
  onAdd: (text: string, priority: PriorityType, dueDate: string) => void;
}

export const TodoInput: React.FC<TodoInputProps> = ({ onAdd }) => {
  const [input, setInput] = useState('');
  const [priority, setPriority] = useState<PriorityType>('medium');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = () => {
    if (input.trim() === '') return;
    onAdd(input, priority, dueDate);
    setInput('');
    setDueDate('');
  };

  return (
    <div className="input-section">
      <div className="input-row">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="할 일을 입력하세요"
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
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
        <button onClick={handleSubmit}>추가</button>
      </div>
    </div>
  );
}; 