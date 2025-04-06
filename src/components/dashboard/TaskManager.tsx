
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

// Sample task data
const tasks = [
  {
    id: '1',
    title: 'Review Emma's edit requests',
    dueDate: '2023-09-20',
    priority: 'high',
    project: 'Oak Avenue Listing',
    completed: false,
  },
  {
    id: '2',
    title: 'Confirm shoot details with client',
    dueDate: '2023-09-21',
    priority: 'medium',
    project: 'Pine Boulevard Listing',
    completed: false,
  },
  {
    id: '3',
    title: 'Send invoice to Smith Realty',
    dueDate: '2023-09-19',
    priority: 'high',
    project: 'Financial',
    completed: false,
  },
  {
    id: '4',
    title: 'Update portfolio with new shoots',
    dueDate: '2023-09-22',
    priority: 'low',
    project: 'Marketing',
    completed: true,
  },
  {
    id: '5',
    title: 'Schedule drone operator',
    dueDate: '2023-09-18',
    priority: 'medium',
    project: 'Maple Street Listing',
    completed: true,
  },
];

interface TaskManagerProps {
  className?: string;
}

export function TaskManager({ className }: TaskManagerProps) {
  const isMobile = useIsMobile();
  const [taskList, setTaskList] = useState(tasks);
  const [activeTab, setActiveTab] = useState('upcoming');

  // Filter tasks based on the active tab
  const filteredTasks = taskList.filter(task => {
    if (activeTab === 'upcoming') return !task.completed;
    if (activeTab === 'completed') return task.completed;
    return true;
  });

  const toggleTask = (id: string) => {
    setTaskList(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Get priority styling
  const getPriorityStyle = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'medium':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className={cn("w-full", className)}
    >
      <Card className="glass-card">
        <CardHeader className={`${isMobile ? 'px-3 py-3' : 'p-4 pb-2'} border-b border-border`}>
          <div className="flex items-center justify-between mb-1">
            <CardTitle className={isMobile ? "text-base" : "text-lg"}>Tasks & To-Do</CardTitle>
            <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab} className="w-[140px]">
              <TabsList className={`grid w-full grid-cols-2 h-7 ${isMobile ? 'text-xs' : ''}`}>
                <TabsTrigger value="upcoming" className={isMobile ? "text-xs py-0.5" : ""}>Upcoming</TabsTrigger>
                <TabsTrigger value="completed" className={isMobile ? "text-xs py-0.5" : ""}>Done</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <CardDescription className={`text-xs ${isMobile ? 'hidden' : ''}`}>
            Manage your personal tasks and shoot-related to-dos.
          </CardDescription>
        </CardHeader>
        
        <CardContent className={`${isMobile ? 'p-3' : 'p-4'} pt-2`}>
          <TabsContent value="upcoming" className="mt-0 space-y-2">
            {filteredTasks.length > 0 ? (
              filteredTasks.map(task => (
                <div
                  key={task.id}
                  className={`flex items-start gap-3 p-2.5 ${isMobile ? 'p-3' : 'p-3'} rounded-md hover:bg-secondary/10 transition-colors`}
                >
                  <button
                    onClick={() => toggleTask(task.id)}
                    className="flex-shrink-0 mt-0.5 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Circle className={`h-5 w-5 ${isMobile ? 'h-4.5 w-4.5' : ''}`} />
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`font-medium ${isMobile ? 'text-sm' : ''} line-clamp-1`}>{task.title}</p>
                      <span className={`ml-4 capitalize text-xs px-2 py-0.5 rounded-full ${getPriorityStyle(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                    
                    <div className={`flex items-center gap-2 mt-1 ${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                      <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                      <span>•</span>
                      <span className="truncate">{task.project}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-muted-foreground">No upcoming tasks. Take a break!</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="mt-0 space-y-2">
            {filteredTasks.length > 0 ? (
              filteredTasks.map(task => (
                <div
                  key={task.id}
                  className={`flex items-start gap-3 ${isMobile ? 'p-3' : 'p-3'} rounded-md hover:bg-secondary/10 transition-colors`}
                >
                  <button
                    onClick={() => toggleTask(task.id)}
                    className="flex-shrink-0 mt-0.5 text-primary hover:text-primary/80 transition-colors"
                  >
                    <CheckCircle2 className={`h-5 w-5 ${isMobile ? 'h-4.5 w-4.5' : ''}`} />
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium line-through ${isMobile ? 'text-sm' : ''} text-muted-foreground line-clamp-1`}>{task.title}</p>
                    <div className={`flex items-center gap-2 mt-1 ${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground/70`}>
                      <span>Completed</span>
                      <span>•</span>
                      <span className="truncate">{task.project}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-muted-foreground">No completed tasks yet.</p>
              </div>
            )}
          </TabsContent>
        </CardContent>
        
        <CardFooter className={`${isMobile ? 'px-3 py-2.5' : 'px-4 py-3'} border-t border-border flex justify-center`}>
          <Button variant="outline" size={isMobile ? "sm" : "default"} className="w-full">
            <Plus className={`mr-2 ${isMobile ? 'h-3.5 w-3.5' : 'h-4 w-4'}`} />
            Add New Task
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
