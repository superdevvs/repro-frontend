
import React from 'react';
import { TagIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MenuSection } from './MenuSection';

interface LabelsSectionProps {
  labels: { id: string; name: string; color: string }[];
}

export function LabelsSection({ labels }: LabelsSectionProps) {
  return (
    <MenuSection
      title="Labels"
      icon={<TagIcon className="h-4 w-4 mr-1.5" />}
    >
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
    </MenuSection>
  );
}
