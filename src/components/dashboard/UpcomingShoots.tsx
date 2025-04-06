import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShootData } from '@/types/shoots';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Clock, ArrowRight } from 'lucide-react';
import { format, parseISO, isFuture } from 'date-fns';

export interface UpcomingShoots {
  maxItems?: number;
  shoots: ShootData[];
}

export function UpcomingShoots({ maxItems = 5, shoots }: UpcomingShoots) {
  const navigate = useNavigate();

  // Filter to get only future shoots
  const upcomingShoots = shoots
    .filter(shoot => {
      const shootDate = typeof shoot.scheduledDate === 'string'
        ? parseISO(shoot.scheduledDate)
        : new Date(shoot.scheduledDate);
      return isFuture(shootDate) && shoot.status === 'scheduled';
    })
    .sort((a, b) => {
      const dateA = typeof a.scheduledDate === 'string'
        ? parseISO(a.scheduledDate)
        : new Date(a.scheduledDate);
      const dateB = typeof b.scheduledDate === 'string'
        ? parseISO(b.scheduledDate)
        : new Date(b.scheduledDate);
      return dateA.getTime() - dateB.getTime();
    })
    .slice(0, maxItems);

  const handleViewShoot = (shootId: string) => {
    navigate(`/shoots/${shootId}`);
  };

  const handleViewAll = () => {
    navigate('/shoots');
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Upcoming Shoots</CardTitle>
          <Button onClick={handleViewAll} variant="ghost" size="sm">
            View all
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        <CardDescription>
          Your upcoming scheduled photo shoots
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingShoots.length > 0 ? (
            upcomingShoots.map((shoot) => {
              const shootDate = typeof shoot.scheduledDate === 'string'
                ? parseISO(shoot.scheduledDate)
                : new Date(shoot.scheduledDate);
              
              return (
                <div 
                  key={shoot.id}
                  className="border border-border rounded-md p-3 cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => handleViewShoot(shoot.id)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-sm">{shoot.client.name}</h3>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <MapPin className="h-3.5 w-3.5 mr-1" />
                        {shoot.location.address}
                      </div>
                    </div>
                    <Badge>
                      {shoot.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center text-xs text-muted-foreground mt-2">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    {format(shootDate, 'MMMM d, yyyy')}
                    
                    {shoot.time && (
                      <>
                        <Clock className="h-3.5 w-3.5 mx-1" />
                        {shoot.time}
                      </>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-6 text-sm text-muted-foreground">
              No upcoming shoots scheduled
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
