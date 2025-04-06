import React, { useState, useMemo, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  MessageSquare, 
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Phone,
  Video,
  Calendar,
  Info,
  Search,
  MenuIcon,
  X,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  HoverCard, 
  HoverCardContent, 
  HoverCardTrigger
} from "@/components/ui/hover-card";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { ConversationList } from '@/components/messaging/ConversationList';
import { MessageList } from '@/components/messaging/MessageList';
import { MessageInput } from '@/components/messaging/MessageInput';
import { ProjectContextBar } from '@/components/messaging/ProjectContextBar';
import { TaskApprovalPanel } from '@/components/messaging/TaskApprovalPanel';
import { TaskMessage } from '@/components/messaging/TaskMessage';
import { Conversation, Message, ConversationFilter, MessageTemplate } from '@/types/messages';
import { Drawer, DrawerContent, DrawerTrigger, DrawerClose } from '@/components/ui/drawer';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';

const mockConversations: Conversation[] = [
  {
    id: '1',
    participant: {
      id: 'p1',
      name: 'John Photographer',
      role: 'photographer',
      avatar: 'https://ui.shadcn.com/avatars/01.png',
    },
    lastMessage: 'Can we reschedule the shoot for next week?',
    timestamp: '2023-09-15T14:30:00',
    unreadCount: 2,
    shoot: {
      id: 'shoot-1',
      title: '123 Maple Street Listing',
      address: '123 Maple Street, Austin, TX 78701',
      scheduledDate: '2023-09-20T10:00:00',
      status: 'scheduled',
      serviceTypes: ['photography', 'floorplan'],
    },
  },
  {
    id: '2',
    participant: {
      id: 'c1',
      name: 'Emma Client',
      role: 'client',
      avatar: 'https://ui.shadcn.com/avatars/03.png',
    },
    lastMessage: 'Thanks for the quick response!',
    timestamp: '2023-09-14T10:15:00',
    unreadCount: 0,
    shoot: {
      id: 'shoot-2',
      title: '456 Oak Avenue Listing',
      address: '456 Oak Avenue, Austin, TX 78704',
      scheduledDate: '2023-09-10T14:00:00',
      status: 'delivered',
      serviceTypes: ['photography', 'drone', 'staging'],
    },
  },
  {
    id: '3',
    participant: {
      id: 'p2',
      name: 'Sarah Photographer',
      role: 'photographer',
      avatar: 'https://ui.shadcn.com/avatars/05.png',
    },
    lastMessage: 'I just sent the edited images for your review.',
    timestamp: '2023-09-12T18:45:00',
    unreadCount: 0,
    shoot: {
      id: 'shoot-3',
      title: '789 Pine Boulevard Listing',
      address: '789 Pine Boulevard, Austin, TX 78745',
      scheduledDate: '2023-09-08T09:30:00',
      status: 'revisions',
      serviceTypes: ['photography'],
    },
  },
  {
    id: '4',
    participant: {
      id: 'e1',
      name: 'Mark Editor',
      role: 'editor',
      avatar: 'https://ui.shadcn.com/avatars/02.png',
    },
    lastMessage: 'Virtual staging completed for the living room',
    timestamp: '2023-09-16T11:20:00',
    unreadCount: 1,
    shoot: {
      id: 'shoot-4',
      title: '321 Cedar Lane Listing',
      address: '321 Cedar Lane, Austin, TX 78702',
      scheduledDate: '2023-09-05T13:00:00',
      status: 'inProgress',
      serviceTypes: ['staging', 'floorplan'],
    },
  },
];

