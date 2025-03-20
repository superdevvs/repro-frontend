
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ShootCard } from './ShootCard';
import { ArrowRightIcon, CameraIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useShoots } from '@/context/ShootsContext';
import { compareAsc, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';

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
      const shootDate = parseISO(shoot.scheduledDate);
      return compareAsc(shootDate, today) >= 0;
    })
    .sort((a, b) => {
      // Sort by date, earliest first
      return compareAsc(parseISO(a.scheduledDate), parseISO(b.scheduledDate));
    })
    .slice(0, 3); // Only show the first 3 upcoming shoots

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
          <div className="grid gap-4">
            {upcomingShoots.length > 0 ? (
              upcomingShoots.map((shoot, index) => (
                <ShootCard
                  key={shoot.id}
                  id={shoot.id}
                  address={shoot.location.fullAddress}
                  date={shoot.scheduledDate}
                  time="10:00 AM - 12:00 PM" // This should come from actual data in a real app
                  photographer={{
                    name: shoot.photographer.name,
                    avatar: shoot.photographer.avatar || "https://ui.shadcn.com/avatars/01.png",
                  }}
                  client={{
                    name: shoot.client.name,
                  }}
                  status={shoot.status}
                  price={shoot.payment.totalQuote}
                  delay={index}
                  onClick={() => navigate(`/shoots?id=${shoot.id}`)}
                />
              ))
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
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
