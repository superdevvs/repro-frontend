
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Task, TaskAssignee, TaskPriority } from './TaskTypes';
import { cn } from '@/lib/utils';

interface TaskFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  assignedTo: TaskAssignee;
  priority: TaskPriority;
  dueDate: string;
  relatedShoot: string | null;
  relatedShootId?: string;
  isEdit: boolean;
  isMobile: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setAssignedTo: (assignedTo: TaskAssignee) => void;
  setPriority: (priority: TaskPriority) => void;
  setDueDate: (dueDate: string) => void;
  setRelatedShoot: (relatedShoot: string | null) => void;
}

export function TaskFormDialog({
  open,
  onOpenChange,
  title,
  description,
  assignedTo,
  priority,
  dueDate,
  relatedShoot,
  relatedShootId,
  isEdit,
  isMobile,
  onCancel,
  onSubmit,
  setTitle,
  setDescription,
  setAssignedTo,
  setPriority,
  setDueDate,
  setRelatedShoot
}: TaskFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "sm:max-w-md",
        isMobile && "max-w-[95%] p-4"
      )}>
        <DialogHeader>
          <DialogTitle className="text-xl">
            {isEdit ? 'Edit Task' : 'Create New Task'}
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
            onClick={onCancel}
            className={isMobile ? "w-full" : ""}
          >
            Cancel
          </Button>
          <Button 
            onClick={onSubmit}
            className={isMobile ? "w-full" : ""}
          >
            {isEdit ? 'Update Task' : 'Create Task'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
