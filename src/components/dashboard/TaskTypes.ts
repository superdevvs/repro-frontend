
export type TaskStatus = 'pending' | 'in-progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskAssignee = 'editor' | 'rep' | 'photographer' | 'admin';

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: TaskAssignee;
  status: TaskStatus;
  priority: TaskPriority;
  createdBy: string;
  createdAt: string;
  relatedShoot: string | null;
  dueDate: string;
}
