
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';
import { 
  FolderIcon, 
  TagIcon, 
  ChevronDown, 
  FilterIcon,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ConversationFilter } from '@/types/messages';

interface MessagesMobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    showFolders: boolean;
    setShowFolders: (show: boolean) => void;
    folders: { id: string; name: string; count: number }[];
    labels: { id: string; name: string; color: string }[];
    filter: ConversationFilter;
    onFilterChange: (filter: ConversationFilter) => void;
  };
}

export function MessagesMobileMenu({ isOpen, onClose, filters }: MessagesMobileMenuProps) {
  const { theme } = useTheme();
  const isLightMode = theme === 'light';

  // Animation variants for the modal
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const menuVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } }
  };

  if (!isOpen) return null;

  const { 
    showFolders, 
    setShowFolders, 
    folders, 
    labels, 
    filter, 
    onFilterChange 
  } = filters;

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={backdropVariants}
      onClick={onClose}
    >
      <motion.div 
        className={cn(
          "absolute bottom-16 left-0 right-0 mx-4 rounded-xl overflow-hidden",
          isLightMode 
            ? "bg-white border border-gray-200 shadow-lg" 
            : "bg-background border border-border shadow-xl"
        )}
        variants={menuVariants}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-3 border-b flex items-center justify-between">
          <h3 className="font-medium">Message Filters</h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="max-h-[60vh] overflow-y-auto">
          <div className="p-3">
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1.5">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 text-xs flex items-center p-1 pl-0 hover:bg-transparent" 
                  onClick={() => setShowFolders(!showFolders)}
                >
                  <ChevronDown className={cn("h-3.5 w-3.5 mr-1 transition-transform", !showFolders && "transform -rotate-90")} />
                  <FolderIcon className="h-4 w-4 mr-1.5" />
                  <span className="font-semibold">Folders</span>
                </Button>
              </div>
              
              {showFolders && (
                <div className="ml-3 space-y-1">
                  {folders.map(folder => (
                    <Button
                      key={folder.id}
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "w-full justify-start text-xs h-7 px-2 hover:bg-slate-100",
                        folder.id === 'inbox' && "font-medium"
                      )}
                    >
                      <span className="truncate">{folder.name}</span>
                      {folder.count > 0 && (
                        <Badge variant="secondary" className="ml-auto">
                          {folder.count}
                        </Badge>
                      )}
                    </Button>
                  ))}
                </div>
              )}
            </div>
            
            <Separator className="my-3" />
            
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1.5">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 text-xs flex items-center p-1 pl-0 hover:bg-transparent"
                >
                  <TagIcon className="h-4 w-4 mr-1.5" />
                  <span className="font-semibold">Labels</span>
                </Button>
              </div>
              
              <div className="ml-3 space-y-1">
                {labels.map(label => (
                  <Button
                    key={label.id}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs h-7 px-2 hover:bg-slate-100"
                  >
                    <span className={cn("h-2.5 w-2.5 rounded-full mr-2", label.color)}></span>
                    <span className="truncate">{label.name}</span>
                  </Button>
                ))}
              </div>
            </div>
            
            <Separator className="my-3" />
            
            <div className="mb-2">
              <div className="flex items-center justify-between mb-1.5">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 text-xs flex items-center p-1 pl-0 hover:bg-transparent"
                >
                  <FilterIcon className="h-4 w-4 mr-1.5" />
                  <span className="font-semibold">Filter Options</span>
                </Button>
              </div>
              
              <div className="ml-3 space-y-3">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Service Type</p>
                  <div className="flex flex-wrap gap-1">
                    {['photography', 'drone', 'floorplan', 'staging'].map((type) => (
                      <Button
                        key={type}
                        variant={filter.serviceType?.includes(type as any) ? "default" : "outline"}
                        size="sm"
                        className="text-xs h-7"
                        onClick={() => {
                          const newTypes = filter.serviceType || [];
                          onFilterChange({
                            ...filter,
                            serviceType: filter.serviceType?.includes(type as any)
                              ? newTypes.filter(t => t !== type) as any
                              : [...newTypes, type] as any
                          });
                        }}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Status</p>
                  <div className="flex flex-wrap gap-1">
                    {['scheduled', 'inProgress', 'delivered', 'revisions', 'complete'].map((status) => (
                      <Button
                        key={status}
                        variant={filter.status?.includes(status as any) ? "default" : "outline"}
                        size="sm"
                        className="text-xs h-7"
                        onClick={() => {
                          const newStatus = filter.status || [];
                          onFilterChange({
                            ...filter,
                            status: filter.status?.includes(status as any)
                              ? newStatus.filter(s => s !== status) as any
                              : [...newStatus, status] as any
                          });
                        }}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground mb-1">User Type</p>
                  <div className="flex flex-wrap gap-1">
                    {['client', 'photographer', 'editor'].map((role) => (
                      <Button
                        key={role}
                        variant={filter.userType?.includes(role as any) ? "default" : "outline"}
                        size="sm"
                        className="text-xs h-7"
                        onClick={() => {
                          const newRoles = filter.userType || [];
                          onFilterChange({
                            ...filter,
                            userType: filter.userType?.includes(role as any)
                              ? newRoles.filter(r => r !== role) as any
                              : [...newRoles, role] as any
                          });
                        }}
                      >
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-center text-xs mt-2"
              onClick={() => onFilterChange({
                searchQuery: '',
                serviceType: undefined,
                status: undefined,
                userType: undefined,
                dateRange: 'all'
              })}
            >
              Clear All Filters
            </Button>
          </div>
        </ScrollArea>
      </motion.div>
    </motion.div>
  );
}
