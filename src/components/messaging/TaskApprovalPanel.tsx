
import React from 'react';
import { CheckCircle, Circle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

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
    <Card className="border border-border/40 shadow-sm">
      <CardHeader className="px-4 py-3 border-b bg-card">
        <CardTitle className="text-base font-medium">Project Tasks & Approval</CardTitle>
      </CardHeader>
      
      <CardContent className="p-4 space-y-5">
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium">Project Progress</p>
            <p className="text-sm font-medium">{progress}%</p>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        <div className="space-y-3">
          <p className="text-sm font-medium">Tasks</p>
          {tasks.map((task) => (
            <motion.div 
              key={task.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-start gap-3 py-1.5"
            >
              <Button
                variant="ghost"
                size="icon"
                disabled={isClient}
                className="h-5 w-5 p-0 mt-0.5"
                onClick={() => onTaskToggle(task.id, !task.completed)}
              >
                {task.completed ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground/50" />
                )}
              </Button>
              
              <div className="text-sm">
                <p className={cn(
                  "font-medium leading-snug",
                  task.completed ? 'line-through text-muted-foreground' : ''
                )}>
                  {task.title}
                </p>
                {task.assignedTo && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Assigned to: {task.assignedTo}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        
        {isClient && waitingForApproval && (
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 text-amber-500 text-sm py-2.5 px-3.5 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
              <AlertCircle className="h-4.5 w-4.5" />
              <p className="font-medium">Your approval is requested</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                size="sm"
                className="w-full text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/30"
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
            className="w-full font-medium"
            onClick={onApprove}
          >
            Request Client Approval
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
