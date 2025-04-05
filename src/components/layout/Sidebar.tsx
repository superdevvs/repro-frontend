
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { SidebarContent } from './SidebarContent';
import { MobileSidebar } from './MobileSidebar';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  if (isMobile) {
    return <MobileSidebar />;
  }
  
  return (
    <motion.div
      initial={false}
      animate={{
        width: isCollapsed ? 80 : 240,
      }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className={cn(
        'group border-r bg-background p-3 py-4 relative hidden md:block',
        isCollapsed && 'items-center',
        className
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          'absolute right-3 top-3 h-8 w-8',
          isCollapsed && 'absolute -right-4 top-12 z-50 bg-background border shadow-sm'
        )}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <ChevronRightIcon className="h-4 w-4" /> : <ChevronLeftIcon className="h-4 w-4" />}
      </Button>
      
      <SidebarContent isCollapsed={isCollapsed} isMobile={false} />
    </motion.div>
  );
}
