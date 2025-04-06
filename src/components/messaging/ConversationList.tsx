import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Search, Filter, CalendarDays, CheckCircle, Clock, RotateCw } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();

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
    return format(date, 'h:mm a');
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

  // Get service type badge color
  const getServiceTypeColor = (type: string) => {
    switch (type) {
      case 'photography':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'drone':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'floorplan':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'staging':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className={`h-full flex flex-col border-none shadow-none ${isMobile ? 'rounded-none' : ''}`}>
      <CardHeader className={`${isMobile ? 'px-3 py-3' : 'px-4 py-3'} border-b flex-shrink-0`}>
        <div className="flex items-center justify-between mb-3">
          <CardTitle className={`${isMobile ? 'text-lg' : 'text-lg'}`}>Conversations</CardTitle>
          <Tabs defaultValue={activeTab} onValueChange={onTabChange} className="w-[180px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="inbox">Inbox</TabsTrigger>
              <TabsTrigger value="archived">Archived</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search conversations..." 
              className="pl-9"
              value={filter.searchQuery}
              onChange={(e) => onFilterChange({ ...filter, searchQuery: e.target.value })}
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter Conversations</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground mt-2">Service Type</DropdownMenuLabel>
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
              
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Status</DropdownMenuLabel>
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
              
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">User Type</DropdownMenuLabel>
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
      </CardHeader>
      
      <CardContent className={`p-0 flex-1 overflow-hidden ${isMobile ? 'message-conversation-list' : ''}`}>
        <ScrollArea className="h-full">
          <div className="flex flex-col">
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conversation) => (
                <motion.div
                  key={conversation.id}
                  whileHover={{ backgroundColor: 'rgba(0,0,0,0.03)' }}
                  className={`cursor-pointer ${isMobile ? 'p-3' : 'p-3'} border-b border-border hover:bg-accent/30 transition-colors ${
                    selectedConversation === conversation.id ? 'bg-accent/50' : ''
                  }`}
                  onClick={() => onSelectConversation(conversation.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={conversation.participant.avatar} />
                        <AvatarFallback>{conversation.participant.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {conversation.unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium truncate">{conversation.participant.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(conversation.timestamp)}
                        </p>
                      </div>
                      
                      {conversation.shoot && (
                        <div className="flex items-center gap-1.5 mt-0.5 mb-1">
                          {getStatusIcon(conversation.shoot.status)}
                          <p className="text-xs text-muted-foreground font-medium truncate">
                            {conversation.shoot.title}
                          </p>
                        </div>
                      )}
                      
                      <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                      
                      <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                        <Badge variant="outline" className="text-xs h-5 py-0 px-1.5">
                          {conversation.participant.role}
                        </Badge>
                        
                        {conversation.shoot?.serviceTypes.map((service) => (
                          <Badge
                            key={service}
                            variant="outline"
                            className={`text-xs h-5 py-0 px-1.5 ${getServiceTypeColor(service)}`}
                          >
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-48 p-4">
                <Search className="h-8 w-8 text-muted-foreground mb-2 opacity-25" />
                <p className="text-sm text-muted-foreground text-center">
                  No conversations match your filters
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2"
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
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
