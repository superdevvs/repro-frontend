
import { format } from 'date-fns';
import { Message } from '@/types/messages';

// Group messages by date
export function groupMessagesByDate(messages: Message[]): { [date: string]: Message[] } {
  return messages.reduce((groups, message) => {
    const date = format(new Date(message.timestamp), 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {} as { [date: string]: Message[] });
}

// Check if messages array is empty
export function hasNoMessages(messages: Message[]): boolean {
  return messages.length === 0;
}
