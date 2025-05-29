import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoInput } from '../TodoInput';

describe('TodoInput', () => {
  const mockOnAdd = jest.fn();

  beforeEach(() => {
    mockOnAdd.mockClear();
  });

  it('renders input fields and add button', () => {
    render(<TodoInput onAdd={mockOnAdd} />);
    
    expect(screen.getByPlaceholderText('할 일을 입력하세요')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '추가' })).toBeInTheDocument();
  });

  it('calls onAdd with correct values when form is submitted', async () => {
    render(<TodoInput onAdd={mockOnAdd} />);
    
    const input = screen.getByPlaceholderText('할 일을 입력하세요');
    const prioritySelect = screen.getByRole('combobox');
    const addButton = screen.getByRole('button', { name: '추가' });

    await userEvent.type(input, '새로운 할 일');
    await userEvent.selectOptions(prioritySelect, 'high');
    await userEvent.click(addButton);

    expect(mockOnAdd).toHaveBeenCalledWith('새로운 할 일', 'high', '');
  });

  it('does not call onAdd when input is empty', async () => {
    render(<TodoInput onAdd={mockOnAdd} />);
    
    const addButton = screen.getByRole('button', { name: '추가' });
    await userEvent.click(addButton);

    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  it('clears input after adding todo', async () => {
    render(<TodoInput onAdd={mockOnAdd} />);
    
    const input = screen.getByPlaceholderText('할 일을 입력하세요');
    const addButton = screen.getByRole('button', { name: '추가' });

    await userEvent.type(input, '새로운 할 일');
    await userEvent.click(addButton);

    expect(input).toHaveValue('');
  });
}); 