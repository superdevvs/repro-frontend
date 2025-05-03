
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PenLine, Save, X } from "lucide-react";
import { ShootData } from '@/types/shoots';
import { useShoots } from '@/context/ShootsContext';
import { useToast } from '@/hooks/use-toast';

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
  const { updateShoot } = useShoots();
  const { toast } = useToast();
  
  const [editableNotes, setEditableNotes] = useState({
    shootNotes: '',
    photographerNotes: '',
    companyNotes: '',
    editingNotes: ''
  });
  
  const [activeEdits, setActiveEdits] = useState({
    shootNotes: false,
    photographerNotes: false,
    companyNotes: false,
    editingNotes: false
  });

  // Initialize notes from the shoot data when component mounts or shoot changes
  useEffect(() => {
    setEditableNotes({
      shootNotes: getNotes('shootNotes'),
      photographerNotes: getNotes('photographerNotes'),
      companyNotes: getNotes('companyNotes'),
      editingNotes: getNotes('editingNotes')
    });
  }, [shoot]);

  // Helper function to safely get notes based on type
  function getNotes(key: string): string {
    if (!shoot.notes) return '';
    if (typeof shoot.notes === 'string') return shoot.notes;
    return shoot.notes[key as keyof typeof shoot.notes] || '';
  }
  
  function handleEditToggle(noteType: string) {
    setActiveEdits(prev => ({
      ...prev,
      [noteType]: !prev[noteType as keyof typeof prev]
    }));
    
    // If we're canceling the edit, reset back to original value
    if (activeEdits[noteType as keyof typeof activeEdits]) {
      setEditableNotes(prev => ({
        ...prev,
        [noteType]: getNotes(noteType)
      }));
    }
  }
  
  function handleNoteChange(e: React.ChangeEvent<HTMLTextAreaElement>, noteType: string) {
    setEditableNotes(prev => ({
      ...prev,
      [noteType]: e.target.value
    }));
  }
  
  function handleSaveNotes(noteType: string) {
    console.log(`Saving ${noteType} with content: ${editableNotes[noteType as keyof typeof editableNotes]}`);
    
    // Create a new notes object based on existing notes
    let updatedNotes: any = {};
    
    // If notes is a string, convert to object first
    if (typeof shoot.notes === 'string') {
      updatedNotes = { shootNotes: shoot.notes };
    } else if (shoot.notes) {
      updatedNotes = { ...shoot.notes };
    }
    
    // Update the specific note type
    updatedNotes[noteType] = editableNotes[noteType as keyof typeof editableNotes];
    
    console.log("Updated notes object:", updatedNotes);
    console.log("Shoot ID:", shoot.id);
    
    // Save to database
    updateShoot(shoot.id, { notes: updatedNotes });
    
    // Exit edit mode
    setActiveEdits(prev => ({
      ...prev,
      [noteType]: false
    }));
  }

  // Updated to allow admin and superadmin to edit all types of notes
  function canEdit(noteType: string): boolean {
    if (isAdmin || role === 'superadmin') {
      return true; // Admin and superadmin can edit all note types
    }
    
    switch (noteType) {
      case 'photographerNotes': 
        return isPhotographer;
      case 'editingNotes': 
        return role === 'editor';
      default: 
        return false;
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-muted-foreground">Shoot Notes</h3>
          {canEdit('shootNotes') && !activeEdits.shootNotes && (
            <Button variant="ghost" size="sm" onClick={() => handleEditToggle('shootNotes')}>
              <PenLine className="h-3.5 w-3.5 mr-1" />
              Edit
            </Button>
          )}
          {canEdit('shootNotes') && activeEdits.shootNotes && (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => handleEditToggle('shootNotes')}>
                <X className="h-3.5 w-3.5 mr-1" />
                Cancel
              </Button>
              <Button variant="default" size="sm" onClick={() => handleSaveNotes('shootNotes')}>
                <Save className="h-3.5 w-3.5 mr-1" />
                Save
              </Button>
            </div>
          )}
        </div>
        <Textarea 
          placeholder="No shoot notes available" 
          value={activeEdits.shootNotes ? editableNotes.shootNotes : getNotes('shootNotes')}
          onChange={(e) => handleNoteChange(e, 'shootNotes')}
          readOnly={!activeEdits.shootNotes}
          className="resize-none min-h-[100px]"
        />
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-muted-foreground">Photographer Notes</h3>
          {canEdit('photographerNotes') && !activeEdits.photographerNotes && (
            <Button variant="ghost" size="sm" onClick={() => handleEditToggle('photographerNotes')}>
              <PenLine className="h-3.5 w-3.5 mr-1" />
              Edit
            </Button>
          )}
          {canEdit('photographerNotes') && activeEdits.photographerNotes && (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => handleEditToggle('photographerNotes')}>
                <X className="h-3.5 w-3.5 mr-1" />
                Cancel
              </Button>
              <Button variant="default" size="sm" onClick={() => handleSaveNotes('photographerNotes')}>
                <Save className="h-3.5 w-3.5 mr-1" />
                Save
              </Button>
            </div>
          )}
        </div>
        <Textarea 
          placeholder="No photographer notes available" 
          value={activeEdits.photographerNotes ? editableNotes.photographerNotes : getNotes('photographerNotes')}
          onChange={(e) => handleNoteChange(e, 'photographerNotes')}
          readOnly={!activeEdits.photographerNotes}
          className="resize-none min-h-[100px]"
        />
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-muted-foreground">Company Notes</h3>
          {canEdit('companyNotes') && !activeEdits.companyNotes && (
            <Button variant="ghost" size="sm" onClick={() => handleEditToggle('companyNotes')}>
              <PenLine className="h-3.5 w-3.5 mr-1" />
              Edit
            </Button>
          )}
          {canEdit('companyNotes') && activeEdits.companyNotes && (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => handleEditToggle('companyNotes')}>
                <X className="h-3.5 w-3.5 mr-1" />
                Cancel
              </Button>
              <Button variant="default" size="sm" onClick={() => handleSaveNotes('companyNotes')}>
                <Save className="h-3.5 w-3.5 mr-1" />
                Save
              </Button>
            </div>
          )}
        </div>
        <Textarea 
          placeholder="No company notes available" 
          value={activeEdits.companyNotes ? editableNotes.companyNotes : getNotes('companyNotes')}
          onChange={(e) => handleNoteChange(e, 'companyNotes')}
          readOnly={!activeEdits.companyNotes}
          className="resize-none min-h-[100px]"
        />
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-muted-foreground">Editing Notes</h3>
          {canEdit('editingNotes') && !activeEdits.editingNotes && (
            <Button variant="ghost" size="sm" onClick={() => handleEditToggle('editingNotes')}>
              <PenLine className="h-3.5 w-3.5 mr-1" />
              Edit
            </Button>
          )}
          {canEdit('editingNotes') && activeEdits.editingNotes && (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => handleEditToggle('editingNotes')}>
                <X className="h-3.5 w-3.5 mr-1" />
                Cancel
              </Button>
              <Button variant="default" size="sm" onClick={() => handleSaveNotes('editingNotes')}>
                <Save className="h-3.5 w-3.5 mr-1" />
                Save
              </Button>
            </div>
          )}
        </div>
        <Textarea 
          placeholder="No editing notes available" 
          value={activeEdits.editingNotes ? editableNotes.editingNotes : getNotes('editingNotes')}
          onChange={(e) => handleNoteChange(e, 'editingNotes')}
          readOnly={!activeEdits.editingNotes}
          className="resize-none min-h-[100px]"
        />
      </div>
    </div>
  );
}
