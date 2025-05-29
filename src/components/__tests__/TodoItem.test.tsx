import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoItem } from '../TodoItem';
import type { Todo } from '../../types';

describe('TodoItem', () => {
  const mockTodo: Todo = {
    id: 1,
    text: '테스트 할 일',
    completed: false,
    priority: 'high',
    dueDate: '2024-03-20'
  };

  const mockOnToggle = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnEdit = jest.fn();
  const mockOnSaveEdit = jest.fn();

  beforeEach(() => {
    mockOnToggle.mockClear();
    mockOnDelete.mockClear();
    mockOnEdit.mockClear();
    mockOnSaveEdit.mockClear();
  });

  it('renders todo item with correct content', () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
        onSaveEdit={mockOnSaveEdit}
        isRemoving={false}
      />
    );

    expect(screen.getByText('테스트 할 일')).toBeInTheDocument();
    expect(screen.getByText('🔥')).toBeInTheDocument();
    expect(screen.getByText('2024년 3월 20일')).toBeInTheDocument();
  });

  it('calls onToggle when checkbox is clicked', async () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
        onSaveEdit={mockOnSaveEdit}
        isRemoving={false}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    await userEvent.click(checkbox);

    expect(mockOnToggle).toHaveBeenCalledWith(mockTodo.id);
  });

  it('calls onDelete when delete button is clicked', async () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
        onSaveEdit={mockOnSaveEdit}
        isRemoving={false}
      />
    );

    const deleteButton = screen.getByRole('button', { name: '삭제' });
    await userEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith(mockTodo.id);
  });

  it('calls onEdit when edit button is clicked', async () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
        onSaveEdit={mockOnSaveEdit}
        isRemoving={false}
      />
    );

    const editButton = screen.getByRole('button', { name: '수정' });
    await userEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith(mockTodo);
  });

  it('shows edit form when in editing mode', async () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
        onSaveEdit={mockOnSaveEdit}
        isRemoving={false}
      />
    );

    const editButton = screen.getByRole('button', { name: '수정' });
    await userEvent.click(editButton);

    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '저장' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '취소' })).toBeInTheDocument();
  });

  it('calls onSaveEdit with correct values when save button is clicked', async () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
        onSaveEdit={mockOnSaveEdit}
        isRemoving={false}
      />
    );

    const editButton = screen.getByRole('button', { name: '수정' });
    await userEvent.click(editButton);

    const textInput = screen.getByRole('textbox');
    const prioritySelect = screen.getByRole('combobox');
    const saveButton = screen.getByRole('button', { name: '저장' });

    await userEvent.clear(textInput);
    await userEvent.type(textInput, '수정된 할 일');
    await userEvent.selectOptions(prioritySelect, 'medium');
    await userEvent.click(saveButton);

    expect(mockOnSaveEdit).toHaveBeenCalledWith(
      mockTodo.id,
      '수정된 할 일',
      'medium',
      mockTodo.dueDate
    );
  });
}); 