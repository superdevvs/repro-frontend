
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ShootCard } from './ShootCard';
import { ArrowRightIcon, CameraIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface UpcomingShootsProps {
  className?: string;
}

// Mock data for upcoming shoots
const upcomingShoots = [
  {
    id: '001',
    address: '123 Main Street, Anytown, MD 12345',
    date: 'May 15, 2023',
    time: '10:00 AM - 12:00 PM',
    photographer: {
      name: 'John Doe',
      avatar: 'https://ui.shadcn.com/avatars/01.png',
    },
    client: {
      name: 'ABC Properties',
    },
    status: 'scheduled',
    price: 250,
  },
  {
    id: '002',
    address: '456 Park Avenue, Somewhere, VA 23456',
    date: 'May 16, 2023',
    time: '2:00 PM - 4:00 PM',
    photographer: {
      name: 'Jane Smith',
      avatar: 'https://ui.shadcn.com/avatars/02.png',
    },
    client: {
      name: 'XYZ Realty',
    },
    status: 'scheduled',
    price: 350,
  },
  {
    id: '003',
    address: '789 Ocean Drive, Beachtown, DC 34567',
    date: 'May 17, 2023',
    time: '11:00 AM - 1:00 PM',
    photographer: {
      name: 'John Doe',
      avatar: 'https://ui.shadcn.com/avatars/01.png',
    },
    client: {
      name: 'Coastal Properties',
    },
    status: 'pending',
    price: 300,
  },
];

export function UpcomingShoots({ className }: UpcomingShootsProps) {
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
          <Button variant="ghost" size="sm" className="gap-1">
            View all <ArrowRightIcon className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid gap-4">
            {upcomingShoots.map((shoot, index) => (
              <ShootCard
                key={shoot.id}
                id={shoot.id}
                address={shoot.address}
                date={shoot.date}
                time={shoot.time}
                photographer={shoot.photographer}
                client={shoot.client}
                status={shoot.status as any}
                price={shoot.price}
                delay={index}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