const mockMessages: Record<string, Message[]> = {
  '1': [
    {
      id: 'm1',
      sender: {
        id: 'p1',
        name: 'John Photographer',
        avatar: 'https://ui.shadcn.com/avatars/01.png',
        role: 'photographer',
      },
      content: 'Hi there! I wanted to discuss the upcoming shoot at 123 Maple Street.',
      timestamp: '2023-09-15T14:15:00',
      isRead: true,
    },
    {
      id: 'm2',
      sender: {
        id: 'me',
        name: 'Me',
        avatar: 'https://ui.shadcn.com/avatars/02.png',
        role: 'admin',
      },
      content: 'Sure, what would you like to discuss?',
      timestamp: '2023-09-15T14:20:00',
      isRead: true,
    },
    {
      id: 'm3',
      sender: {
        id: 'p1',
        name: 'John Photographer',
        avatar: 'https://ui.shadcn.com/avatars/01.png',
        role: 'photographer',
      },
      content: 'Can we reschedule the shoot for next week? The homeowner has a conflict.',
      timestamp: '2023-09-15T14:30:00',
      isRead: false,
      attachments: [
        {
          id: 'a1',
          type: 'document',
          name: 'updated_schedule.pdf',
          url: '/placeholder.svg',
          size: '245 KB',
          status: 'complete',
        },
      ],
    },
  ],
  '2': [
    {
      id: 'm4',
      sender: {
        id: 'me',
        name: 'Me',
        avatar: 'https://ui.shadcn.com/avatars/02.png',
        role: 'admin',
      },
      content: "I've reviewed your request and can confirm the booking for 456 Oak Avenue.",
      timestamp: '2023-09-14T10:00:00',
      isRead: true,
    },
    {
      id: 'm5',
      sender: {
        id: 'c1',
        name: 'Emma Client',
        avatar: 'https://ui.shadcn.com/avatars/03.png',
        role: 'client',
      },
      content: 'Thanks for the quick response! Looking forward to the photos.',
      timestamp: '2023-09-14T10:15:00',
      isRead: true,
    },
    {
      id: 'm6',
      sender: {
        id: 'me',
        name: 'Me',
        avatar: 'https://ui.shadcn.com/avatars/02.png',
        role: 'admin',
      },
      content: 'Here are the edited photos from your recent shoot. Please let me know if you need any changes!',
      timestamp: '2023-09-15T09:30:00',
      isRead: true,
      attachments: [
        {
          id: 'a2',
          type: 'image',
          name: 'living_room_final.jpg',
          url: '/placeholder.svg',
          size: '3.2 MB',
          status: 'final',
        },
        {
          id: 'a3',
          type: 'image',
          name: 'kitchen_final.jpg',
          url: '/placeholder.svg',
          size: '2.8 MB',
          status: 'final',
        },
      ],
    },
  ],
  '3': [
    {
      id: 'm7',
      sender: {
        id: 'p2',
        name: 'Sarah Photographer',
        avatar: 'https://ui.shadcn.com/avatars/05.png',
        role: 'photographer',
      },
      content: 'I completed the photoshoot at 789 Pine Boulevard today. Everything went well!',
      timestamp: '2023-09-11T16:00:00',
      isRead: true,
    },
    {
      id: 'm8',
      sender: {
        id: 'me',
        name: 'Me',
        avatar: 'https://ui.shadcn.com/avatars/02.png',
        role: 'admin',
      },
      content: 'Great to hear! When can we expect the edited images?',
      timestamp: '2023-09-11T16:15:00',
      isRead: true,
    },
    {
      id: 'm9',
      sender: {
        id: 'p2',
        name: 'Sarah Photographer',
        avatar: 'https://ui.shadcn.com/avatars/05.png',
        role: 'photographer',
      },
      content: 'I just sent the edited images for your review. Let me know what you think!',
      timestamp: '2023-09-12T18:45:00',
      isRead: true,
      attachments: [
        {
          id: 'a4',
          type: 'image',
          name: 'exterior_front.jpg',
          url: '/placeholder.svg',
          size: '4.1 MB',
          status: 'needsReview',
        },
      ],
    },
  ],
  '4': [
    {
      id: 'm10',
      sender: {
        id: 'e1',
        name: 'Mark Editor',
        avatar: 'https://ui.shadcn.com/avatars/02.png',
        role: 'editor',
      },
      content: 'I\'m starting on the virtual staging for 321 Cedar Lane. Do you have any specific requirements?',
      timestamp: '2023-09-16T09:00:00',
      isRead: true,
    },
    {
      id: 'm11',
      sender: {
        id: 'me',
        name: 'Me',
        avatar: 'https://ui.shadcn.com/avatars/02.png',
        role: 'admin',
      },
      content: 'The client wants a modern style with neutral colors. They specifically mentioned they like minimalist furniture.',
      timestamp: '2023-09-16T09:20:00',
      isRead: true,
    },
    {
      id: 'm12',
      sender: {
        id: 'e1',
        name: 'Mark Editor',
        avatar: 'https://ui.shadcn.com/avatars/02.png',
        role: 'editor',
      },
      content: 'Virtual staging completed for the living room. Check it out and let me know what you think!',
      timestamp: '2023-09-16T11:20:00',
      isRead: false,
      attachments: [
        {
          id: 'a5',
          type: 'image',
          name: 'living_room_staged.jpg',
          url: '/placeholder.svg',
          size: '5.7 MB',
          status: 'needsReview',
        },
      ],
    },
  ],
};

