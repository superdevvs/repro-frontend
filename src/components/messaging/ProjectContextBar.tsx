
import React from 'react';
import { format } from 'date-fns';
import { MapPin, Calendar, Clock, CheckCircle, RotateCw, Camera, Drone, Floorplan, PenTool, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Conversation } from '@/types/messages';
import { ShootData } from '@/types/shoots';

interface ProjectContextBarProps {
  conversation: Conversation;
  shoot?: ShootData;
  className?: string;
}

export function ProjectContextBar({ conversation, shoot, className }: ProjectContextBarProps) {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'scheduled': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'inProgress': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'delivered': return 'text-green-600 bg-green-50 border-green-200';
      case 'revisions': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'complete': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'scheduled': return <Calendar className="h-3.5 w-3.5" />;
      case 'inProgress': return <Clock className="h-3.5 w-3.5" />;
      case 'delivered': return <CheckCircle className="h-3.5 w-3.5" />;
      case 'revisions': return <RotateCw className="h-3.5 w-3.5" />;
      case 'complete': return <CheckCircle className="h-3.5 w-3.5" />;
      default: return <Clock className="h-3.5 w-3.5" />;
    }
  };

  const getServiceIcon = (service: string) => {
    switch (service) {
      case 'photography': return <Camera className="h-3.5 w-3.5" />;
      case 'drone': return <Drone className="h-3.5 w-3.5" />;
      case 'floorplan': return <Floorplan className="h-3.5 w-3.5" />;
      case 'staging': return <PenTool className="h-3.5 w-3.5" />;
      default: return <Camera className="h-3.5 w-3.5" />;
    }
  };

  const getServiceColor = (service: string) => {
    switch (service) {
      case 'photography': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'drone': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'floorplan': return 'text-red-600 bg-red-50 border-red-200';
      case 'staging': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // If no shoot data, show minimal info
  if (!conversation.shoot && !shoot) {
    return (
      <Card className={cn("border-0 shadow-none", className)}>
        <CardContent className="p-3">
          <div className="flex items-center gap-2 pb-3 border-b">
            <User className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm font-medium">{conversation.participant.name}</p>
            <Badge variant="outline" className="ml-auto">
              {conversation.participant.role}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground pt-3">
            No project associated with this conversation
          </p>
        </CardContent>
      </Card>
    );
  }

  // Combine data from conversation and shoot (if available)
  const projectData = shoot || conversation.shoot;

  return (
    <Card className={cn("border-0 shadow-none", className)}>
      <CardContent className="p-3 space-y-3">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Project Details</h3>
            <Badge 
              variant="outline" 
              className={cn("text-xs py-0 px-2 gap-1", getStatusColor(projectData?.status))}
            >
              {getStatusIcon(projectData?.status)}
              <span>{projectData?.status}</span>
            </Badge>
          </div>
          <h2 className="text-base font-bold">{projectData?.title}</h2>
        </div>
        
        {projectData?.address && (
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm">{projectData.address}</p>
              <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                View on map
              </Button>
            </div>
          </div>
        )}
        
        {projectData?.scheduledDate && (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm">
                {format(new Date(projectData.scheduledDate), 'EEEE, MMMM d, yyyy')}
              </p>
            </div>
          </div>
        )}
        
        {/* Services */}
        {projectData?.serviceTypes && projectData.serviceTypes.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1.5">Services</p>
            <div className="flex flex-wrap gap-1.5">
              {projectData.serviceTypes.map((service) => (
                <Badge 
                  key={service} 
                  variant="outline"
                  className={cn("text-xs py-0 px-2 gap-1", getServiceColor(service))}
                >
                  {getServiceIcon(service)}
                  <span>{service}</span>
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {/* Team Members */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1.5">Team</p>
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={conversation.participant.avatar} />
              <AvatarFallback className="text-xs">{conversation.participant.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{conversation.participant.name}</p>
              <p className="text-xs text-muted-foreground">{conversation.participant.role}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
