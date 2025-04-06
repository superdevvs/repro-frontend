
import { format } from 'date-fns';
import { Task, TaskPriority, TaskStatus } from './TaskTypes';

// Get color for priority badge
export const getPriorityColor = (priority: TaskPriority) => {
  switch (priority) {
    case 'low':
      return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    case 'medium':
      return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    case 'high':
      return 'bg-red-500/10 text-red-500 border-red-500/20';
    default:
      return '';
  }
};

// Get icon for priority
export const getPriorityIcon = (priority: TaskPriority) => {
  switch (priority) {
    case 'high':
      return '↑';
    case 'low':
      return '↓';
    default:
      return null;
  }
};

// Get color for status badge
export const getStatusColor = (status: TaskStatus) => {
  switch (status) {
    case 'pending':
      return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    case 'in-progress':
      return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    case 'completed':
      return 'bg-green-500/10 text-green-500 border-green-500/20';
    default:
      return '';
  }
};

// Format date for display
export const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return format(date, 'MMM d, yyyy');
  } catch (error) {
    return dateString;
  }
};

// Check if date is past due
export const isPastDue = (dateString: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(dateString);
  dueDate.setHours(0, 0, 0, 0);
  return dueDate < today;
};

// Filter and sort tasks
export const processTasksData = (
  tasks: Task[], 
  filter: 'all' | TaskStatus,
  priorityFilter: 'all' | TaskPriority,
  sortBy: 'dueDate' | 'priority',
  sortDirection: 'asc' | 'desc',
  relatedShootId: string | undefined,
  role: string,
  userName?: string
) => {
  return tasks
    .filter(task => {
      // Filter by status
      if (filter !== 'all' && task.status !== filter) return false;
      
      // Filter by priority
      if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;

      // Filter by related shoot if specified
      if (relatedShootId && task.relatedShoot !== relatedShootId) return false;

      // Show only relevant tasks based on user role
      if (role === 'editor' && task.assignedTo !== 'editor') return false;
      if (role === 'photographer' && task.createdBy !== userName && task.assignedTo !== 'photographer') return false;
      
      return true;
    })
    .sort((a, b) => {
      // Sort by selected criteria
      if (sortBy === 'dueDate') {
        const dateA = new Date(a.dueDate);
        const dateB = new Date(b.dueDate);
        return sortDirection === 'asc' 
          ? dateA.getTime() - dateB.getTime() 
          : dateB.getTime() - dateA.getTime();
      } else if (sortBy === 'priority') {
        const priorityValues = { 'high': 3, 'medium': 2, 'low': 1 };
        const priorityA = priorityValues[a.priority];
        const priorityB = priorityValues[b.priority];
        return sortDirection === 'asc'
          ? priorityA - priorityB
          : priorityB - priorityA;
      }
      return 0;
    });
};
