
import React, { useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useMessages } from '@/hooks/useMessages';
import { useIsMobile } from '@/hooks/use-mobile';
import { MessagesHeader } from '@/components/messaging/MessagesHeader';
import { MobileConversationsList } from '@/components/messaging/MobileConversationsList';
import { MobileConversationView } from '@/components/messaging/MobileConversationView';
import { DesktopMessagingLayout } from '@/components/messaging/DesktopMessagingLayout';

const Messages = () => {
  const {
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
    currentConversation,
    currentMessages,
    toggleConversations,
    handleSendMessage,
    handleMarkAsTask,
    folders,
    labels,
    toggleMobileMenu,
    conversations,
    templates
  } = useMessages();

  const isMobile = useIsMobile();

  // Collapse conversations panel on mobile
  useEffect(() => {
    if (isMobile) {
      setIsConversationsCollapsed(true);
    }
  }, [isMobile, setIsConversationsCollapsed]);

  // Render mobile view (split into conversation list and conversation detail views)
  const renderMobileView = () => {
    if (!selectedConversation) {
      return (
        <MobileConversationsList
          conversations={conversations}
          selectedConversation={selectedConversation}
          onSelectConversation={setSelectedConversation}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          filter={filter}
          setFilter={setFilter}
          isMobileMenuOpen={isMobileMenuOpen}
          toggleMobileMenu={toggleMobileMenu}
          showFolders={showFolders}
          setShowFolders={setShowFolders}
          folders={folders}
          labels={labels}
        />
      );
    }
    
    return (
      <MobileConversationView
        conversation={currentConversation!}
        messages={currentMessages}
        isInfoDrawerOpen={isInfoDrawerOpen}
        setIsInfoDrawerOpen={setIsInfoDrawerOpen}
        onBack={() => setSelectedConversation(null)}
        onSendMessage={handleSendMessage}
        onMarkAsTask={handleMarkAsTask}
        selectedMessageId={selectedMessageId}
        templates={templates}
      />
    );
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        <MessagesHeader 
          isConversationsCollapsed={isConversationsCollapsed}
          toggleConversations={toggleConversations}
        />
        
        <div className="flex-1 overflow-hidden">
          {isMobile ? renderMobileView() : (
            <DesktopMessagingLayout
              conversations={conversations}
              selectedConversation={selectedConversation}
              onSelectConversation={setSelectedConversation}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              filter={filter}
              onFilterChange={setFilter}
              isConversationsCollapsed={isConversationsCollapsed}
              toggleConversations={toggleConversations}
              currentConversation={currentConversation}
              currentMessages={currentMessages}
              onSendMessage={handleSendMessage}
              onMarkAsTask={handleMarkAsTask}
              selectedMessageId={selectedMessageId}
              messageTemplates={templates}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Messages;
