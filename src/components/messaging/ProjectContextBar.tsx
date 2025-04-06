
import React from 'react';
import { format } from 'date-fns';
import { Home, Calendar, Clock, CheckCircle, RotateCw, MapPin, Paperclip, Link } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Conversation } from '@/types/messages';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ProjectContextBarProps {
  conversation: Conversation;
  className?: string;
}

export function ProjectContextBar({ conversation, className }: ProjectContextBarProps) {
  // Status icon based on shoot status
  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'scheduled':
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'inProgress':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'revisions':
        return <RotateCw className="h-4 w-4 text-purple-500" />;
      case 'complete':
        return <CheckCircle className="h-4 w-4 text-green-700" />;
      default:
        return <Calendar className="h-4 w-4 text-muted-foreground" />;
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy h:mm a');
  };

  // Service type colors
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
    <ScrollArea className={cn("h-full", className)}>
      <div className="space-y-6">
        {/* Contact Information */}
        <div>
          <h3 className="text-sm font-medium mb-3">Contact Information</h3>
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={conversation.participant.avatar} alt={conversation.participant.name} />
              <AvatarFallback>{conversation.participant.name.charAt(0)}</AvatarFallback>
            </Avatar>
            
            <div>
              <p className="font-medium">{conversation.participant.name}</p>
              <p className="text-sm text-muted-foreground capitalize">
                {conversation.participant.role}
              </p>
              <p className="text-xs text-primary mt-1">
                {conversation.participant.role === 'client' ? 'View client profile' : 
                 conversation.participant.role === 'photographer' ? 'View photographer profile' : 'View editor profile'}
              </p>
            </div>
          </div>
          
          <div className="mt-4 grid gap-2">
            <Button variant="outline" size="sm" className="justify-start">
              <Link className="mr-2 h-4 w-4" />
              Send email
            </Button>
            <Button variant="outline" size="sm" className="justify-start">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule meeting
            </Button>
          </div>
        </div>
        
        <Separator />
        
        {/* Project Information */}
        {conversation.shoot && (
          <div>
            <h3 className="text-sm font-medium mb-3">Project Details</h3>
            <Card className="bg-slate-50 border shadow-none overflow-hidden">
              {conversation.shoot.thumbnailUrl && (
                <div className="h-32 w-full">
                  <img 
                    src={conversation.shoot.thumbnailUrl || '/placeholder.svg'} 
                    alt={conversation.shoot.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <CardContent className="p-3">
                <h4 className="font-medium mb-1">
                  {conversation.shoot.title}
                </h4>
                
                <div className="flex items-center gap-1 mb-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{conversation.shoot.address}</span>
                </div>
                
                <div className="flex items-center gap-1 mb-2">
                  {getStatusIcon(conversation.shoot.status)}
                  <span className="text-xs capitalize">
                    {conversation.shoot.status}
                  </span>
                  <Badge variant="outline" className="ml-1 h-5 text-xs">
                    #{conversation.shoot.id}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-1 mb-2">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs">
                    {formatDate(conversation.shoot.scheduledDate)}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-1 mt-3">
                  {conversation.shoot.serviceTypes.map((service) => (
                    <Badge 
                      key={service}
                      variant="outline"
                      className={cn("text-xs h-5 py-0 px-1.5", getServiceTypeColor(service))}
                    >
                      {service}
                    </Badge>
                  ))}
                </div>
                
                <div className="mt-3">
                  <Button size="sm" variant="default" className="w-full">
                    View Project Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        <Separator />
        
        {/* Attachments Section */}
        <div>
          <h3 className="text-sm font-medium mb-3">Shared Files</h3>
          <div className="space-y-2">
            <Card className="p-2 flex items-center gap-2">
              <div className="bg-blue-100 p-2 rounded">
                <Paperclip className="h-4 w-4 text-blue-700" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-xs truncate">project_requirements.pdf</p>
                <p className="text-xs text-muted-foreground">245 KB • Added 3 days ago</p>
              </div>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                <Link className="h-3.5 w-3.5" />
              </Button>
            </Card>
            
            <Card className="p-2 flex items-center gap-2">
              <div className="bg-blue-100 p-2 rounded">
                <Paperclip className="h-4 w-4 text-blue-700" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-xs truncate">shot_list.xlsx</p>
                <p className="text-xs text-muted-foreground">118 KB • Added 2 days ago</p>
              </div>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                <Link className="h-3.5 w-3.5" />
              </Button>
            </Card>
            
            <Button size="sm" variant="outline" className="w-full">
              <Paperclip className="mr-1.5 h-3.5 w-3.5" />
              View All Files
            </Button>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