const mockTemplates: MessageTemplate[] = [
  {
    id: 't1',
    title: 'Shoot Confirmation',
    content: 'Your photoshoot is confirmed for [DATE] at [TIME]. Please ensure the property is ready 15 minutes before the scheduled time.',
  },
  {
    id: 't2',
    title: 'Photos Delivered',
    content: 'Your photos have been delivered! Please review them at your earliest convenience and let us know if you need any adjustments.',
  },
  {
    id: 't3',
    title: 'Reschedule Request',
    content: 'We need to reschedule your upcoming shoot. Please let us know which of the following dates works for you: [OPTIONS]',
  },
];

const mockTasks = [
  { id: 't1', title: 'Photoshoot completed', completed: true },
  { id: 't2', title: 'Initial editing', completed: true },
  { id: 't3', title: 'Client review', completed: false },
  { id: 't4', title: 'Final delivery', completed: false },
];

const Messages = () => {
  const [activeTab, setActiveTab] = useState('inbox');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [isConversationsCollapsed, setIsConversationsCollapsed] = useState(false);
  const [filter, setFilter] = useState<ConversationFilter>({ searchQuery: '' });
  const [messageInput, setMessageInput] = useState('');
  const [tasks, setTasks] = useState(mockTasks);
  const [waitingForApproval, setWaitingForApproval] = useState(false);
  const [messageTasks, setMessageTasks] = useState<Record<string, boolean>>({});
  const [rightPanelTab, setRightPanelTab] = useState('details');
  const [isInfoDrawerOpen, setIsInfoDrawerOpen] = useState(false);
  const [showMobileConversations, setShowMobileConversations] = useState(true);
  
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  useEffect(() => {
    if (isMobile) {
      setIsConversationsCollapsed(true);
      setShowMobileConversations(true);
    } else {
      setIsConversationsCollapsed(false);
    }
  }, [isMobile]);
  
  useEffect(() => {
    if (isMobile && selectedConversation) {
      setShowMobileConversations(false);
    }
  }, [selectedConversation, isMobile]);
  
  const totalUnreadCount = useMemo(() => {
    return mockConversations.reduce((total, convo) => total + convo.unreadCount, 0);
  }, []);
  
  const currentConversation = useMemo(() => {
    return selectedConversation 
      ? mockConversations.find(c => c.id === selectedConversation) 
      : null;
  }, [selectedConversation]);
  
  const currentMessages = useMemo(() => {
    return selectedConversation && mockMessages[selectedConversation] 
      ? mockMessages[selectedConversation] 
      : [];
  }, [selectedConversation]);
  
  const projectProgress = useMemo(() => {
    const completed = tasks.filter(t => t.completed).length;
    return Math.round((completed / tasks.length) * 100);
  }, [tasks]);
  
  const toggleConversations = () => {
    if (isMobile) {
      setShowMobileConversations(!showMobileConversations);
    } else {
      setIsConversationsCollapsed(!isConversationsCollapsed);
    }
  };
  
  const handleSendMessage = (content: string, attachments?: File[]) => {
    console.log('Sending message:', content, attachments);
  };
  
  const handleTaskToggle = (taskId: string, completed: boolean) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed } : task
    ));
  };
  
  const handleMarkAsTask = (message: Message) => {
    const isCurrentlyTask = messageTasks[message.id];
    
    setMessageTasks(prev => ({
      ...prev,
      [message.id]: !prev[message.id]
    }));
    
    toast({
      title: !isCurrentlyTask ? "Added to tasks" : "Removed from tasks",
      description: !isCurrentlyTask 
        ? "Message has been added to your tasks" 
        : "Message has been removed from tasks",
    });
  };
  
  const handleToggleMessageTask = (messageId: string, isCompleted: boolean) => {
    setMessageTasks(prev => ({
      ...prev,
      [messageId]: isCompleted
    }));
  };
  
  const handleRequestApproval = () => {
    setWaitingForApproval(true);
  };
  
  const handleApprove = () => {
    setWaitingForApproval(false);
    setTasks(tasks.map(task => 
      task.id === 't3' ? { ...task, completed: true } : task
    ));
  };
  
  const handleRequestRevision = () => {
    setWaitingForApproval(false);
  };
  
  const messageTasksList = useMemo(() => {
    return currentMessages.filter(message => messageTasks[message.id]);
  }, [currentMessages, messageTasks]);
  
  const handleSelectConversation = (id: string) => {
    setSelectedConversation(id);
    if (isMobile) {
      setShowMobileConversations(false);
    }
  };
  
  const handleBackToConversations = () => {
    if (isMobile) {
      setShowMobileConversations(true);
    }
  };
  
  const renderContent = () => {
    if (isMobile) {
      if (showMobileConversations) {
        return (
          <div className="flex flex-col h-full">
            <ConversationList 
              conversations={mockConversations}
              selectedConversation={selectedConversation}
              onSelectConversation={handleSelectConversation}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              filter={filter}
              onFilterChange={setFilter}
            />
          </div>
        );
      }
      
      return (
        <div className="flex flex-col h-full">
          <div className="px-3 py-2.5 border-b flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleBackToConversations}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-semibold truncate max-w-[200px]">
                    {currentConversation?.participant.name || 'Messages'}
                  </h2>
                  {currentConversation && (
                    <Badge variant="outline" className="text-xs">
                      {currentConversation.participant.role}
                    </Badge>
                  )}
                </div>
              </div>
              
              {currentConversation && (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Drawer open={isInfoDrawerOpen} onOpenChange={setIsInfoDrawerOpen}>
                    <DrawerTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                      >
                        <Info className="h-4 w-4" />
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent className="px-0 max-h-[85vh] overflow-y-auto">
                      <Tabs defaultValue="details" className="w-full">
                        <div className="px-4 pt-4 border-b">
                          <TabsList className="w-full grid grid-cols-2">
                            <TabsTrigger value="details">Details</TabsTrigger>
                            <TabsTrigger value="tasks">Tasks & Progress</TabsTrigger>
                          </TabsList>
                        </div>
                        <TabsContent value="details" className="mt-0">
                          {currentConversation && (
                            <ProjectContextBar 
                              conversation={currentConversation}
                              className="flex-shrink-0"
                            />
                          )}
                        </TabsContent>
                        <TabsContent value="tasks" className="mt-0">
                          {currentConversation && (
                            <TaskApprovalPanel 
                              projectId={currentConversation.shoot?.id || ''}
                              tasks={tasks}
                              progress={projectProgress}
                              onTaskToggle={handleTaskToggle}
                              onApprove={handleApprove}
                              onRequestRevision={handleRequestRevision}
                              isClient={currentConversation.participant.role === 'client'}
                              waitingForApproval={waitingForApproval}
                            />
                          )}
                          
                          {messageTasksList.length > 0 && (
                            <div className="px-4 pt-4">
                              <h3 className="text-sm font-medium mb-2">Message Tasks</h3>
                              <div className="space-y-2">
                                {messageTasksList.map(message => (
                                  <TaskMessage 
                                    key={message.id}
                                    message={message}
                                    isCompleted={!!messageTasks[message.id]}
                                    onToggleComplete={handleToggleMessageTask}
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                        </TabsContent>
                      </Tabs>
                    </DrawerContent>
                  </Drawer>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex-1 flex flex-col overflow-hidden">
            <MessageList 
              messages={currentMessages} 
              currentUserId="me"
              onMarkAsTask={handleMarkAsTask}
            />
            
            <MessageInput 
              onSendMessage={handleSendMessage}
              templates={mockTemplates}
            />
          </div>
        </div>
      );
    }
    
    return (
      <ResizablePanelGroup
        direction="horizontal"
        className="min-h-full rounded-lg border"
      >
        {!isConversationsCollapsed && (
          <>
            <ResizablePanel 
              defaultSize={25} 
              minSize={20}
              maxSize={40}
              className="bg-card"
            >
              <ConversationList 
                conversations={mockConversations}
                selectedConversation={selectedConversation}
                onSelectConversation={setSelectedConversation}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                filter={filter}
                onFilterChange={setFilter}
              />
            </ResizablePanel>
            
            <ResizableHandle withHandle />
          </>
        )}
        
        <ResizablePanel 
          defaultSize={isConversationsCollapsed ? 70 : 45}
          className="bg-card"
        >
          {selectedConversation ? (
            <div className="flex flex-col h-full">
              <div className="px-4 py-3 border-b flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isConversationsCollapsed && (
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={toggleConversations}
                            className="lg:block hidden"
                          >
                            <MessageCircle className="h-4 w-4" />
                            {totalUnreadCount > 0 && (
                              <Badge className="absolute -top-2 -right-2 h-5 min-w-5 flex items-center justify-center rounded-full p-0 text-xs font-medium">
                                {totalUnreadCount}
                              </Badge>
                            )}
                          </Button>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-auto p-2">
                          <span>Show all conversations</span>
                        </HoverCardContent>
                      </HoverCard>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-semibold">
                        {currentConversation?.participant.name}
                      </h2>
                      <Badge variant="outline" className="text-xs">
                        {currentConversation?.participant.role}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Search className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Video className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 flex flex-col overflow-hidden">
                <MessageList 
                  messages={currentMessages} 
                  currentUserId="me"
                  onMarkAsTask={handleMarkAsTask}
                />
                
                <MessageInput 
                  onSendMessage={handleSendMessage}
                  templates={mockTemplates}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              {isConversationsCollapsed && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={toggleConversations}
                  className="absolute top-4 left-4 lg:block hidden"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  <span>All Chat</span>
                  {totalUnreadCount > 0 && (
                    <Badge className="ml-1.5 h-5 min-w-5 flex items-center justify-center rounded-full p-0 text-xs font-medium">
                      {totalUnreadCount}
                    </Badge>
                  )}
                </Button>
              )}
              <MessageCircle className="h-12 w-12 text-muted-foreground opacity-20" />
              <h3 className="mt-4 text-lg font-medium">No conversation selected</h3>
              <p className="text-sm text-muted-foreground">
                {isConversationsCollapsed 
                  ? "Click 'All Chat' to view conversations" 
                  : "Select a conversation from the list to start messaging"}
              </p>
            </div>
          )}
        </ResizablePanel>
        
        {selectedConversation && currentConversation && !isMobile && (
          <>
            <ResizableHandle withHandle />
            
            <ResizablePanel 
              defaultSize={30}
              minSize={20}
              maxSize={40}
              className="bg-card hidden md:block"
            >
              <div className="h-full flex flex-col">
                <Tabs 
                  defaultValue="details" 
                  value={rightPanelTab}
                  onValueChange={setRightPanelTab}
                  className="w-full"
                >
                  <div className="px-4 pt-4 border-b">
                    <TabsList className="w-full grid grid-cols-2">
                      <TabsTrigger value="details">Details</TabsTrigger>
                      <TabsTrigger value="tasks">Tasks</TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <TabsContent value="details" className="flex-1 overflow-auto mt-0">
                    <ProjectContextBar 
                      conversation={currentConversation}
                      className="flex-shrink-0"
                    />
                  </TabsContent>
                  
                  <TabsContent value="tasks" className="flex-1 overflow-auto mt-0">
                    <TaskApprovalPanel 
                      projectId={currentConversation.shoot?.id || ''}
                      tasks={tasks}
                      progress={projectProgress}
                      onTaskToggle={handleTaskToggle}
                      onApprove={handleApprove}
                      onRequestRevision={handleRequestRevision}
                      isClient={currentConversation.participant.role === 'client'}
                      waitingForApproval={waitingForApproval}
                    />
                    
                    {messageTasksList.length > 0 && (
                      <div className="px-4 pt-4">
                        <h3 className="text-sm font-medium mb-2">Message Tasks</h3>
                        <div className="space-y-2">
                          {messageTasksList.map(message => (
                            <TaskMessage 
                              key={message.id}
                              message={message}
                              isCompleted={!!messageTasks[message.id]}
                              onToggleComplete={handleToggleMessageTask}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    );
  };
  
  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        <div className="py-2 md:py-3 flex flex-wrap md:flex-nowrap justify-between items-center gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                Messages
              </Badge>
              <h1 className="text-lg md:text-2xl font-bold tracking-tight">Messaging Center</h1>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground hidden md:block">
              Communicate with clients and service providers
            </p>
          </div>
          
          <div className="flex items-center gap-2 ml-auto">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleConversations}
              className={cn(
                "hidden md:flex items-center gap-1.5 border-primary/20 text-primary hover:bg-primary/5",
                isConversationsCollapsed ? "bg-background" : "bg-primary/5"
              )}
            >
              {isConversationsCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
              <span>All Chat</span>
              {totalUnreadCount > 0 && (
                <Badge variant="secondary" className="h-5 min-w-5 flex items-center justify-center rounded-full p-0 text-xs font-medium">
                  {totalUnreadCount}
                </Badge>
              )}
            </Button>
            
            <Button variant="outline" size="sm" className="hidden md:flex bg-blue-50 text-blue-500 border-blue-200 hover:bg-blue-100 hover:text-blue-600">
              <Calendar className="mr-1.5 h-4 w-4" />
              <span>Schedule</span>
            </Button>
            
            {!isMobile && (
              <Button className="bg-blue-500 hover:bg-blue-600">
                <MessageSquare className="mr-2 h-4 w-4" /> New Message
              </Button>
            )}
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden">
          {renderContent()}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Messages;
