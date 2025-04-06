
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { UsersIcon, UserIcon, CameraIcon, BarChart3Icon, Activity, TrendingUp, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
  const statItems = [
    {
      title: "Total Clients",
      value: totalClients,
      icon: <Users className="h-5 w-5 text-primary" />,
      bgClass: "bg-primary/10",
      iconClass: "text-primary",
      delay: 0.1
    },
    {
      title: "Active Clients",
      value: activeClients,
      icon: <UserIcon className="h-5 w-5 text-green-500" />,
      bgClass: "bg-green-500/10",
      iconClass: "text-green-500",
      delay: 0.2
    },
    {
      title: "Total Shoots",
      value: totalShoots,
      icon: <CameraIcon className="h-5 w-5 text-blue-500" />,
      bgClass: "bg-blue-500/10",
      iconClass: "text-blue-500",
      delay: 0.3
    },
    {
      title: "Avg. Shoots",
      value: averageShootsPerClient,
      icon: <TrendingUp className="h-5 w-5 text-purple-500" />,
      bgClass: "bg-purple-500/10",
      iconClass: "text-purple-500",
      delay: 0.4
    }
  ];
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 px-0">
      {statItems.map((item, index) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: item.delay, duration: 0.3 }}
        >
          <Card className="border glass-card overflow-hidden">
            <CardContent className={`${isMobile ? 'p-3' : 'p-4'} relative`}>
              <div className="absolute top-0 right-0 h-full w-1/3 opacity-5">
                {item.icon}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-muted-foreground mb-1`}>
                    {item.title}
                  </p>
                  <h3 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold`}>
                    {typeof item.value === 'number' && item.title === "Avg. Shoots" 
                      ? item.value.toFixed(1) 
                      : item.value
                    }
                  </h3>
                </div>
                <div className={cn(`p-2 rounded-full`, item.bgClass)}>
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
