
import { Task } from './TaskTypes';

// Mock task data
export const initialTasks: Task[] = [{
  id: '1',
  title: 'Edit property photos for 123 Main St',
  description: 'Need to color correct and crop all exterior shots',
  assignedTo: 'editor',
  status: 'pending',
  priority: 'high',
  createdBy: 'John Doe (Photographer)',
  createdAt: '2023-05-15T10:30:00',
  relatedShoot: '001',
  dueDate: '2023-05-17'
}, {
  id: '2',
  title: 'Follow up with client about shoot schedule',
  description: 'Call ABC Properties to confirm appointment time',
  assignedTo: 'rep',
  status: 'completed',
  priority: 'medium',
  createdBy: 'Admin User',
  createdAt: '2023-05-14T14:00:00',
  relatedShoot: null,
  dueDate: '2023-05-15'
}, {
  id: '3',
  title: 'Upload RAW files for 456 Park Avenue',
  description: 'Need to upload all the RAW files for post-processing',
  assignedTo: 'editor',
  status: 'pending',
  priority: 'medium',
  createdBy: 'Jane Smith (Photographer)',
  createdAt: '2023-05-16T09:15:00',
  relatedShoot: '002',
  dueDate: '2023-05-18'
}];
