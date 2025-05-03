
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PenLine, Save, X } from "lucide-react";
import { ShootData } from '@/types/shoots';
import { useShoots } from '@/context/ShootsContext';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/auth/AuthProvider';

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
  const { user } = useAuth();
  
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
    if (shoot) {
      console.log("Notes from shoot:", shoot.notes);
      setEditableNotes({
        shootNotes: getNotes('shootNotes'),
        photographerNotes: getNotes('photographerNotes'),
        companyNotes: getNotes('companyNotes'),
        editingNotes: getNotes('editingNotes')
      });
    }
  }, [shoot]);

  // Helper function to safely get notes based on type
  function getNotes(key: string): string {
    if (!shoot.notes) return '';
    if (typeof shoot.notes === 'string') return shoot.notes;
    
    const notes = shoot.notes[key as keyof typeof shoot.notes];
    return notes ? String(notes) : '';
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
  
  async function handleSaveNotes(noteType: string) {
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
    
    try {
      // Save to database
      await updateShoot(shoot.id, { notes: updatedNotes });
      
      // Exit edit mode
      setActiveEdits(prev => ({
        ...prev,
        [noteType]: false
      }));
      
      toast({
        title: "Note saved",
        description: "Your changes have been saved successfully",
      });
    } catch (error) {
      console.error("Error saving note:", error);
      toast({
        title: "Error saving note",
        description: "There was a problem saving your changes",
        variant: "destructive"
      });
    }
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

  // Function to display the current note value, respecting the edit state
  function displayNoteValue(noteType: string): string {
    if (activeEdits[noteType as keyof typeof activeEdits]) {
      return editableNotes[noteType as keyof typeof editableNotes];
    }
    
    return getNotes(noteType);
  }

  // Helper functions for styled notes with updated colors to match dashboard
  const getNoteBackgroundClass = (noteType: string) => {
    switch (noteType) {
      case 'photographerNotes': 
        return 'bg-blue-50/60 dark:bg-blue-900/10';
      case 'editingNotes': 
        return 'bg-purple-50/60 dark:bg-purple-900/10';
      case 'companyNotes': 
        return 'bg-amber-50/60 dark:bg-amber-900/10';
      case 'shootNotes': 
      default:
        return 'bg-green-50/60 dark:bg-green-900/10';
    }
  };
  
  const getNoteTextClass = (noteType: string) => {
    switch (noteType) {
      case 'photographerNotes': 
        return 'text-blue-800 dark:text-blue-300';
      case 'editingNotes': 
        return 'text-purple-800 dark:text-purple-300';
      case 'companyNotes': 
        return 'text-amber-800 dark:text-amber-300';
      case 'shootNotes': 
      default:
        return 'text-green-800 dark:text-green-300';
    }
  };
  
  const getNoteBorderClass = (noteType: string) => {
    switch (noteType) {
      case 'photographerNotes': 
        return 'border-blue-200 dark:border-blue-700';
      case 'editingNotes': 
        return 'border-purple-200 dark:border-purple-700';
      case 'companyNotes': 
        return 'border-amber-200 dark:border-amber-700';
      case 'shootNotes': 
      default:
        return 'border-green-200 dark:border-green-700';
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-green-700 dark:text-green-400">Shoot Notes</h3>
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
          value={displayNoteValue('shootNotes')}
          onChange={(e) => handleNoteChange(e, 'shootNotes')}
          readOnly={!activeEdits.shootNotes}
          className={`resize-none min-h-[100px] ${getNoteBackgroundClass('shootNotes')} ${getNoteTextClass('shootNotes')} border-2 ${getNoteBorderClass('shootNotes')} focus:ring-green-500/40`}
          style={{
            boxShadow: "inset 0 1px 3px rgba(0,0,0,0.04)",
            transition: "all 0.2s ease"
          }}
        />
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-blue-700 dark:text-blue-400">Photographer Notes</h3>
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
          value={displayNoteValue('photographerNotes')}
          onChange={(e) => handleNoteChange(e, 'photographerNotes')}
          readOnly={!activeEdits.photographerNotes}
          className={`resize-none min-h-[100px] ${getNoteBackgroundClass('photographerNotes')} ${getNoteTextClass('photographerNotes')} border-2 ${getNoteBorderClass('photographerNotes')} focus:ring-blue-500/40`}
          style={{
            boxShadow: "inset 0 1px 3px rgba(0,0,0,0.04)",
            transition: "all 0.2s ease"
          }}
        />
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-amber-700 dark:text-amber-400">Company Notes</h3>
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
          value={displayNoteValue('companyNotes')}
          onChange={(e) => handleNoteChange(e, 'companyNotes')}
          readOnly={!activeEdits.companyNotes}
          className={`resize-none min-h-[100px] ${getNoteBackgroundClass('companyNotes')} ${getNoteTextClass('companyNotes')} border-2 ${getNoteBorderClass('companyNotes')} focus:ring-amber-500/40`}
          style={{
            boxShadow: "inset 0 1px 3px rgba(0,0,0,0.04)",
            transition: "all 0.2s ease"
          }}
        />
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-purple-700 dark:text-purple-400">Editing Notes</h3>
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
          value={displayNoteValue('editingNotes')}
          onChange={(e) => handleNoteChange(e, 'editingNotes')}
          readOnly={!activeEdits.editingNotes}
          className={`resize-none min-h-[100px] ${getNoteBackgroundClass('editingNotes')} ${getNoteTextClass('editingNotes')} border-2 ${getNoteBorderClass('editingNotes')} focus:ring-purple-500/40`}
          style={{
            boxShadow: "inset 0 1px 3px rgba(0,0,0,0.04)",
            transition: "all 0.2s ease"
          }}
        />
      </div>
    </div>
  );
}
