export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  priority: PriorityType;
  dueDate: string | null;
}

export type FilterType = 'all' | 'active' | 'completed';
export type PriorityType = 'high' | 'medium' | 'low';
export type SortType = 'priority' | 'dueDate' | 'none';

export interface Statistics {
  total: number;
  completed: number;
  active: number;
  priorityCounts: {
    high: number;
    medium: number;
    low: number;
  };
  overdue: number;
  completionRate: number;
} 