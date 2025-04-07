
import { useState, useMemo } from 'react';
import { Conversation, ConversationFilter, Message } from '@/types/messages';
import { useToast } from '@/components/ui/use-toast';

// Mock data that will be moved to a service layer later
import { mockConversations, mockMessages, mockTemplates } from '@/components/messaging/mockMessagesData';

export function useMessages() {
  const [activeTab, setActiveTab] = useState('inbox');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [isConversationsCollapsed, setIsConversationsCollapsed] = useState(false);
  const [filter, setFilter] = useState<ConversationFilter>({ searchQuery: '' });
  const [isInfoDrawerOpen, setIsInfoDrawerOpen] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showFolders, setShowFolders] = useState(true);
  
  const { toast } = useToast();
  
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
  
  const handleMarkAsTask = (message: Message) => {
    toast({
      title: "Added to tasks",
      description: "The message has been added to your tasks.",
    });
  };

  const folders = [
    { id: 'inbox', name: 'Inbox', count: totalUnreadCount },
    { id: 'starred', name: 'Starred', count: 0 },
    { id: 'snoozed', name: 'Snoozed', count: 0 },
    { id: 'sent', name: 'Sent', count: 0 },
    { id: 'drafts', name: 'Drafts', count: 0 },
    { id: 'trash', name: 'Trash', count: 0 },
  ];
  
  const labels = [
    { id: 'clients', name: 'Clients', color: 'bg-blue-500' },
    { id: 'photographers', name: 'Photographers', color: 'bg-green-500' },
    { id: 'editors', name: 'Editors', color: 'bg-purple-500' },
    { id: 'important', name: 'Important', color: 'bg-red-500' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return {
    activeTab,
    setActiveTab,
    selectedConversation,
    setSelectedConversation,
    isConversationsCollapsed,
    setIsConversationsCollapsed,
    filter,
    setFilter,
    isInfoDrawerOpen,
    setIsInfoDrawerOpen,
    selectedMessageId,
    setSelectedMessageId,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    showFolders,
    setShowFolders,
    totalUnreadCount,
    currentConversation,
    currentMessages,
    toggleConversations,
    handleSendMessage,
    handleMarkAsTask,
    folders,
    labels,
    toggleMobileMenu,
    conversations: mockConversations,
    templates: mockTemplates
  };
}
