
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useAuth } from '@/components/auth/AuthProvider';
import { 
  CheckCircle, 
  ClockIcon, 
  ListChecks, 
  Plus, 
  Tag, 
  Trash2, 
  UserCheck, 
  Calendar, 
  Filter, 
  Edit2, 
  Pencil,
  CheckSquare, 
  Square,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  RotateCcw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { format } from 'date-fns';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { TaskManager as TaskManagerInterface } from '@/components/dashboard/TaskInterfaces';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

// Export Task types to a separate file for better organization
// Mock task data
const initialTasks = [{
  id: '1',
  title: 'Edit property photos for 123 Main St',
  description: 'Need to color correct and crop all exterior shots',
  assignedTo: 'editor' as TaskAssignee,
  status: 'pending' as TaskStatus,
  priority: 'high' as TaskPriority,
  createdBy: 'John Doe (Photographer)',
  createdAt: '2023-05-15T10:30:00',
  relatedShoot: '001',
  dueDate: '2023-05-17'
}, {
  id: '2',
  title: 'Follow up with client about shoot schedule',
  description: 'Call ABC Properties to confirm appointment time',
  assignedTo: 'rep' as TaskAssignee,
  status: 'completed' as TaskStatus,
  priority: 'medium' as TaskPriority,
  createdBy: 'Admin User',
  createdAt: '2023-05-14T14:00:00',
  relatedShoot: null,
  dueDate: '2023-05-15'
}, {
  id: '3',
  title: 'Upload RAW files for 456 Park Avenue',
  description: 'Need to upload all the RAW files for post-processing',
  assignedTo: 'editor' as TaskAssignee,
  status: 'pending' as TaskStatus,
  priority: 'medium' as TaskPriority,
  createdBy: 'Jane Smith (Photographer)',
  createdAt: '2023-05-16T09:15:00',
  relatedShoot: '002',
  dueDate: '2023-05-18'
}];

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

export function TaskManager({
  className,
  showAllTasks = true,
  relatedShootId
}: TaskManagerProps) {
  const { user, role } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [newTaskOpen, setNewTaskOpen] = useState(false);
  const [editTaskId, setEditTaskId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | TaskStatus>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | TaskPriority>('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority'>('dueDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // New task form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState<TaskAssignee>('editor');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [relatedShoot, setRelatedShoot] = useState<string | null>(relatedShootId || null);

  // Filter and sort tasks based on current filters and related shoot id
  const processedTasks = tasks
    .filter(task => {
      // Filter by status
      if (filter !== 'all' && task.status !== filter) return false;
      
      // Filter by priority
      if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;

      // Filter by related shoot if specified
      if (relatedShootId && task.relatedShoot !== relatedShootId) return false;

      // Show only relevant tasks based on user role
      if (role === 'editor' && task.assignedTo !== 'editor') return false;
      if (role === 'photographer' && task.createdBy !== user?.name && task.assignedTo !== 'photographer') return false;
      
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

  // Handle creating a new task
  const handleCreateTask = () => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Task title is required",
        variant: "destructive"
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
      dueDate
    };
    
    setTasks([...tasks, newTask]);
    resetForm();
    setNewTaskOpen(false);
    
    toast({
      title: "Task created",
      description: "The task has been successfully created"
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
          dueDate
        };
      }
      return task;
    });
    
    setTasks(updatedTasks);
    resetForm();
    setEditTaskId(null);
    
    toast({
      title: "Task updated",
      description: "The task has been successfully updated"
    });
  };

  // Delete a task
  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
    
    toast({
      title: "Task deleted",
      description: "The task has been successfully deleted"
    });
  };

  // Update task status
  const handleStatusChange = (id: string, newStatus: TaskStatus) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === id) {
        return {
          ...task,
          status: newStatus
        };
      }
      return task;
    });
    
    setTasks(updatedTasks);
    
    toast({
      title: "Status updated",
      description: `Task marked as ${newStatus}`
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

  // Handle refresh button click
  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Refreshed",
        description: "Task list has been refreshed"
      });
    }, 800);
  };

  // Get color for priority badge
  const getPriorityColor = (priority: TaskPriority) => {
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
  const getPriorityIcon = (priority: TaskPriority) => {
    switch (priority) {
      case 'high':
        return <ArrowUp className="h-3 w-3" />;
      case 'medium':
        return null; // No icon for medium
      case 'low':
        return <ArrowDown className="h-3 w-3" />;
      default:
        return null;
    }
  };

  // Get color for status badge
  const getStatusColor = (status: TaskStatus) => {
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
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  // Check if user can edit this task based on role
  const canEditTask = (task: Task) => {
    if (['admin', 'superadmin'].includes(role)) return true;
    if (role === 'photographer' && task.createdBy.includes(user?.name || '')) return true;
    if (role === 'editor' && task.assignedTo === 'editor') return true;
    return false;
  };

  // Check if date is past due
  const isPastDue = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(dateString);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today;
  };

  return (
    <div className={className}>
      <Card className="shadow-sm border border-border/40 overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-2 bg-card border-b">
          <div className="flex items-center gap-2">
            <ListChecks className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Tasks & To-Do</CardTitle>
          </div>
          
          <div className="flex items-center gap-2">
            {['admin', 'superadmin', 'photographer', 'rep'].includes(role) && (
              <Button 
                variant="accent"
                size={isMobile ? "sm" : "default"} 
                onClick={() => {
                  resetForm();
                  setEditTaskId(null);
                  setNewTaskOpen(true);
                }} 
                className={`gap-1 font-medium ${isMobile ? 'px-2 py-1 h-8 text-sm' : ''}`}
              >
                <Plus className="h-4 w-4" />
                {!isMobile && "New Task"}
              </Button>
            )}
            
            {showAllTasks && (
              <div className="flex items-center gap-1">
                {!isMobile && (
                  <ToggleGroup 
                    type="single" 
                    value={sortBy} 
                    onValueChange={(value) => {
                      if (value) setSortBy(value as 'dueDate' | 'priority');
                    }}
                    className="bg-muted/20 p-1 rounded-lg"
                  >
                    <ToggleGroupItem value="dueDate" size="sm" className="text-xs h-7 px-2">
                      Date {sortBy === 'dueDate' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </ToggleGroupItem>
                    <ToggleGroupItem value="priority" size="sm" className="text-xs h-7 px-2">
                      Priority {sortBy === 'priority' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </ToggleGroupItem>
                  </ToggleGroup>
                )}
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-8 w-8 p-0" 
                  onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
                >
                  {sortDirection === 'asc' ? 
                    <ArrowDown className="h-4 w-4" /> : 
                    <ArrowUp className="h-4 w-4" />
                  }
                </Button>
                
                <Select 
                  value={filter} 
                  onValueChange={(value: any) => setFilter(value)}
                >
                  <SelectTrigger className={isMobile ? "w-[90px] h-8 text-xs" : "w-[120px]"}>
                    <Filter className="h-3.5 w-3.5 mr-1.5 opacity-70" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tasks</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                
                {!isMobile && (
                  <Select 
                    value={priorityFilter} 
                    onValueChange={(value: any) => setPriorityFilter(value)}
                  >
                    <SelectTrigger className="w-[120px]">
                      <AlertCircle className="h-3.5 w-3.5 mr-1.5 opacity-70" />
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                )}
                
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                >
                  <RotateCcw 
                    className={cn(
                      "h-4 w-4", 
                      isRefreshing && "animate-spin"
                    )}
                  />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className={`${isMobile ? 'p-3' : 'p-4'} bg-card/80`}>
          {processedTasks.length > 0 ? (
            <div className="space-y-4">
              <AnimatePresence initial={false}>
                {processedTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      "border rounded-lg transition-all transform hover:translate-y-[-2px]",
                      task.status === 'completed' ? "bg-muted/40 border-muted" : "bg-card hover:shadow-md border-border/70",
                    )}
                  >
                    <div className={`p-4 sm:p-5`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleStatusChange(
                              task.id, 
                              task.status === 'completed' ? 'pending' : 'completed'
                            )} 
                            className="h-6 w-6 p-0 rounded-full -mt-0.5"
                          >
                            {task.status === 'completed' ? (
                              <CheckSquare className="h-5 w-5 text-green-500" />
                            ) : (
                              <Square className="h-5 w-5 text-muted-foreground" />
                            )}
                          </Button>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1.5">
                              <h3 className={cn(
                                "text-base font-medium line-height-trim",
                                task.status === 'completed' && "line-through text-muted-foreground"
                              )}>
                                {task.title}
                              </h3>
                              
                              <div className="flex gap-1.5 flex-wrap">
                                <Badge className={cn(
                                  "px-2 py-0.5 rounded-full text-[11px] font-medium",
                                  getStatusColor(task.status)
                                )}>
                                  {task.status === 'pending' ? 'Pending' : 
                                   task.status === 'in-progress' ? 'In Progress' : 
                                   'Completed'}
                                </Badge>
                                
                                <Badge className={cn(
                                  "px-2 py-0.5 rounded-full text-[11px] font-medium flex items-center gap-1",
                                  getPriorityColor(task.priority)
                                )}>
                                  {getPriorityIcon(task.priority)}
                                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                </Badge>
                              </div>
                            </div>
                            
                            {task.description && (
                              <p className={cn(
                                "text-sm text-muted-foreground mb-3",
                                task.status === 'completed' && "text-muted-foreground/70"
                              )}>
                                {task.description}
                              </p>
                            )}
                            
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-1.5 mt-1.5">
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <UserCheck className="h-3.5 w-3.5" />
                                <span className="capitalize">{task.assignedTo}</span>
                              </div>
                              
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <ClockIcon className="h-3.5 w-3.5" />
                                <span className={cn(
                                  isPastDue(task.dueDate) && task.status !== 'completed' && "text-red-500 font-medium"
                                )}>
                                  Due: {formatDate(task.dueDate)}
                                </span>
                              </div>
                              
                              {task.relatedShoot && (
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                  <Tag className="h-3.5 w-3.5" />
                                  <span>Shoot: {task.relatedShoot}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-1 ml-2">
                            {canEditTask(task) && (
                              <>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={() => startEditTask(task)} 
                                  className="h-8 w-8 p-0 rounded-full"
                                >
                                  <Pencil className="h-4 w-4 text-muted-foreground" />
                                </Button>
                                
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={() => handleDeleteTask(task.id)} 
                                  className="h-8 w-8 p-0 rounded-full text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="p-5 rounded-full bg-muted/30 mb-3">
                <ListChecks className="h-8 w-8 text-muted-foreground opacity-40" />
              </div>
              <p className="text-muted-foreground text-lg">No tasks found</p>
              <p className="text-muted-foreground/70 text-sm max-w-md mt-1">
                {filter !== 'all' || priorityFilter !== 'all' 
                  ? "Try changing your filters or" 
                  : "Get started by"
                } creating a new task
              </p>
              {['admin', 'superadmin', 'photographer', 'rep'].includes(role) && (
                <Button 
                  variant="outline" 
                  className="mt-5 gap-2 bg-card" 
                  onClick={() => setNewTaskOpen(true)}
                >
                  <Plus className="h-4 w-4" />
                  Create a task
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Create/Edit Task Dialog */}
      <Dialog open={newTaskOpen} onOpenChange={setNewTaskOpen}>
        <DialogContent className={cn(
          "sm:max-w-md",
          isMobile && "max-w-[95%] p-4"
        )}>
          <DialogHeader>
            <DialogTitle className="text-xl">
              {editTaskId ? 'Edit Task' : 'Create New Task'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Task Title
              </label>
              <Input 
                id="title" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                placeholder="Enter task title" 
                className="text-base"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea 
                id="description" 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                placeholder="Enter task description" 
                rows={3}
              />
            </div>
            
            <div className={`${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-2 gap-4'} grid`}>
              <div className="space-y-2">
                <label htmlFor="assignedTo" className="text-sm font-medium">
                  Assign To
                </label>
                <Select 
                  value={assignedTo} 
                  onValueChange={(value: TaskAssignee) => setAssignedTo(value)}
                >
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
                <Select 
                  value={priority} 
                  onValueChange={(value: TaskPriority) => setPriority(value)}
                >
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
                onChange={e => setDueDate(e.target.value)} 
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
                  onChange={e => setRelatedShoot(e.target.value || null)} 
                  placeholder="Enter shoot ID" 
                />
              </div>
            )}
          </div>
          
          <DialogFooter className={isMobile ? "flex-col space-y-2" : ""}>
            <Button 
              variant="outline" 
              onClick={() => {
                resetForm();
                setNewTaskOpen(false);
                setEditTaskId(null);
              }}
              className={isMobile ? "w-full" : ""}
            >
              Cancel
            </Button>
            <Button 
              onClick={editTaskId ? handleEditTask : handleCreateTask}
              className={isMobile ? "w-full" : ""}
            >
              {editTaskId ? 'Update Task' : 'Create Task'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
