
import { Conversation, Message, MessageTemplate } from '@/types/messages';

export const mockConversations: Conversation[] = [
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

export const mockMessages: Record<string, Message[]> = {
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

export const mockTemplates: MessageTemplate[] = [
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
