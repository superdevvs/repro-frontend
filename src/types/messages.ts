
export interface Message {
  id: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
    role: 'client' | 'photographer' | 'editor' | 'admin';
  };
  content: string;
  timestamp: string;
  isRead: boolean;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  type: 'image' | 'document' | 'pdf' | 'floorplan';
  name: string;
  url: string;
  size: string;
  status: 'uploading' | 'complete' | 'final' | 'needsReview';
}

export interface Conversation {
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
  shoot?: {
    id: string;
    title: string;
    address: string;
    thumbnailUrl?: string;
    scheduledDate: string;
    status: 'scheduled' | 'inProgress' | 'delivered' | 'revisions' | 'complete';
    serviceTypes: ('photography' | 'drone' | 'floorplan' | 'staging')[];
  };
}

export type ConversationFilter = {
  searchQuery: string;
  serviceType?: ('photography' | 'drone' | 'floorplan' | 'staging')[];
  status?: ('scheduled' | 'inProgress' | 'delivered' | 'revisions' | 'complete')[];
  userType?: ('client' | 'photographer' | 'editor')[];
  dateRange?: 'today' | 'thisWeek' | 'next7Days' | 'thisMonth' | 'all';
};

export type MessageTemplate = {
  id: string;
  title: string;
  content: string;
};
