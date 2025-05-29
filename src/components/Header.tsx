import React from 'react';

interface HeaderProps {
  isDarkMode: boolean;
  onThemeToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isDarkMode, onThemeToggle }) => {
  return (
    <div className="header">
      <h1>Todo List</h1>
      <button 
        className="theme-toggle"
        onClick={onThemeToggle}
      >
        {isDarkMode ? '☀️' : '🌙'}
      </button>
    </div>
  );
}; 