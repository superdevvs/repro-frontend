import React, { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Phone,
  Video,
  Search,
  MenuIcon,
  PlusCircle,
  Paperclip,
  Printer,
  Download,
  Star,
  Reply,
  MoreHorizontal,
  Trash2,
  Archive
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { ConversationList } from '@/components/messaging/ConversationList';
import { MessageList } from '@/components/messaging/MessageList';
import { MessageInput } from '@/components/messaging/MessageInput';
import { ProjectContextBar } from '@/components/messaging/ProjectContextBar';
import { Conversation, ConversationFilter, MessageTemplate, Message } from '@/types/messages';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

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

const Messages = () => {
  const [activeTab, setActiveTab] = useState('inbox');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [isConversationsCollapsed, setIsConversationsCollapsed] = useState(false);
  const [filter, setFilter] = useState<ConversationFilter>({ searchQuery: '' });
  const [isInfoDrawerOpen, setIsInfoDrawerOpen] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  React.useEffect(() => {
    if (isMobile) {
      setIsConversationsCollapsed(true);
    }
  }, [isMobile]);
  
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
  
  const toggleConversations = () => {
    setIsConversationsCollapsed(!isConversationsCollapsed);
  };
  
  const handleSendMessage = (content: string, attachments?: File[]) => {
    if (!content.trim() && (!attachments || attachments.length === 0)) return;
    
    toast({
      title: "Message sent",
      description: "Your message has been delivered successfully.",
    });
    
    console.log('Sending message:', content, attachments);
  };
  
  const handleMarkAsTask = (message: any) => {
    toast({
      title: "Added to tasks",
      description: "The message has been added to your tasks.",
    });
  };

  const renderMobileView = () => {
    if (!selectedConversation) {
      return (
        <div className="flex flex-col h-full">
          <div className="px-4 py-3 border-b flex-shrink-0">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold">Messages</h2>
              <Button variant="outline" size="sm" className="rounded-full">
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <ConversationList 
            conversations={mockConversations}
            selectedConversation={selectedConversation}
            onSelectConversation={setSelectedConversation}
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
        <div className="px-4 py-3 border-b flex-shrink-0">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={() => setSelectedConversation(null)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <Avatar className="h-8 w-8">
              <AvatarImage src={currentConversation?.participant.avatar} />
              <AvatarFallback>{currentConversation?.participant.name.charAt(0)}</AvatarFallback>
            </Avatar>
            
            <div>
              <h2 className="text-sm font-medium">
                {currentConversation?.participant.name}
              </h2>
              <p className="text-xs text-muted-foreground">
                {currentConversation?.participant.role}
              </p>
            </div>
            
            <div className="ml-auto flex items-center">
              <Drawer open={isInfoDrawerOpen} onOpenChange={setIsInfoDrawerOpen}>
                <DrawerTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MenuIcon className="h-4 w-4" />
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="max-h-[80vh]">
                  {currentConversation && (
                    <ProjectContextBar 
                      conversation={currentConversation}
                      className="p-4"
                    />
                  )}
                </DrawerContent>
              </Drawer>
            </div>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <MessageList 
            messages={currentMessages} 
            currentUserId="me"
            onMarkAsTask={handleMarkAsTask}
            selectedMessageId={selectedMessageId}
          />
          
          <MessageInput 
            onSendMessage={handleSendMessage}
            templates={mockTemplates}
          />
        </div>
      </div>
    );
  };
  
  const renderDesktopView = () => {
    return (
      <ResizablePanelGroup
        direction="horizontal"
        className="rounded-lg overflow-hidden border"
      >
        {!isConversationsCollapsed && (
          <>
            <ResizablePanel 
              defaultSize={25} 
              minSize={15}
              maxSize={40}
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
        
        <ResizablePanel defaultSize={isConversationsCollapsed ? 65 : 45}>
          <div className="flex flex-col h-full">
            {selectedConversation && currentConversation ? (
              <>
                <div className="border-b p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {isConversationsCollapsed && (
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8 mr-1"
                          onClick={toggleConversations}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      )}
                      
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={currentConversation.participant.avatar} />
                          <AvatarFallback>{currentConversation.participant.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="font-medium">
                              {currentConversation.participant.name}
                            </h2>
                            <span className="text-xs text-muted-foreground">
                              ({currentConversation.participant.role})
                            </span>
                          </div>
                          
                          {currentConversation.shoot && (
                            <p className="text-xs text-muted-foreground">
                              {currentConversation.shoot.title}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1.5">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Archive className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Archive</TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Phone className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Call</TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Video className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Video</TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Search className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Search</TooltipContent>
                      </Tooltip>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Printer className="mr-2 h-4 w-4" />
                            <span>Print</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            <span>Export</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete conversation</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 flex flex-col overflow-hidden">
                  <MessageList 
                    messages={currentMessages} 
                    currentUserId="me"
                    onMarkAsTask={handleMarkAsTask}
                    selectedMessageId={selectedMessageId}
                  />
                  
                  <MessageInput 
                    onSendMessage={handleSendMessage}
                    templates={mockTemplates}
                  />
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                {isConversationsCollapsed && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={toggleConversations}
                    className="absolute top-4 left-4"
                  >
                    <ChevronRight className="h-4 w-4 mr-1" />
                    <span>Show Conversations</span>
                  </Button>
                )}
                <MessageCircle className="h-12 w-12 text-muted-foreground opacity-20 mb-4" />
                <h3 className="text-lg font-medium mb-1">No conversation selected</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  {isConversationsCollapsed 
                    ? "Click 'Show Conversations' to view available messages" 
                    : "Select a conversation from the list to start messaging"}
                </p>
              </div>
            )}
          </div>
        </ResizablePanel>
        
        {selectedConversation && currentConversation && !isMobile && (
          <>
            <ResizableHandle withHandle />
            
            <ResizablePanel 
              defaultSize={30}
              minSize={20}
              maxSize={40}
              className="hidden md:block border-l"
            >
              <ProjectContextBar 
                conversation={currentConversation}
                className="p-4"
              />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    );
  };
  
  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        <div className="py-3 flex justify-between items-center border-b">
          <h1 className="text-xl font-semibold">Messaging Center</h1>
          
          {!isMobile && (
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={toggleConversations}
                className={cn(
                  "flex items-center gap-1.5",
                  isConversationsCollapsed && "border-primary text-primary"
                )}
              >
                {isConversationsCollapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
                <span>Toggle Sidebar</span>
              </Button>
              
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> New Message
              </Button>
            </div>
          )}
        </div>
        
        <div className="flex-1 overflow-hidden">
          {isMobile ? renderMobileView() : renderDesktopView()}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Messages;
