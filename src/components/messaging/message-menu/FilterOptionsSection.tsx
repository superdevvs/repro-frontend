
import React from 'react';
import { FilterIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MenuSection } from './MenuSection';
import { ConversationFilter } from '@/types/messages';
import { FilterGroup } from './FilterGroup';

interface FilterOptionsSectionProps {
  filter: ConversationFilter;
  onFilterChange: (filter: ConversationFilter) => void;
}

export function FilterOptionsSection({ filter, onFilterChange }: FilterOptionsSectionProps) {
  return (
    <MenuSection
      title="Filter Options"
      icon={<FilterIcon className="h-4 w-4 mr-1.5" />}
    >
      <div className="space-y-3">
        <FilterGroup 
          title="Service Type"
          options={['photography', 'drone', 'floorplan', 'staging']}
          selectedValues={filter.serviceType || []}
          onChange={(newValues) => {
            onFilterChange({
              ...filter,
              serviceType: newValues as any
            });
          }}
        />
        
        <FilterGroup 
          title="Status"
          options={['scheduled', 'inProgress', 'delivered', 'revisions', 'complete']}
          selectedValues={filter.status || []}
          onChange={(newValues) => {
            onFilterChange({
              ...filter,
              status: newValues as any
            });
          }}
        />
        
        <FilterGroup 
          title="User Type"
          options={['client', 'photographer', 'editor']}
          selectedValues={filter.userType || []}
          onChange={(newValues) => {
            onFilterChange({
              ...filter,
              userType: newValues as any
            });
          }}
        />
      </div>
    </MenuSection>
  );
}
