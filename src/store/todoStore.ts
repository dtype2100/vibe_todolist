import { create } from 'zustand';
import type { Todo, PriorityType } from '../types';

interface TodoStore {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  addTodo: (text: string, priority: PriorityType, dueDate: string) => void;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  editTodo: (id: number, text: string, priority: PriorityType, dueDate: string) => void;
}

const loadTodos = (): Todo[] => {
  try {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  } catch (error) {
    console.error('Failed to load todos from localStorage:', error);
    return [];
  }
};

export const useTodoStore = create<TodoStore>((set, get) => ({
  todos: loadTodos(),
  setTodos: (todos) => {
    set({ todos });
    localStorage.setItem('todos', JSON.stringify(todos));
  },
  addTodo: (text, priority, dueDate) => {
    const newTodo = {
      id: Date.now(),
      text,
      completed: false,
      priority,
      dueDate: dueDate || null
    };
    const newTodos = [...get().todos, newTodo];
    set({ todos: newTodos });
    localStorage.setItem('todos', JSON.stringify(newTodos));
  },
  toggleTodo: (id) => {
    const newTodos = get().todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    set({ todos: newTodos });
    localStorage.setItem('todos', JSON.stringify(newTodos));
  },
  deleteTodo: (id) => {
    const newTodos = get().todos.filter(todo => todo.id !== id);
    set({ todos: newTodos });
    localStorage.setItem('todos', JSON.stringify(newTodos));
  },
  editTodo: (id, text, priority, dueDate) => {
    const newTodos = get().todos.map(todo =>
      todo.id === id ? { ...todo, text, priority, dueDate: dueDate || null } : todo
    );
    set({ todos: newTodos });
    localStorage.setItem('todos', JSON.stringify(newTodos));
  },
})); 