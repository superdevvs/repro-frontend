import React, { useState } from 'react';
import { format } from 'date-fns';
import { Search, Filter, CalendarDays, CheckCircle, Clock, RotateCw, ChevronDown, Hash } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Conversation, ConversationFilter } from '@/types/messages';

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversation: string | null;
  onSelectConversation: (id: string) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  filter: ConversationFilter;
  onFilterChange: (filter: ConversationFilter) => void;
}

export function ConversationList({
  conversations,
  selectedConversation,
  onSelectConversation,
  activeTab,
  onTabChange,
  filter,
  onFilterChange,
}: ConversationListProps) {
  const [showFolders, setShowFolders] = useState(true);
  
  // Filter conversations based on current filter criteria
  const filteredConversations = conversations.filter((convo) => {
    // Filter by search query
    const matchesSearch = convo.participant.name.toLowerCase().includes(filter.searchQuery.toLowerCase()) ||
      convo.lastMessage.toLowerCase().includes(filter.searchQuery.toLowerCase()) ||
      (convo.shoot?.title && convo.shoot.title.toLowerCase().includes(filter.searchQuery.toLowerCase())) ||
      (convo.shoot?.address && convo.shoot.address.toLowerCase().includes(filter.searchQuery.toLowerCase()));
    
    // Filter by service type
    const matchesServiceType = !filter.serviceType?.length || 
      (convo.shoot?.serviceTypes && filter.serviceType.some(type => convo.shoot.serviceTypes.includes(type)));
    
    // Filter by status
    const matchesStatus = !filter.status?.length || 
      (convo.shoot?.status && filter.status.includes(convo.shoot.status));
    
    // Filter by user type
    const matchesUserType = !filter.userType?.length || 
      filter.userType.includes(convo.participant.role as any);
    
    return matchesSearch && matchesServiceType && matchesStatus && matchesUserType;
  });

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    // If today, show time
    if (format(date, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd')) {
      return format(date, 'h:mm a');
    }
    
    // If this year, show month and day
    if (date.getFullYear() === now.getFullYear()) {
      return format(date, 'd MMM');
    }
    
    // Otherwise show date
    return format(date, 'd MMM yyyy');
  };

  // Get status icon based on shoot status
  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'scheduled':
        return <CalendarDays className="h-3.5 w-3.5 text-blue-500" />;
      case 'inProgress':
        return <Clock className="h-3.5 w-3.5 text-yellow-500" />;
      case 'delivered':
        return <CheckCircle className="h-3.5 w-3.5 text-green-500" />;
      case 'revisions':
        return <RotateCw className="h-3.5 w-3.5 text-purple-500" />;
      case 'complete':
        return <CheckCircle className="h-3.5 w-3.5 text-green-700" />;
      default:
        return null;
    }
  };

  // Folders list
  const folders = [
    { id: 'inbox', name: 'Inbox', count: conversations.filter(c => c.unreadCount > 0).length },
    { id: 'starred', name: 'Starred', count: 0 },
    { id: 'snoozed', name: 'Snoozed', count: 0 },
    { id: 'sent', name: 'Sent', count: 0 },
    { id: 'drafts', name: 'Drafts', count: 0 },
    { id: 'trash', name: 'Trash', count: 0 },
  ];
  
  // Labels/tags list
  const labels = [
    { id: 'clients', name: 'Clients', color: 'bg-blue-500' },
    { id: 'photographers', name: 'Photographers', color: 'bg-green-500' },
    { id: 'editors', name: 'Editors', color: 'bg-purple-500' },
    { id: 'important', name: 'Important', color: 'bg-red-500' },
  ];

  return (
    <Card className="h-full flex flex-col border-none shadow-none">
      <div className="p-3 border-b flex-shrink-0">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search conversations..." 
            className="pl-9"
            value={filter.searchQuery}
            onChange={(e) => onFilterChange({ ...filter, searchQuery: e.target.value })}
          />
        </div>
        
        <Tabs 
          defaultValue={activeTab} 
          value={activeTab} 
          onValueChange={onTabChange} 
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 h-8 mb-1">
            <TabsTrigger value="inbox" className="text-xs">Primary</TabsTrigger>
            <TabsTrigger value="archived" className="text-xs">Archive</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 text-xs">
                <Filter className="h-3.5 w-3.5 mr-1" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter Conversations</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                Service Type
              </DropdownMenuLabel>
              {['photography', 'drone', 'floorplan', 'staging'].map((type) => (
                <DropdownMenuCheckboxItem
                  key={type}
                  checked={filter.serviceType?.includes(type as any)}
                  onCheckedChange={(checked) => {
                    const newTypes = filter.serviceType || [];
                    onFilterChange({
                      ...filter,
                      serviceType: checked 
                        ? [...newTypes, type] as any
                        : newTypes.filter(t => t !== type) as any
                    });
                  }}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </DropdownMenuCheckboxItem>
              ))}
              
              <DropdownMenuSeparator />
              
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                Status
              </DropdownMenuLabel>
              {['scheduled', 'inProgress', 'delivered', 'revisions', 'complete'].map((status) => (
                <DropdownMenuCheckboxItem
                  key={status}
                  checked={filter.status?.includes(status as any)}
                  onCheckedChange={(checked) => {
                    const newStatus = filter.status || [];
                    onFilterChange({
                      ...filter,
                      status: checked 
                        ? [...newStatus, status] as any
                        : newStatus.filter(s => s !== status) as any
                    });
                  }}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </DropdownMenuCheckboxItem>
              ))}
              
              <DropdownMenuSeparator />
              
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                User Type
              </DropdownMenuLabel>
              {['client', 'photographer', 'editor'].map((role) => (
                <DropdownMenuCheckboxItem
                  key={role}
                  checked={filter.userType?.includes(role as any)}
                  onCheckedChange={(checked) => {
                    const newRoles = filter.userType || [];
                    onFilterChange({
                      ...filter,
                      userType: checked 
                        ? [...newRoles, role] as any
                        : newRoles.filter(r => r !== role) as any
                    });
                  }}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </DropdownMenuCheckboxItem>
              ))}
              
              <DropdownMenuSeparator />
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start text-xs mt-2"
                onClick={() => onFilterChange({
                  searchQuery: '',
                  serviceType: undefined,
                  status: undefined,
                  userType: undefined,
                  dateRange: 'all'
                })}
              >
                Clear All Filters
              </Button>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-3">
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1.5">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 text-xs flex items-center p-1 pl-0 hover:bg-transparent" 
                onClick={() => setShowFolders(!showFolders)}
              >
                <ChevronDown className={cn("h-3.5 w-3.5 mr-1 transition-transform", !showFolders && "transform -rotate-90")} />
                <span className="font-semibold">Folders</span>
              </Button>
            </div>
            
            {showFolders && (
              <div className="ml-3 space-y-1">
                {folders.map(folder => (
                  <Button
                    key={folder.id}
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "w-full justify-start text-xs h-7 px-2 hover:bg-slate-100",
                      folder.id === 'inbox' && "font-medium"
                    )}
                  >
                    <span className="truncate">{folder.name}</span>
                    {folder.count > 0 && (
                      <Badge variant="secondary" className="ml-auto">
                        {folder.count}
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
            )}
          </div>
          
          <Separator className="my-3" />
          
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1.5">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 text-xs flex items-center p-1 pl-0 hover:bg-transparent"
              >
                <span className="font-semibold">Labels</span>
              </Button>
            </div>
            
            <div className="ml-3 space-y-1">
              {labels.map(label => (
                <Button
                  key={label.id}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-xs h-7 px-2 hover:bg-slate-100"
                >
                  <span className={cn("h-2.5 w-2.5 rounded-full mr-2", label.color)}></span>
                  <span className="truncate">{label.name}</span>
                </Button>
              ))}
            </div>
          </div>
          
          <Separator className="my-3" />
          
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 text-xs flex items-center p-1 pl-0 hover:bg-transparent"
              >
                <span className="font-semibold">Recent Conversations</span>
              </Button>
            </div>
            
            {filteredConversations.length > 0 ? (
              <div className="space-y-1">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={cn(
                      "cursor-pointer px-2 py-2 rounded-md hover:bg-slate-100 transition-colors",
                      selectedConversation === conversation.id ? "bg-slate-100" : ""
                    )}
                    onClick={() => onSelectConversation(conversation.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={conversation.participant.avatar} />
                          <AvatarFallback>{conversation.participant.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {conversation.unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-primary" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={cn(
                            "font-medium truncate text-xs",
                            conversation.unreadCount > 0 && "font-bold"
                          )}>
                            {conversation.participant.name}
                          </p>
                          <p className="text-[10px] text-muted-foreground whitespace-nowrap ml-1">
                            {formatDate(conversation.timestamp)}
                          </p>
                        </div>
                        
                        {conversation.shoot && (
                          <div className="flex items-center gap-1 mt-0.5">
                            <Hash className="h-3 w-3 text-muted-foreground" />
                            <p className="text-[10px] text-muted-foreground font-medium truncate">
                              {conversation.shoot.title}
                            </p>
                          </div>
                        )}
                        
                        <p className={cn(
                          "text-xs text-muted-foreground truncate mt-0.5",
                          conversation.unreadCount > 0 && "font-medium text-foreground"
                        )}>
                          {conversation.lastMessage}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-4">
                <p className="text-sm text-muted-foreground text-center">
                  No conversations match your filters
                </p>
                <Button
                  variant="link"
                  size="sm"
                  className="mt-1 h-auto p-0"
                  onClick={() => onFilterChange({
                    searchQuery: '',
                    serviceType: undefined,
                    status: undefined,
                    userType: undefined,
                    dateRange: 'all'
                  })}
                >
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </Card>
  );
}
