
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { UsersIcon, UserIcon, CameraIcon, BarChart3Icon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ClientStatsProps {
  totalClients: number;
  activeClients: number;
  totalShoots: number;
  averageShootsPerClient: number;
}

export const ClientStats: React.FC<ClientStatsProps> = ({
  totalClients,
  activeClients,
  totalShoots,
  averageShootsPerClient
}) => {
  const statItems = [
    {
      title: "Total Clients",
      value: totalClients,
      icon: <UsersIcon className="h-5 w-5 text-primary" />,
      bgClass: "bg-primary/10",
      delay: 0.1
    },
    {
      title: "Active Clients",
      value: activeClients,
      icon: <UserIcon className="h-5 w-5 text-green-500" />,
      bgClass: "bg-green-500/10",
      delay: 0.2
    },
    {
      title: "Total Shoots",
      value: totalShoots,
      icon: <CameraIcon className="h-5 w-5 text-blue-500" />,
      bgClass: "bg-blue-500/10",
      delay: 0.3
    },
    {
      title: "Avg. Shoots per Client",
      value: averageShootsPerClient,
      icon: <BarChart3Icon className="h-5 w-5 text-purple-500" />,
      bgClass: "bg-purple-500/10",
      delay: 0.4
    }
  ];
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
      {statItems.map((item, index) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: item.delay, duration: 0.3 }}
        >
          <Card className="border-none shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">{item.title}</p>
                  <h3 className="text-xl sm:text-2xl font-bold mt-1">{item.value}</h3>
                </div>
                <div className={cn("p-2.5 rounded-full", item.bgClass)}>
                  {item.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};
