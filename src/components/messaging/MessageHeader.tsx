
import React from 'react';
import { Conversation } from '@/types/messages';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Archive, Phone, Video, Search, MoreHorizontal, Printer, Download, Trash2, ChevronRight, ChevronLeft } from 'lucide-react';

interface MessageHeaderProps {
  conversation: Conversation;
  isConversationsCollapsed: boolean;
  toggleConversations: () => void;
}

export function MessageHeader({ conversation, isConversationsCollapsed, toggleConversations }: MessageHeaderProps) {
  return (
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
              <AvatarImage src={conversation.participant.avatar} />
              <AvatarFallback>{conversation.participant.name.charAt(0)}</AvatarFallback>
            </Avatar>
            
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-medium">
                  {conversation.participant.name}
                </h2>
                <span className="text-xs text-muted-foreground">
                  ({conversation.participant.role})
                </span>
              </div>
              
              {conversation.shoot && (
                <p className="text-xs text-muted-foreground">
                  {conversation.shoot.title}
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
  );
}
