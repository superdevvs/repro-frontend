
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MessageSquare, 
  Send, 
  User, 
  Users, 
  ChevronLeft,
  ChevronRight,
  Menu,
  Search,
  MessageCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Menubar,
  MenubarContent,
  MenubarMenu,
  MenubarTrigger,
  MenubarItem,
} from "@/components/ui/menubar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface Message {
  id: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  timestamp: string;
  isRead: boolean;
}

interface Conversation {
  id: string;
  participant: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
  };
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
}

const Messages = () => {
  const [activeTab, setActiveTab] = useState('inbox');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [isConversationsCollapsed, setIsConversationsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock data
  const conversations: Conversation[] = [
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
    },
  ];
  
  // Calculate total unread messages across all conversations
  const totalUnreadCount = conversations.reduce((total, convo) => total + convo.unreadCount, 0);
  
  const messages: Record<string, Message[]> = {
    '1': [
      {
        id: 'm1',
        sender: {
          id: 'p1',
          name: 'John Photographer',
          avatar: 'https://ui.shadcn.com/avatars/01.png',
        },
        content: 'Hi there! I wanted to discuss the upcoming shoot.',
        timestamp: '2023-09-15T14:15:00',
        isRead: true,
      },
      {
        id: 'm2',
        sender: {
          id: 'me',
          name: 'Me',
          avatar: 'https://ui.shadcn.com/avatars/02.png',
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
        },
        content: 'Can we reschedule the shoot for next week?',
        timestamp: '2023-09-15T14:30:00',
        isRead: false,
      },
    ],
    '2': [
      {
        id: 'm4',
        sender: {
          id: 'me',
          name: 'Me',
          avatar: 'https://ui.shadcn.com/avatars/02.png',
        },
        content: "I've reviewed your request and can confirm the booking.",
        timestamp: '2023-09-14T10:00:00',
        isRead: true,
      },
      {
        id: 'm5',
        sender: {
          id: 'c1',
          name: 'Emma Client',
          avatar: 'https://ui.shadcn.com/avatars/03.png',
        },
        content: 'Thanks for the quick response!',
        timestamp: '2023-09-14T10:15:00',
        isRead: true,
      },
    ],
  };
  
  const filteredConversations = conversations.filter(
    (convo) => 
      convo.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      convo.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return;
    
    // In a real app, this would send the message to the backend
    console.log('Sending message:', messageInput);
    setMessageInput('');
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const toggleConversations = () => {
    setIsConversationsCollapsed(!isConversationsCollapsed);
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6 pb-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <Badge className="mb-2 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
              Messages
            </Badge>
            <h1 className="text-3xl font-bold">Messaging Center</h1>
            <p className="text-muted-foreground">
              Communicate with clients and photographers.
            </p>
          </div>
          <div className="flex items-center gap-2 mt-4 sm:mt-0">
            {/* All Chat collapse toggle button - positioned at the top */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleConversations}
              className="flex items-center gap-1.5"
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
            
            <Menubar className="border-none p-0">
              <MenubarMenu>
                <MenubarTrigger className={cn(
                  "bg-primary/10 text-primary hover:bg-primary/20",
                  "p-2 rounded-md"
                )}>
                  <div className="flex items-center gap-2">
                    <Menu className="h-4 w-4" />
                    <span>Options</span>
                  </div>
                </MenubarTrigger>
                <MenubarContent>
                  {activeTab === 'inbox' ? (
                    <MenubarItem onClick={() => setActiveTab('archived')}>
                      View Archived
                    </MenubarItem>
                  ) : (
                    <MenubarItem onClick={() => setActiveTab('inbox')}>
                      View Inbox
                    </MenubarItem>
                  )}
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
            
            <Button>
              <MessageSquare className="mr-2 h-4 w-4" /> New Message
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Conversations Column - Collapsible */}
          <motion.div 
            className={cn(
              "lg:col-span-4 lg:block",
              isConversationsCollapsed ? "hidden" : ""
            )}
            initial={false}
            animate={{ 
              width: isConversationsCollapsed ? 0 : "auto",
              opacity: isConversationsCollapsed ? 0 : 1
            }}
            transition={{ duration: 0.2 }}
          >
            <Card className="glass-card h-full">
              <CardHeader className="px-4 py-3 border-b border-border">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Conversations</CardTitle>
                  <Tabs defaultValue="inbox" onValueChange={setActiveTab} className="w-[180px]">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="inbox">Inbox</TabsTrigger>
                      <TabsTrigger value="archived">Archived</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                <div className="mt-2 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search conversations..." 
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(80vh-16rem)]">
                  <div className="flex flex-col">
                    {filteredConversations.map((conversation) => (
                      <motion.div
                        key={conversation.id}
                        whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
                        className={`cursor-pointer p-4 border-b border-border hover:bg-accent/50 transition-colors ${
                          selectedConversation === conversation.id ? 'bg-accent/50' : ''
                        }`}
                        onClick={() => setSelectedConversation(conversation.id)}
                      >
                        <div className="flex items-start gap-3">
                          <Avatar>
                            <AvatarImage src={conversation.participant.avatar} />
                            <AvatarFallback>{conversation.participant.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-medium truncate">{conversation.participant.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatDate(conversation.timestamp)}
                              </p>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs py-0">
                                {conversation.participant.role}
                              </Badge>
                              {conversation.unreadCount > 0 && (
                                <Badge className="text-xs">{conversation.unreadCount}</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Messages Column */}
          <Card className={cn(
            "glass-card",
            isConversationsCollapsed ? "lg:col-span-12" : "lg:col-span-8"
          )}>
            {selectedConversation ? (
              <>
                <CardHeader className="px-4 py-3 border-b border-border">
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
                      <Avatar>
                        <AvatarImage 
                          src={conversations.find(c => c.id === selectedConversation)?.participant.avatar} 
                        />
                        <AvatarFallback>
                          {conversations.find(c => c.id === selectedConversation)?.participant.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">
                          {conversations.find(c => c.id === selectedConversation)?.participant.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {conversations.find(c => c.id === selectedConversation)?.participant.role}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Users className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0 flex flex-col h-[calc(80vh-16rem)]">
                  <ScrollArea className="flex-1 p-4">
                    <div className="flex flex-col gap-4">
                      {messages[selectedConversation]?.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.sender.id === 'me' ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg p-3 ${
                              message.sender.id === 'me'
                                ? 'bg-primary/10 text-primary'
                                : 'bg-accent'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDate(message.timestamp)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="p-4 border-t border-border mt-auto">
                    <div className="flex gap-2">
                      <Input
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Type your message..."
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSendMessage();
                        }}
                      />
                      <Button onClick={handleSendMessage}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-[calc(80vh-16rem)]">
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
                <User className="h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No conversation selected</h3>
                <p className="text-sm text-muted-foreground">
                  {isConversationsCollapsed 
                    ? "Click 'All Chat' to view conversations" 
                    : "Select a conversation from the list to start messaging"}
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Messages;
