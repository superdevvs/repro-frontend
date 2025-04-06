
import React from 'react';
import { Task, TaskStatus } from './TaskTypes';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { formatDate, getStatusColor, getPriorityColor, getPriorityIcon, isPastDue } from './TaskUtils';
import { CheckSquare, Square, UserCheck, ClockIcon, Tag, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

interface TaskItemProps {
  task: Task;
  onStatusChange: (id: string, newStatus: TaskStatus) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  canEdit: boolean;
}

export function TaskItem({ task, onStatusChange, onEdit, onDelete, canEdit }: TaskItemProps) {
  return (
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
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onStatusChange(
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
                    {getPriorityIcon(task.priority) && (
                      task.priority === 'high' ? <span>↑</span> : <span>↓</span>
                    )}
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
              {canEdit && (
                <>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => onEdit(task)} 
                    className="h-8 w-8 p-0 rounded-full"
                  >
                    <Pencil className="h-4 w-4 text-muted-foreground" />
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => onDelete(task.id)} 
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
  );
}
