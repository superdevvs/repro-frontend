
import React from 'react';
import { CheckCircle, Circle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  assignedTo?: string;
}

interface TaskApprovalPanelProps {
  projectId: string;
  tasks: Task[];
  progress: number;
  onTaskToggle: (taskId: string, completed: boolean) => void;
  onApprove: () => void;
  onRequestRevision: () => void;
  isClient: boolean;
  waitingForApproval: boolean;
}

export function TaskApprovalPanel({
  projectId,
  tasks,
  progress,
  onTaskToggle,
  onApprove,
  onRequestRevision,
  isClient,
  waitingForApproval
}: TaskApprovalPanelProps) {
  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="px-3 py-2">
        <CardTitle className="text-sm">Project Tasks & Approval</CardTitle>
      </CardHeader>
      
      <CardContent className="px-3 py-2 space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-xs font-medium">Project Progress</p>
            <p className="text-xs">{progress}%</p>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>
        
        <div className="space-y-1">
          <p className="text-xs font-medium mb-1">Tasks</p>
          {tasks.map((task) => (
            <div 
              key={task.id}
              className="flex items-start gap-2 py-1"
            >
              <Button
                variant="ghost"
                size="icon"
                disabled={isClient}
                className="h-5 w-5 p-0 mt-0.5"
                onClick={() => onTaskToggle(task.id, !task.completed)}
              >
                {task.completed ? (
                  <CheckCircle className="h-4 w-4 text-primary" />
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
              
              <div className="text-sm">
                <p className={task.completed ? 'line-through text-muted-foreground' : ''}>
                  {task.title}
                </p>
                {task.assignedTo && (
                  <p className="text-xs text-muted-foreground">
                    Assigned to: {task.assignedTo}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {isClient && waitingForApproval && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-amber-500 text-sm py-2 px-3 bg-amber-50 rounded-md">
              <AlertCircle className="h-4 w-4" />
              <p>Your approval is requested</p>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="w-full text-red-500 border-red-200 hover:bg-red-50"
                onClick={onRequestRevision}
              >
                Request Revision
              </Button>
              
              <Button 
                variant="default" 
                size="sm"
                className="w-full"
                onClick={onApprove}
              >
                Approve
              </Button>
            </div>
          </div>
        )}
        
        {!isClient && progress === 100 && !waitingForApproval && (
          <Button 
            variant="default" 
            size="sm"
            className="w-full"
            onClick={onApprove}
          >
            Request Client Approval
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
