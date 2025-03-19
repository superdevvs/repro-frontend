
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useAuth } from '@/components/auth/AuthProvider';
import { 
  CheckCircleIcon, 
  ClockIcon, 
  ListChecksIcon, 
  PlusIcon, 
  TagIcon, 
  TrashIcon, 
  UserIcon 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock task data
const initialTasks = [
  {
    id: '1',
    title: 'Edit property photos for 123 Main St',
    description: 'Need to color correct and crop all exterior shots',
    assignedTo: 'editor',
    status: 'pending',
    priority: 'high',
    createdBy: 'John Doe (Photographer)',
    createdAt: '2023-05-15T10:30:00',
    relatedShoot: '001',
    dueDate: '2023-05-17',
  },
  {
    id: '2',
    title: 'Follow up with client about shoot schedule',
    description: 'Call ABC Properties to confirm appointment time',
    assignedTo: 'rep',
    status: 'completed',
    priority: 'medium',
    createdBy: 'Admin User',
    createdAt: '2023-05-14T14:00:00',
    relatedShoot: null,
    dueDate: '2023-05-15',
  },
  {
    id: '3',
    title: 'Upload RAW files for 456 Park Avenue',
    description: 'Need to upload all the RAW files for post-processing',
    assignedTo: 'editor',
    status: 'pending',
    priority: 'medium',
    createdBy: 'Jane Smith (Photographer)',
    createdAt: '2023-05-16T09:15:00',
    relatedShoot: '002',
    dueDate: '2023-05-18',
  },
];

// Task type definition
type TaskStatus = 'pending' | 'in-progress' | 'completed';
type TaskPriority = 'low' | 'medium' | 'high';
type TaskAssignee = 'editor' | 'rep' | 'photographer' | 'admin';

interface Task {
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

interface TaskManagerProps {
  className?: string;
  showAllTasks?: boolean;
  relatedShootId?: string;
}

export function TaskManager({ className, showAllTasks = true, relatedShootId }: TaskManagerProps) {
  const { user, role } = useAuth();
  const { toast } = useToast();
  
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [newTaskOpen, setNewTaskOpen] = useState(false);
  const [editTaskId, setEditTaskId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | TaskStatus>('all');
  
  // New task form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState<TaskAssignee>('editor');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [relatedShoot, setRelatedShoot] = useState<string | null>(relatedShootId || null);
  
  // Filter tasks based on current filters and related shoot id
  const filteredTasks = tasks.filter(task => {
    // Filter by status
    if (filter !== 'all' && task.status !== filter) return false;
    
    // Filter by related shoot if specified
    if (relatedShootId && task.relatedShoot !== relatedShootId) return false;
    
    // Show only relevant tasks based on user role
    if (role === 'editor' && task.assignedTo !== 'editor') return false;
    if (role === 'photographer' && task.createdBy !== user?.name && task.assignedTo !== 'photographer') return false;
    
    return true;
  });
  
  // Handle creating a new task
  const handleCreateTask = () => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Task title is required",
        variant: "destructive",
      });
      return;
    }
    
    const newTask: Task = {
      id: (tasks.length + 1).toString(),
      title,
      description,
      assignedTo,
      status: 'pending',
      priority,
      createdBy: user?.name || 'Unknown',
      createdAt: new Date().toISOString(),
      relatedShoot,
      dueDate,
    };
    
    setTasks([...tasks, newTask]);
    resetForm();
    setNewTaskOpen(false);
    
    toast({
      title: "Task created",
      description: "The task has been successfully created",
    });
  };
  
  // Handle editing a task
  const handleEditTask = () => {
    if (!editTaskId) return;
    
    const updatedTasks = tasks.map(task => {
      if (task.id === editTaskId) {
        return {
          ...task,
          title,
          description,
          assignedTo,
          priority,
          dueDate,
        };
      }
      return task;
    });
    
    setTasks(updatedTasks);
    resetForm();
    setEditTaskId(null);
    
    toast({
      title: "Task updated",
      description: "The task has been successfully updated",
    });
  };
  
  // Delete a task
  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
    
    toast({
      title: "Task deleted",
      description: "The task has been successfully deleted",
    });
  };
  
  // Update task status
  const handleStatusChange = (id: string, newStatus: TaskStatus) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === id) {
        return { ...task, status: newStatus };
      }
      return task;
    });
    
    setTasks(updatedTasks);
    
    toast({
      title: "Status updated",
      description: `Task marked as ${newStatus}`,
    });
  };
  
  // Reset form fields
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setAssignedTo('editor');
    setPriority('medium');
    setDueDate('');
    setRelatedShoot(relatedShootId || null);
  };
  
  // Edit a task
  const startEditTask = (task: Task) => {
    setTitle(task.title);
    setDescription(task.description);
    setAssignedTo(task.assignedTo);
    setPriority(task.priority);
    setDueDate(task.dueDate);
    setRelatedShoot(task.relatedShoot);
    setEditTaskId(task.id);
    setNewTaskOpen(true);
  };
  
  // Get color for priority badge
  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'low':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'high':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return '';
    }
  };
  
  // Get color for status badge
  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'in-progress':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'completed':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      default:
        return '';
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Check if user can edit this task based on role
  const canEditTask = (task: Task) => {
    if (['admin', 'superadmin'].includes(role)) return true;
    if (role === 'photographer' && task.createdBy.includes(user?.name || '')) return true;
    if (role === 'editor' && task.assignedTo === 'editor') return true;
    return false;
  };
  
  return (
    <div className={className}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <ListChecksIcon className="h-5 w-5 text-primary" />
            <CardTitle>Tasks & To-Do</CardTitle>
          </div>
          
          <div className="flex items-center gap-2">
            {['admin', 'superadmin', 'photographer', 'rep'].includes(role) && (
              <Button size="sm" onClick={() => {
                resetForm();
                setEditTaskId(null);
                setNewTaskOpen(true);
              }} className="gap-1">
                <PlusIcon className="h-4 w-4" />
                New Task
              </Button>
            )}
            
            {showAllTasks && (
              <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tasks</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="p-4">
          {filteredTasks.length > 0 ? (
            <div className="space-y-3">
              {filteredTasks.map(task => (
                <div key={task.id} className="p-3 border rounded-md hover:bg-secondary/10 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{task.title}</h3>
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                        <Badge className={getStatusColor(task.status)}>
                          {task.status}
                        </Badge>
                      </div>
                      
                      {task.description && (
                        <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                      )}
                      
                      <div className="text-xs text-muted-foreground grid grid-cols-2 gap-x-4 gap-y-1">
                        <div className="flex items-center gap-1">
                          <UserIcon className="h-3 w-3" />
                          <span>Assigned to: {task.assignedTo}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ClockIcon className="h-3 w-3" />
                          <span>Due: {formatDate(task.dueDate)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <UserIcon className="h-3 w-3" />
                          <span>Created by: {task.createdBy}</span>
                        </div>
                        {task.relatedShoot && (
                          <div className="flex items-center gap-1">
                            <TagIcon className="h-3 w-3" />
                            <span>Shoot ID: {task.relatedShoot}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-1 ml-4">
                      {task.status !== 'completed' && (
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleStatusChange(task.id, 'completed')}
                          className="h-8 w-8 p-0"
                        >
                          <CheckCircleIcon className="h-4 w-4 text-green-500" />
                        </Button>
                      )}
                      
                      {canEditTask(task) && (
                        <>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => startEditTask(task)}
                            className="h-8 w-8 p-0"
                          >
                            <PlusIcon className="h-4 w-4 text-muted-foreground" />
                          </Button>
                          
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => handleDeleteTask(task.id)}
                            className="h-8 w-8 p-0"
                          >
                            <TrashIcon className="h-4 w-4 text-destructive" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ListChecksIcon className="h-10 w-10 mx-auto text-muted-foreground opacity-20 mb-3" />
              <p className="text-muted-foreground">No tasks found</p>
              {['admin', 'superadmin', 'photographer', 'rep'].includes(role) && (
                <Button variant="outline" className="mt-4" onClick={() => setNewTaskOpen(true)}>
                  Create a task
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Create/Edit Task Dialog */}
      <Dialog open={newTaskOpen} onOpenChange={setNewTaskOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editTaskId ? 'Edit Task' : 'Create New Task'}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Task Title
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter task description"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="assignedTo" className="text-sm font-medium">
                  Assign To
                </label>
                <Select value={assignedTo} onValueChange={(value: TaskAssignee) => setAssignedTo(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="rep">Sales Rep</SelectItem>
                    <SelectItem value="photographer">Photographer</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="priority" className="text-sm font-medium">
                  Priority
                </label>
                <Select value={priority} onValueChange={(value: TaskPriority) => setPriority(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="dueDate" className="text-sm font-medium">
                Due Date
              </label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            
            {!relatedShootId && (
              <div className="space-y-2">
                <label htmlFor="relatedShoot" className="text-sm font-medium">
                  Related Shoot ID (optional)
                </label>
                <Input
                  id="relatedShoot"
                  value={relatedShoot || ''}
                  onChange={(e) => setRelatedShoot(e.target.value || null)}
                  placeholder="Enter shoot ID"
                />
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              resetForm();
              setNewTaskOpen(false);
              setEditTaskId(null);
            }}>
              Cancel
            </Button>
            <Button onClick={editTaskId ? handleEditTask : handleCreateTask}>
              {editTaskId ? 'Update Task' : 'Create Task'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
