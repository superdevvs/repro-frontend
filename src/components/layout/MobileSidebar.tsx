
import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { MenuIcon } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { SidebarContent } from './SidebarContent';

export function MobileSidebar() {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  
  // Close the mobile sidebar when the route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);
  
  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="h-10 w-10 fixed z-50 bottom-5 right-5 rounded-full bg-primary text-primary-foreground shadow-lg">
            <MenuIcon className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-[280px]">
          <SidebarContent isCollapsed={false} isMobile={true} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
