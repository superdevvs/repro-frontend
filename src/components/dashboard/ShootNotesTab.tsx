
import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PenLine } from "lucide-react";
import { ShootData } from '@/types/shoots';

interface ShootNotesTabProps {
  shoot: ShootData;
  isAdmin: boolean;
  isPhotographer: boolean;
  role: string;
}

export function ShootNotesTab({ 
  shoot, 
  isAdmin, 
  isPhotographer,
  role 
}: ShootNotesTabProps) {
  // Helper function to safely get notes based on type
  const getNotes = (key: string): string => {
    if (!shoot.notes) return '';
    if (typeof shoot.notes === 'string') return shoot.notes;
    return shoot.notes[key as keyof typeof shoot.notes] || '';
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-muted-foreground">Shoot Notes</h3>
          <Button variant="ghost" size="sm">
            <PenLine className="h-3.5 w-3.5 mr-1" />
            Edit
          </Button>
        </div>
        <Textarea 
          placeholder="No shoot notes available" 
          value={getNotes('shootNotes')} 
          readOnly
          className="resize-none min-h-[100px]"
        />
      </div>
      
      {(isAdmin || isPhotographer) && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Photographer Notes</h3>
            {isPhotographer && (
              <Button variant="ghost" size="sm">
                <PenLine className="h-3.5 w-3.5 mr-1" />
                Edit
              </Button>
            )}
          </div>
          <Textarea 
            placeholder="No photographer notes available" 
            value={getNotes('photographerNotes')}
            readOnly={!isPhotographer}
            className="resize-none min-h-[100px]"
          />
        </div>
      )}
      
      {isAdmin && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Company Notes</h3>
            <Button variant="ghost" size="sm">
              <PenLine className="h-3.5 w-3.5 mr-1" />
              Edit
            </Button>
          </div>
          <Textarea 
            placeholder="No company notes available" 
            value={getNotes('companyNotes')}
            className="resize-none min-h-[100px]"
          />
        </div>
      )}
      
      {(isAdmin || role === 'editor') && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Editing Notes</h3>
            {role === 'editor' && (
              <Button variant="ghost" size="sm">
                <PenLine className="h-3.5 w-3.5 mr-1" />
                Edit
              </Button>
            )}
          </div>
          <Textarea 
            placeholder="No editing notes available" 
            value={getNotes('editingNotes')}
            readOnly={role !== 'editor'}
            className="resize-none min-h-[100px]"
          />
        </div>
      )}
    </div>
  );
}
