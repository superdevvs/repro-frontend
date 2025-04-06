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

// Add this helper function inside the component
const getNotesObject = (notes: any): any => {
  if (typeof notes === 'string') {
    return { shootNotes: notes };
  }
  return notes || {};
};

export function ShootNotesTab({ 
  shoot, 
  isAdmin, 
  isPhotographer,
  role 
}: ShootNotesTabProps) {
  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-muted-foreground">Shoot Notes</h3>
        </div>
        <Textarea 
          placeholder="No shoot notes available" 
          value={getNotesObject(shoot.notes).shootNotes || ''} 
          readOnly
          className="resize-none min-h-[100px]"
        />
      </div>
      
      {(isAdmin || isPhotographer) && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Photographer Notes</h3>
          </div>
          <Textarea 
            placeholder="No photographer notes available" 
            value={getNotesObject(shoot.notes).photographerNotes || ''}
            readOnly={!isPhotographer}
            className="resize-none min-h-[100px]"
          />
        </div>
      )}
      
      {isAdmin && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Company Notes</h3>
          </div>
          <Textarea 
            placeholder="No company notes available" 
            value={getNotesObject(shoot.notes).companyNotes || ''}
            className="resize-none min-h-[100px]"
          />
        </div>
      )}
      
      {(isAdmin || role === 'editor') && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Editing Notes</h3>
          </div>
          <Textarea 
            placeholder="No editing notes available" 
            value={getNotesObject(shoot.notes).editingNotes || ''}
            readOnly={role !== 'editor'}
            className="resize-none min-h-[100px]"
          />
        </div>
      )}
    </div>
  );
}
