
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ShootCard } from './ShootCard';
import { ArrowRightIcon, CameraIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useShoots } from '@/context/ShootsContext';
import { compareAsc, format, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { ensureDateString } from '@/utils/formatters';

interface UpcomingShootsProps {
  className?: string;
}

export function UpcomingShoots({ className }: UpcomingShootsProps) {
  const { shoots } = useShoots();
  const navigate = useNavigate();
  
  // Get today's date at the beginning of the day
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Filter and sort upcoming shoots
  const upcomingShoots = shoots
    .filter(shoot => {
      // Only include scheduled shoots
      if (shoot.status !== 'scheduled') return false;
      
      // Only include shoots scheduled for today or in the future
      const shootDateStr = ensureDateString(shoot.scheduledDate);
      const shootDate = parseISO(shootDateStr);
      return compareAsc(shootDate, today) >= 0;
    })
    .sort((a, b) => {
      // Sort by date, earliest first
      const aDateStr = ensureDateString(a.scheduledDate);
      const bDateStr = ensureDateString(b.scheduledDate);
      return compareAsc(parseISO(aDateStr), parseISO(bDateStr));
    })
    .slice(0, 6); // Show up to 6 upcoming shoots for better space utilization

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className={cn("w-full", className)}
    >
      <Card className="glass-card h-full">
        <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border">
          <div className="flex items-center gap-2">
            <CameraIcon className="h-5 w-5 text-primary" />
            <CardTitle>Upcoming Shoots</CardTitle>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-1"
            onClick={() => navigate('/shoots')}
          >
            View all <ArrowRightIcon className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-4">
          {upcomingShoots.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingShoots.map((shoot, index) => (
                <div 
                  key={shoot.id}
                  className="bg-secondary/10 p-3 rounded-md cursor-pointer hover:bg-secondary/20 transition-colors"
                  onClick={() => navigate(`/shoots?id=${shoot.id}`)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium line-clamp-1">{shoot.location.fullAddress}</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {format(parseISO(ensureDateString(shoot.scheduledDate)), 'MMM d, yyyy')}
                        </Badge>
                        <Badge variant="outline" className="text-xs bg-primary/10">
                          ${shoot.payment?.totalQuote || 0}
                        </Badge>
                      </div>
                    </div>
                    <Badge className="capitalize">
                      {shoot.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                    <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center text-xs">
                      {shoot.photographer?.name ? shoot.photographer.name.split(' ').map(n => n[0]).join('') : '?'}
                    </div>
                    <span>{shoot.photographer?.name || 'Unassigned'}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-muted-foreground">No upcoming shoots scheduled.</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => navigate('/book-shoot')}
              >
                Book a Shoot
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
