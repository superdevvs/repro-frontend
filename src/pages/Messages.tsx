
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, Send, User, Users } from 'lucide-react';
import { motion } from 'framer-motion';

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
        content: 'I've reviewed your request and can confirm the booking.',
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
          <Button className="mt-4 sm:mt-0">
            <MessageSquare className="mr-2 h-4 w-4" /> New Message
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <Card className="lg:col-span-4 glass-card">
            <CardHeader className="px-4 py-3 border-b border-border">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Conversations</CardTitle>
                <Tabs defaultValue="inbox" onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="inbox">Inbox</TabsTrigger>
                    <TabsTrigger value="archived">Archived</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(80vh-13rem)]">
                <div className="flex flex-col">
                  {conversations.map((conversation) => (
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
          
          <Card className="lg:col-span-8 glass-card">
            {selectedConversation ? (
              <>
                <CardHeader className="px-4 py-3 border-b border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
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
                <CardContent className="p-0 flex flex-col h-[calc(80vh-13rem)]">
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
              <div className="flex flex-col items-center justify-center h-[calc(80vh-10rem)]">
                <User className="h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No conversation selected</h3>
                <p className="text-sm text-muted-foreground">
                  Select a conversation from the list to start messaging
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
