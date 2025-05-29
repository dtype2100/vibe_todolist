export const formatDate = (dateString: string | null): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const isOverdue = (dateString: string | null, isCompleted: boolean): boolean => {
  if (!dateString || isCompleted) return false;
  const dueDate = new Date(dateString);
  const today = new Date();
  return dueDate < today;
}; 