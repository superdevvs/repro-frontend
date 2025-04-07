
import React from 'react';
import { FolderIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { MenuSection } from './MenuSection';

interface FoldersSectionProps {
  showFolders: boolean;
  setShowFolders: (show: boolean) => void;
  folders: { id: string; name: string; count: number }[];
}

export function FoldersSection({ 
  showFolders, 
  setShowFolders, 
  folders 
}: FoldersSectionProps) {
  return (
    <MenuSection
      title="Folders"
      icon={<FolderIcon className="h-4 w-4 mr-1.5" />}
      isCollapsible
      isExpanded={showFolders}
      onToggleExpand={() => setShowFolders(!showFolders)}
    >
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
    </MenuSection>
  );
}
