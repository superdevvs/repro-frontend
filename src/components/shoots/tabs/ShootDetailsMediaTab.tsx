import React, { useState, useEffect, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Upload, 
  Download,
  Image as ImageIcon,
  FileIcon,
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { ShootData } from '@/types/shoots';
import { useToast } from '@/hooks/use-toast';
import { API_BASE_URL } from '@/config/env';
import { FileUploader } from '@/components/media/FileUploader';
import { useAuth } from '@/components/auth/AuthProvider';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface ShootDetailsMediaTabProps {
  shoot: ShootData;
  isAdmin: boolean;
  isPhotographer: boolean;
  isEditor: boolean;
  isClient: boolean;
  role: string;
  onShootUpdate: () => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

interface MediaFile {
  id: string;
  filename: string;
  url?: string;
  path?: string;
  fileType?: string;
  workflowStage?: string;
  isExtra?: boolean;
  // Image size URLs from backend
  thumb?: string;
  medium?: string;
  large?: string;
  original?: string;
  // Size info
  width?: number;
  height?: number;
  fileSize?: number;
}

export function ShootDetailsMediaTab({
  shoot,
  isAdmin,
  isPhotographer,
  isEditor,
  isClient,
  role,
  onShootUpdate,
  isExpanded = false,
  onToggleExpand,
}: ShootDetailsMediaTabProps) {
  const { toast } = useToast();
  const [activeSubTab, setActiveSubTab] = useState<'uploaded' | 'edited' | 'upload'>('uploaded');
  const [displayTab, setDisplayTab] = useState<'uploaded' | 'edited'>('uploaded');
  const [rawFiles, setRawFiles] = useState<MediaFile[]>([]);
  const [editedFiles, setEditedFiles] = useState<MediaFile[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [viewerFiles, setViewerFiles] = useState<MediaFile[]>([]);
  const [downloading, setDownloading] = useState(false);

  // Load files
  useEffect(() => {
    if (!shoot.id) return;
    
    const loadFiles = async () => {
      try {
        const token = localStorage.getItem('authToken') || localStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/api/shoots/${shoot.id}/files`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });
        
        if (res.ok) {
          const json = await res.json();
          const files: MediaFile[] = (json.data || json || []).map((f: any) => ({
            id: String(f.id),
            filename: f.filename || f.stored_filename,
            url: f.url || f.path,
            fileType: f.file_type || f.fileType,
            workflowStage: f.workflow_stage || f.workflowStage,
            isExtra: f.is_extra || false,
            // Image sizes from backend
            thumb: f.thumb_url || f.thumb,
            medium: f.medium_url || f.medium,
            large: f.large_url || f.large,
            original: f.original_url || f.original || f.url || f.path,
            width: f.width,
            height: f.height,
            fileSize: f.file_size || f.fileSize,
          }));
          
          // Separate RAW (uploaded) and edited files
          setRawFiles(files.filter(f => 
            f.workflowStage === 'todo' || 
            (f.url || '').toLowerCase().includes('todo') ||
            (f.path || '').toLowerCase().includes('todo')
          ));
          
          setEditedFiles(files.filter(f => 
            f.workflowStage === 'completed' || 
            f.workflowStage === 'verified' ||
            (f.url || '').toLowerCase().includes('completed') ||
            (f.path || '').toLowerCase().includes('completed')
          ));
        }
      } catch (error) {
        console.error('Error loading files:', error);
      }
    };
    
    loadFiles();
  }, [shoot.id, onShootUpdate]);

  // Determine which tabs to show
  const showUploadTab = isAdmin || isPhotographer || isEditor;
  const canDownload = isAdmin || isClient || isEditor;

  // Get image URL with fallback chain
  const getImageUrl = (file: MediaFile, size: 'thumb' | 'medium' | 'large' | 'original' = 'medium'): string => {
    const baseUrl = API_BASE_URL;
    
    // Try size-specific URL first
    const sizeUrl = file[size];
    if (sizeUrl) {
      if (/^https?:\/\//i.test(sizeUrl)) return sizeUrl;
      if (sizeUrl.startsWith('/')) return `${baseUrl}${sizeUrl}`;
      return `${baseUrl}/${sizeUrl}`;
    }
    
    // Fallback to original
    if (file.original) {
      if (/^https?:\/\//i.test(file.original)) return file.original;
      if (file.original.startsWith('/')) return `${baseUrl}${file.original}`;
      return `${baseUrl}/${file.original}`;
    }
    
    // Final fallback
    if (file.url) {
      if (/^https?:\/\//i.test(file.url)) return file.url;
      if (file.url.startsWith('/')) return `${baseUrl}${file.url}`;
      return `${baseUrl}/${file.url}`;
    }
    
    if (file.path) {
      const clean = file.path.replace(/^\/+/, '');
      return `${baseUrl}/${clean}`;
    }
    
    return '';
  };

  // Generate srcSet for responsive images
  const getSrcSet = (file: MediaFile): string => {
    const sizes = [];
    if (file.thumb) sizes.push(`${getImageUrl(file, 'thumb')} 300w`);
    if (file.medium) sizes.push(`${getImageUrl(file, 'medium')} 800w`);
    if (file.large) sizes.push(`${getImageUrl(file, 'large')} 1800w`);
    return sizes.join(', ');
  };

  // Check if file is image
  const isImage = (file: MediaFile): boolean => {
    if (file.fileType?.startsWith('image/')) return true;
    const name = file.filename.toLowerCase();
    return /\.(jpg|jpeg|png|gif|webp|tiff|tif|heic|heif)$/.test(name);
  };

  // Open viewer
  const openViewer = (index: number, files: MediaFile[]) => {
    setViewerIndex(index);
    setViewerFiles(files);
    setViewerOpen(true);
  };

  // Toggle file selection
  const toggleSelection = (fileId: string) => {
    const newSelected = new Set(selectedFiles);
    if (newSelected.has(fileId)) {
      newSelected.delete(fileId);
    } else {
      newSelected.add(fileId);
    }
    setSelectedFiles(newSelected);
  };

  // Download selected files
  const handleDownload = async (size: 'original' | 'small') => {
    if (selectedFiles.size === 0) {
      toast({
        title: 'No files selected',
        description: 'Please select files to download',
        variant: 'destructive',
      });
      return;
    }

    setDownloading(true);
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const fileIds = Array.from(selectedFiles);
      
      // Request download from backend
      const res = await fetch(`${API_BASE_URL}/api/shoots/${shoot.id}/files/download`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          file_ids: fileIds,
          size: size === 'small' ? 'small' : 'original', // small = 1800x1200, original = full size
        }),
      });

      if (!res.ok) throw new Error('Download failed');

      // Get download URL or blob
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `shoot-${shoot.id}-${size === 'small' ? 'small' : 'full'}-${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: 'Download started',
        description: `Downloading ${selectedFiles.size} file(s) as ${size === 'small' ? 'small (1800x1200)' : 'full size'}`,
      });

      setSelectedFiles(new Set());
    } catch (error) {
      toast({
        title: 'Download failed',
        description: 'Failed to download files',
        variant: 'destructive',
      });
    } finally {
      setDownloading(false);
    }
  };

  // Get current files based on active tab
  const currentFiles = activeSubTab === 'uploaded' ? rawFiles : editedFiles;

  // Edited Upload Section Component (for Editors)
  const EditedUploadSection = ({ shoot, onUploadComplete }: { shoot: ShootData; onUploadComplete: () => void }) => {
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [editingNotes, setEditingNotes] = useState('');
    const [showChecklistDialog, setShowChecklistDialog] = useState(false);
    const [showNotesDialog, setShowNotesDialog] = useState(false);
    const [checklistItems, setChecklistItems] = useState<Record<string, boolean>>({
      'interior_exposure': false,
      'interior_white_balance': false,
      'window_pulling': false,
      'straight_lines': false,
      'exterior_exposure': false,
      'exterior_clarity': false,
      'sky_replacement': false,
      'natural_shadows': false,
    });

    const checklistLabels: Record<string, string> = {
      'interior_exposure': 'Interior: Exposure balanced - room appears well-lit and inviting',
      'interior_white_balance': 'Interior: White balance corrected - neutral tones (no yellow or blue tint)',
      'window_pulling': 'Interior: Window pulling done perfectly - clear exterior view without halos or harsh edges, natural exposure',
      'straight_lines': 'Interior: Vertical and horizontal lines straightened - lens distortion corrected if needed',
      'exterior_exposure': 'Exterior: Proper exposure ensured',
      'exterior_clarity': 'Exterior: Clarity maintained',
      'sky_replacement': 'Exterior: Sky replacement (if needed) - natural blue sky, not overly saturated',
      'natural_shadows': 'Exterior: Natural shadows and lighting direction maintained',
    };

    const editingGuidelines = [
      {
        title: 'General Editing Requirements',
        items: [
          'Maintain a clean, natural, realistic editing style',
          'Avoid over-editing — images should look bright, clean, and true to life',
        ],
      },
    ];

    const allChecked = Object.values(checklistItems).every(v => v);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      setUploadedFiles(prev => [...prev, ...files]);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files || []);
      setUploadedFiles(prev => [...prev, ...files]);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
    };

    const handleSubmitEdits = async () => {
      if (uploadedFiles.length === 0) {
        toast({
          title: 'No files',
          description: 'Please select files to upload',
          variant: 'destructive',
        });
        return;
      }

      // Show checklist dialog first
      setShowChecklistDialog(true);
    };

    const handleChecklistComplete = () => {
      if (!allChecked) {
        toast({
          title: 'Checklist incomplete',
          description: 'Please complete all checklist items before submitting',
          variant: 'destructive',
        });
        return;
      }
      setShowChecklistDialog(false);
      setShowNotesDialog(true);
    };

    const handleConfirmSubmit = async () => {
      setShowNotesDialog(false);
      setUploading(true);
      try {
        const formData = new FormData();
        uploadedFiles.forEach((file) => {
          formData.append('files[]', file);
        });
        formData.append('upload_type', 'edited');
        if (editingNotes.trim()) {
          formData.append('editing_notes', editingNotes.trim());
        }
        formData.append('checklist', JSON.stringify(checklistItems));

        const token = localStorage.getItem('authToken') || localStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/api/shoots/${shoot.id}/files/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        if (!res.ok) throw new Error('Upload failed');

        // Update shoot status to 'in_review'
        try {
          await fetch(`${API_BASE_URL}/api/shoots/${shoot.id}`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify({ status: 'in_review', workflowStatus: 'in_review' }),
          });
        } catch (statusError) {
          console.error('Failed to update status:', statusError);
        }

        toast({
          title: 'Success',
          description: 'Edited files uploaded successfully',
        });
        setUploadedFiles([]);
        setEditingNotes('');
        setChecklistItems(Object.fromEntries(Object.keys(checklistItems).map(k => [k, false])));
        onUploadComplete();
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to upload files',
          variant: 'destructive',
        });
      } finally {
        setUploading(false);
      }
    };

    return (
      <div className="space-y-4">
        {/* Drag and Drop Upload Area */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
        >
          <input
            type="file"
            multiple
            accept="image/jpeg,image/jpg,image/png,image/tiff,image/tif,video/mp4,video/mov"
            onChange={handleFileSelect}
            className="hidden"
            id="edited-file-upload"
          />
          <label htmlFor="edited-file-upload" className="cursor-pointer">
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <div className="text-sm font-medium">Drag and drop edited files here</div>
            <div className="text-xs text-muted-foreground mt-1">or click to browse</div>
          </label>
        </div>

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium">Uploaded Files ({uploadedFiles.length})</div>
            <div className="max-h-48 overflow-y-auto space-y-1 border rounded p-2">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 hover:bg-muted rounded">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-xs truncate">{file.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => {
                      setUploadedFiles(prev => prev.filter((_, i) => i !== index));
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button
          onClick={handleSubmitEdits}
          disabled={uploading || uploadedFiles.length === 0}
          className="w-full"
        >
          {uploading ? 'Uploading...' : 'Submit Edits for Review'}
        </Button>

        {/* Checklist Dialog */}
        <Dialog open={showChecklistDialog} onOpenChange={setShowChecklistDialog}>
          <DialogContent className="max-w-3xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Pre-Upload Checklist & Guidelines</DialogTitle>
              <DialogDescription>
                Review the guidelines and confirm all checklist items are completed before submitting edited files.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4 max-h-[70vh] overflow-y-auto">
              {/* Editing Guidelines Section (Read-only) */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <span className="text-base font-semibold">📌 Editing Guidelines</span>
                  <Badge variant="outline" className="text-xs">Reference Only</Badge>
                </div>
                
                {editingGuidelines.map((section, idx) => (
                  <div key={idx} className="space-y-2 pl-4">
                    <div className="font-medium text-sm text-muted-foreground">{section.title}</div>
                    <ul className="space-y-1.5 pl-4">
                      {section.items.map((item, itemIdx) => (
                        <li key={itemIdx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-muted-foreground/60 mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                {/* Interior Editing Guidelines */}
                <div className="space-y-2 pl-4 pt-2">
                  <div className="font-medium text-sm text-muted-foreground">📌 Interior Editing</div>
                  <ul className="space-y-1.5 pl-4">
                    <li className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-muted-foreground/60 mt-1">•</span>
                      <span>Window Pulling: Please do perfect window pulls - clear and visible exterior view without halos or harsh edges. Make sure exposure looks natural and not overly dark or artificial.</span>
                    </li>
                    <li className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-muted-foreground/60 mt-1">•</span>
                      <span>Straight Lines / Perspective: Vertical and horizontal lines should be straight. Correct lens distortion if needed.</span>
                    </li>
                  </ul>
                </div>

                {/* Exterior Editing Guidelines */}
                <div className="space-y-2 pl-4 pt-2">
                  <div className="font-medium text-sm text-muted-foreground">📌 Exterior Editing</div>
                  <ul className="space-y-1.5 pl-4">
                    <li className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-muted-foreground/60 mt-1">•</span>
                      <span>Sky Replacement (if needed): Use an attractive blue sky that looks natural. No dramatic or overly saturated skies. Maintain natural shadows and lighting direction.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t pt-4">
                <div className="flex items-center gap-2 pb-3">
                  <span className="text-base font-semibold">✓ Checklist Items</span>
                  <Badge variant="default" className="text-xs">
                    {Object.values(checklistItems).filter(v => v).length} / {Object.keys(checklistItems).length} completed
                  </Badge>
                </div>
              </div>

              {/* Checklist Items Section */}
              <div className="space-y-2">
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground px-2">Interior Editing</div>
                  {['interior_exposure', 'interior_white_balance', 'window_pulling', 'straight_lines'].map((key) => (
                    <div key={key} className="flex items-start space-x-3 p-2.5 hover:bg-muted/50 rounded border border-transparent hover:border-border transition-colors">
                      <Checkbox
                        checked={checklistItems[key]}
                        onCheckedChange={(checked) => {
                          setChecklistItems(prev => ({ ...prev, [key]: checked as boolean }));
                        }}
                        id={`checklist-${key}`}
                        className="mt-0.5"
                      />
                      <label htmlFor={`checklist-${key}`} className="text-sm cursor-pointer flex-1 leading-relaxed">
                        {checklistLabels[key]}
                      </label>
                    </div>
                  ))}
                </div>

                <div className="space-y-1 pt-2">
                  <div className="text-sm font-medium text-muted-foreground px-2">Exterior Editing</div>
                  {['exterior_exposure', 'exterior_clarity', 'sky_replacement', 'natural_shadows'].map((key) => (
                    <div key={key} className="flex items-start space-x-3 p-2.5 hover:bg-muted/50 rounded border border-transparent hover:border-border transition-colors">
                      <Checkbox
                        checked={checklistItems[key]}
                        onCheckedChange={(checked) => {
                          setChecklistItems(prev => ({ ...prev, [key]: checked as boolean }));
                        }}
                        id={`checklist-${key}`}
                        className="mt-0.5"
                      />
                      <label htmlFor={`checklist-${key}`} className="text-sm cursor-pointer flex-1 leading-relaxed">
                        {checklistLabels[key]}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowChecklistDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleChecklistComplete} disabled={!allChecked}>
                Continue ({Object.values(checklistItems).filter(v => v).length}/{Object.keys(checklistItems).length})
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Editing Notes Dialog */}
        <Dialog open={showNotesDialog} onOpenChange={setShowNotesDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Editing Notes (Optional)</DialogTitle>
              <DialogDescription>
                Add any notes about the editing process.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Notes</label>
                <textarea
                  value={editingNotes}
                  onChange={(e) => setEditingNotes(e.target.value)}
                  placeholder="Add any notes about the editing..."
                  className="w-full min-h-[100px] p-2 border rounded-md text-sm"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowNotesDialog(false)}>
                  Skip
                </Button>
                <Button onClick={handleConfirmSubmit} disabled={uploading}>
                  Submit Edits
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  };

  // Raw Upload Section Component
  const RawUploadSection = ({ shoot, onUploadComplete }: { shoot: ShootData; onUploadComplete: () => void }) => {
    const [bracketType, setBracketType] = useState<'3-bracket' | '5-bracket'>('3-bracket');
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [extraFiles, setExtraFiles] = useState<Set<string>>(new Set());
    const [editingNotes, setEditingNotes] = useState('');
    const [showNotesDialog, setShowNotesDialog] = useState(false);

    const expectedPhotos = shoot.package?.expectedDeliveredCount || 0;
    const bracketMultiplier = bracketType === '3-bracket' ? 3 : 5;
    const expectedRawCount = expectedPhotos * bracketMultiplier;
    const uploadedCount = uploadedFiles.length;
    const equivalentFinalPhotos = Math.floor(uploadedCount / bracketMultiplier);
    const isShort = uploadedCount < expectedRawCount;

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      setUploadedFiles(prev => [...prev, ...files]);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files || []);
      setUploadedFiles(prev => [...prev, ...files]);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
    };

    const toggleExtra = (index: number) => {
      setExtraFiles(prev => {
        const newSet = new Set(prev);
        const fileId = String(index);
        if (newSet.has(fileId)) {
          newSet.delete(fileId);
        } else {
          newSet.add(fileId);
        }
        return newSet;
      });
    };

    const handleSubmitRAW = async () => {
      if (uploadedFiles.length === 0) {
        toast({
          title: 'No files',
          description: 'Please select files to upload',
          variant: 'destructive',
        });
        return;
      }

      // Show notes dialog before submitting
      setShowNotesDialog(true);
    };

    const handleConfirmSubmit = async () => {
      setShowNotesDialog(false);
      setUploading(true);
      try {
        const formData = new FormData();
        uploadedFiles.forEach((file, index) => {
          formData.append('files[]', file);
        });
        formData.append('bracket_type', bracketType);
        formData.append('upload_type', 'raw');
        if (extraFiles.size > 0) {
          formData.append('extra_indices', JSON.stringify(Array.from(extraFiles)));
        }
        if (editingNotes.trim()) {
          formData.append('photographer_notes', editingNotes.trim());
        }

        const token = localStorage.getItem('authToken') || localStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/api/shoots/${shoot.id}/files/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        if (!res.ok) throw new Error('Upload failed');

        // Update shoot status to 'raw_uploaded'
        try {
          await fetch(`${API_BASE_URL}/api/shoots/${shoot.id}`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify({ status: 'raw_uploaded', workflowStatus: 'raw_uploaded' }),
          });
        } catch (statusError) {
          console.error('Failed to update status:', statusError);
        }

        toast({
          title: 'Success',
          description: 'RAW files uploaded successfully',
        });
        setUploadedFiles([]);
        setExtraFiles(new Set());
        setEditingNotes('');
        onUploadComplete();
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to upload files',
          variant: 'destructive',
        });
      } finally {
        setUploading(false);
      }
    };

    return (
      <div className="space-y-4">
        {/* Bracket Type Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Bracket Type</label>
          <RadioGroup value={bracketType} onValueChange={(v) => setBracketType(v as '3-bracket' | '5-bracket')}>
            <div className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="3-bracket" id="3-bracket" />
                <label htmlFor="3-bracket" className="text-sm cursor-pointer">3-Bracket</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="5-bracket" id="5-bracket" />
                <label htmlFor="5-bracket" className="text-sm cursor-pointer">5-Bracket</label>
              </div>
            </div>
          </RadioGroup>
        </div>

        {/* Counters */}
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="p-2 border rounded bg-muted/50">
            <div className="text-muted-foreground">Expected RAW</div>
            <div className="font-semibold text-base">{expectedRawCount}</div>
          </div>
          <div className="p-2 border rounded bg-muted/50">
            <div className="text-muted-foreground">Uploaded</div>
            <div className="font-semibold text-base">{uploadedCount}</div>
          </div>
          <div className="p-2 border rounded bg-muted/50">
            <div className="text-muted-foreground">Equivalent Final</div>
            <div className="font-semibold text-base">{equivalentFinalPhotos}</div>
          </div>
        </div>

        {/* Drag and Drop Upload Area */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
        >
          <input
            type="file"
            multiple
            accept="image/*,video/*,.raw,.cr2,.nef,.arw,.dng"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <div className="text-sm font-medium">Drag and drop files here</div>
            <div className="text-xs text-muted-foreground mt-1">or click to browse</div>
          </label>
        </div>

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium">Uploaded Files ({uploadedFiles.length})</div>
            <div className="max-h-48 overflow-y-auto space-y-1 border rounded p-2">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 hover:bg-muted rounded">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Checkbox
                      checked={extraFiles.has(String(index))}
                      onCheckedChange={() => toggleExtra(index)}
                      id={`extra-${index}`}
                    />
                    <label htmlFor={`extra-${index}`} className="text-xs cursor-pointer flex-1 truncate">
                      {file.name}
                    </label>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => {
                      setUploadedFiles(prev => prev.filter((_, i) => i !== index));
                      setExtraFiles(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(String(index));
                        return newSet;
                      });
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
            {extraFiles.size > 0 && (
              <div className="text-xs text-muted-foreground">
                {extraFiles.size} file(s) marked as extras
              </div>
            )}
          </div>
        )}

        {/* Warning if short */}
        {isShort && uploadedCount > 0 && (
          <Alert variant="destructive">
            <AlertDescription>
              Warning: You have uploaded {uploadedCount} files, but {expectedRawCount} are expected for {expectedPhotos} final photos with {bracketType}. {expectedRawCount - uploadedCount} photos are missing.
            </AlertDescription>
          </Alert>
        )}

        {/* Extras Section - Show below main uploads */}
        {extraFiles.size > 0 && uploadedFiles.length > 0 && (
          <div className="space-y-2 border-t pt-4">
            <div className="text-sm font-medium text-muted-foreground">Extras ({extraFiles.size})</div>
            <div className="max-h-32 overflow-y-auto space-y-1 border rounded p-2 bg-muted/30">
              {Array.from(extraFiles).map((fileId) => {
                const index = parseInt(fileId);
                const file = uploadedFiles[index];
                if (!file) return null;
                return (
                  <div key={index} className="flex items-center justify-between p-1.5 text-xs">
                    <span className="truncate flex-1">{file.name}</span>
                    <Badge variant="secondary" className="text-[10px]">Extra</Badge>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button
          onClick={handleSubmitRAW}
          disabled={uploading || uploadedFiles.length === 0}
          className="w-full"
        >
          {uploading ? 'Uploading...' : 'Submit RAW'}
        </Button>

        {/* Editing Notes Dialog */}
        <Dialog open={showNotesDialog} onOpenChange={setShowNotesDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Editing Notes (Optional)</DialogTitle>
              <DialogDescription>
                Add any notes for the editor before submitting RAW files.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Notes</label>
                <textarea
                  value={editingNotes}
                  onChange={(e) => setEditingNotes(e.target.value)}
                  placeholder="Add any notes for the editor..."
                  className="w-full min-h-[100px] p-2 border rounded-md text-sm"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowNotesDialog(false)}>
                  Skip
                </Button>
                <Button onClick={handleConfirmSubmit} disabled={uploading}>
                  Submit RAW
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header - Tabs with Upload button inline on desktop, expand/collapse button */}
      <div className="mb-1.5 pb-1 border-b flex-shrink-0">
        <div className="flex items-center justify-between gap-2">
          <Tabs value={activeSubTab === 'upload' ? 'uploaded' : (activeSubTab === 'uploaded' || activeSubTab === 'edited' ? activeSubTab : 'uploaded')} onValueChange={(v) => {
            if (v === 'media' || v === 'uploaded') {
              setActiveSubTab('uploaded');
            } else if (v === 'edited') {
              setActiveSubTab('edited');
            }
          }} className="flex-1 min-w-0">
            <TabsList className="w-full justify-start h-7 sm:h-8 bg-transparent p-0 min-w-max sm:min-w-0">
              <TabsTrigger 
                value="media" 
                className="text-[11px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 h-7 sm:h-8 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:rounded-none whitespace-nowrap"
                onClick={() => setActiveSubTab('uploaded')}
              >
                Media
              </TabsTrigger>
              <TabsTrigger 
                value="uploaded" 
                className="text-[11px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 h-7 sm:h-8 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:rounded-none whitespace-nowrap"
                onClick={() => setActiveSubTab('uploaded')}
              >
                Uploaded ({rawFiles.length})
              </TabsTrigger>
              <TabsTrigger 
                value="edited" 
                className="text-[11px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 h-7 sm:h-8 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:rounded-none whitespace-nowrap"
                onClick={() => setActiveSubTab('edited')}
              >
                Edited ({editedFiles.length})
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          {/* Upload and Download buttons - Inline on desktop, below on mobile */}
          <div className="hidden sm:flex items-center gap-1.5 flex-shrink-0">
            {/* Download button for selected files */}
            {canDownload && selectedFiles.size > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" className="h-7 text-[11px] px-2" disabled={downloading}>
                    <Download className="h-3 w-3 mr-1" />
                    <span>Download ({selectedFiles.size})</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleDownload('original')}>
                    <Download className="h-4 w-4 mr-2" />
                    <div>
                      <div className="font-medium text-sm">Full Size</div>
                      <div className="text-xs text-muted-foreground">Original resolution</div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDownload('small')}>
                    <Download className="h-4 w-4 mr-2" />
                    <div>
                      <div className="font-medium text-sm">Small Size</div>
                      <div className="text-xs text-muted-foreground">1800x1200px (optimized)</div>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {/* Upload button - Inline on desktop */}
            {showUploadTab && (
              <Button
                variant="default"
                size="sm"
                className="h-7 text-[11px] px-3 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => setActiveSubTab('upload')}
              >
                <Upload className="h-3 w-3 mr-1" />
                <span>Upload</span>
              </Button>
            )}
          </div>
          
          {/* Expand/Collapse Button - Mobile only, on extreme right */}
          {onToggleExpand && (
            <button
              onClick={onToggleExpand}
              className="sm:hidden flex items-center justify-center h-7 w-7 rounded hover:bg-muted/50 transition-colors flex-shrink-0"
              aria-label={isExpanded ? 'Collapse media' : 'Expand media'}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          )}
        </div>
      </div>
      
      {/* Upload and Download buttons - Below tabs on mobile only */}
      {(showUploadTab || (canDownload && selectedFiles.size > 0)) && (
        <div className="mb-1.5 pb-1 border-b flex-shrink-0 sm:hidden">
          <div className="flex items-center justify-end gap-1.5">
            {/* Download button for selected files */}
            {canDownload && selectedFiles.size > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" className="h-7 text-[11px] px-2 w-full" disabled={downloading}>
                    <Download className="h-3 w-3 mr-1" />
                    <span>Download</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleDownload('original')}>
                    <Download className="h-4 w-4 mr-2" />
                    <div>
                      <div className="font-medium text-sm">Full Size</div>
                      <div className="text-xs text-muted-foreground">Original resolution</div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDownload('small')}>
                    <Download className="h-4 w-4 mr-2" />
                    <div>
                      <div className="font-medium text-sm">Small Size</div>
                      <div className="text-xs text-muted-foreground">1800x1200px (optimized)</div>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {/* Upload button - Full width on mobile */}
            {showUploadTab && (
              <Button
                variant="default"
                size="sm"
                className="h-7 text-[11px] px-3 bg-blue-600 hover:bg-blue-700 text-white w-full"
                onClick={() => setActiveSubTab('upload')}
              >
                <Upload className="h-3 w-3 mr-1" />
                <span>Upload</span>
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Content - Compact Overview-style layout, scrollable */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
        {activeSubTab === 'upload' ? (
          /* Upload Tab Content */
          <div className="space-y-2">
            <div className="p-2.5 border rounded-lg bg-card">
              {isEditor ? (
                <EditedUploadSection
                  shoot={shoot}
                    onUploadComplete={() => {
                      toast({
                        title: 'Upload complete',
                        description: 'Edited files uploaded successfully',
                      });
                      onShootUpdate();
                      setActiveSubTab('edited');
                      setDisplayTab('edited');
                    }}
                />
              ) : (
                <RawUploadSection
                  shoot={shoot}
                    onUploadComplete={() => {
                      toast({
                        title: 'Upload complete',
                        description: 'Files uploaded successfully',
                      });
                      onShootUpdate();
                      setActiveSubTab('uploaded');
                      setDisplayTab('uploaded');
                    }}
                />
              )}
            </div>
          </div>
        ) : (
          <Tabs value={displayTab} onValueChange={(v) => {
            if (v === 'media' || v === 'uploaded') {
              setActiveSubTab('uploaded');
              setDisplayTab('uploaded');
            } else if (v === 'edited') {
              setActiveSubTab('edited');
              setDisplayTab('edited');
            }
          }}>
            {/* Media/Uploaded Tab - Media tab shows uploaded content */}
            <TabsContent value="media" className="mt-0">
              {rawFiles.length === 0 ? (
                <Card className="border-2 border-dashed bg-muted/30">
                  <CardContent className="flex flex-col items-center justify-center py-16 px-6">
                    <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <ImageIcon className="h-10 w-10 text-primary/60" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No media uploaded yet</h3>
                    <p className="text-sm text-muted-foreground text-center mb-6 max-w-md">
                      Upload photos and videos to get started. You can drag and drop files or use the upload button.
                    </p>
                    {showUploadTab && (
                      <Button
                        variant="default"
                        size="lg"
                        className="bg-primary hover:bg-primary/90"
                        onClick={() => setActiveSubTab('upload')}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Files
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div className="p-2.5 border rounded-lg bg-card">
                  <MediaGrid
                    files={rawFiles}
                    onFileClick={(index) => openViewer(index, rawFiles)}
                    selectedFiles={selectedFiles}
                    onSelectionChange={toggleSelection}
                    canSelect={canDownload}
                    getImageUrl={getImageUrl}
                    getSrcSet={getSrcSet}
                    isImage={isImage}
                  />
                </div>
              )}
            </TabsContent>
            
            {/* Uploaded Media Tab */}
            <TabsContent value="uploaded" className="mt-0">
              {rawFiles.length === 0 ? (
                <Card className="border-2 border-dashed bg-muted/30">
                  <CardContent className="flex flex-col items-center justify-center py-16 px-6">
                    <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <ImageIcon className="h-10 w-10 text-primary/60" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No uploaded files yet</h3>
                    <p className="text-sm text-muted-foreground text-center mb-6 max-w-md">
                      Upload photos and videos to get started. You can drag and drop files or use the upload button.
                    </p>
                    {showUploadTab && (
                      <Button
                        variant="default"
                        size="lg"
                        className="bg-primary hover:bg-primary/90"
                        onClick={() => setActiveSubTab('upload')}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Files
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div className="p-2.5 border rounded-lg bg-card">
                  <MediaGrid
                    files={rawFiles}
                    onFileClick={(index) => openViewer(index, rawFiles)}
                    selectedFiles={selectedFiles}
                    onSelectionChange={toggleSelection}
                    canSelect={canDownload}
                    getImageUrl={getImageUrl}
                    getSrcSet={getSrcSet}
                    isImage={isImage}
                  />
                </div>
              )}
            </TabsContent>

            {/* Edited Media Tab */}
            <TabsContent value="edited" className="mt-0">
              {editedFiles.length === 0 ? (
                <Card className="border-2 border-dashed bg-muted/30">
                  <CardContent className="flex flex-col items-center justify-center py-16 px-6">
                    <div className="h-20 w-20 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
                      <ImageIcon className="h-10 w-10 text-purple-500/60" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No edited files yet</h3>
                    <p className="text-sm text-muted-foreground text-center mb-6 max-w-md">
                      Edited photos will appear here once they've been processed and uploaded.
                    </p>
                    {isEditor && (
                      <Button
                        variant="default"
                        size="lg"
                        className="bg-purple-600 hover:bg-purple-700"
                        onClick={() => setActiveSubTab('upload')}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Edited Files
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div className="p-2.5 border rounded-lg bg-card">
                  <MediaGrid
                    files={editedFiles}
                    onFileClick={(index) => openViewer(index, editedFiles)}
                    selectedFiles={selectedFiles}
                    onSelectionChange={toggleSelection}
                    canSelect={canDownload}
                    getImageUrl={getImageUrl}
                    getSrcSet={getSrcSet}
                    isImage={isImage}
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>

      {/* Image Viewer */}
      <MediaViewer
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        files={viewerFiles}
        currentIndex={viewerIndex}
        onIndexChange={setViewerIndex}
        getImageUrl={getImageUrl}
        getSrcSet={getSrcSet}
        shoot={shoot}
        isAdmin={isAdmin}
        onShootUpdate={onShootUpdate}
      />
    </div>
  );
}

// Media Grid Component
interface MediaGridProps {
  files: MediaFile[];
  onFileClick: (index: number) => void;
  selectedFiles: Set<string>;
  onSelectionChange: (fileId: string) => void;
  canSelect: boolean;
  getImageUrl: (file: MediaFile, size?: 'thumb' | 'medium' | 'large' | 'original') => string;
  getSrcSet: (file: MediaFile) => string;
  isImage: (file: MediaFile) => boolean;
}

function MediaGrid({ 
  files, 
  onFileClick, 
  selectedFiles, 
  onSelectionChange, 
  canSelect,
  getImageUrl,
  getSrcSet,
  isImage,
}: MediaGridProps) {
  return (
    <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-8 gap-1">
      {files.map((file, index) => {
        const isSelected = selectedFiles.has(file.id);
        const isImg = isImage(file);
        const imageUrl = getImageUrl(file, 'medium');
        const srcSet = getSrcSet(file);
        
        return (
          <div
            key={file.id}
            className={`relative aspect-square rounded overflow-hidden border cursor-pointer transition-all group ${
              isSelected ? 'border-primary ring-1 ring-primary' : 'border-border hover:border-primary/50'
            }`}
            onClick={() => {
              if (canSelect) {
                onSelectionChange(file.id);
              } else {
                onFileClick(index);
              }
            }}
            onDoubleClick={() => onFileClick(index)}
          >
            {isImg && imageUrl ? (
              <img
                src={getImageUrl(file, 'thumb')}
                srcSet={srcSet}
                sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, 20vw"
                alt={file.filename}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <FileIcon className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
            
            {isSelected && (
              <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-0.5">
                <CheckCircle2 className="h-3 w-3" />
              </div>
            )}
            
            {canSelect && (
              <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => onSelectionChange(file.id)}
                  className="bg-background/80"
                />
              </div>
            )}
            
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] p-1 truncate opacity-0 group-hover:opacity-100 transition-opacity">
              {file.filename}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Media Viewer Component
interface MediaViewerProps {
  isOpen: boolean;
  onClose: () => void;
  files: MediaFile[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  getImageUrl: (file: MediaFile, size?: 'thumb' | 'medium' | 'large' | 'original') => string;
  getSrcSet: (file: MediaFile) => string;
  shoot?: ShootData;
  isAdmin?: boolean;
  onShootUpdate?: () => void;
}

function MediaViewer({ 
  isOpen, 
  onClose, 
  files, 
  currentIndex, 
  onIndexChange,
  getImageUrl,
  getSrcSet,
  shoot,
  isAdmin = false,
  onShootUpdate,
}: MediaViewerProps) {
  const { toast } = useToast();
  
  const isImageFile = (file: MediaFile): boolean => {
    if (file.fileType?.startsWith('image/')) return true;
    const name = file.filename.toLowerCase();
    return /\.(jpg|jpeg|png|gif|webp|tiff|tif|heic|heif)$/.test(name);
  };
  const [zoom, setZoom] = useState(1);
  const [showFlagDialog, setShowFlagDialog] = useState(false);
  const [flagReason, setFlagReason] = useState('');
  const [flagging, setFlagging] = useState(false);
  const currentFile = files[currentIndex];

  const handleFlagImage = async () => {
    if (!shoot || !currentFile || !flagReason.trim()) return;
    
    setFlagging(true);
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      // Create an issue linked to this media file
      const res = await fetch(`${API_BASE_URL}/api/shoots/${shoot.id}/issues`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          note: flagReason.trim(),
          mediaId: currentFile.id,
          assignedToRole: 'editor', // Auto-assign to editor for image corrections
        }),
      });

      if (!res.ok) throw new Error('Failed to create issue');

      // Also flag the file if endpoint exists
      try {
        await fetch(`${API_BASE_URL}/api/shoots/${shoot.id}/files/${currentFile.id}/flag`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            reason: flagReason.trim(),
            file_id: currentFile.id,
          }),
        });
      } catch (flagError) {
        console.warn('File flagging endpoint not available, issue created only');
      }

      toast({
        title: 'Success',
        description: 'Issue created and image flagged successfully',
      });
      setShowFlagDialog(false);
      setFlagReason('');
      onShootUpdate?.();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to flag image and create issue',
        variant: 'destructive',
      });
    } finally {
      setFlagging(false);
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleResetZoom = () => {
    setZoom(1);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      onIndexChange(currentIndex - 1);
      setZoom(1); // Reset zoom when navigating
    }
  };

  const handleNext = () => {
    if (currentIndex < files.length - 1) {
      onIndexChange(currentIndex + 1);
      setZoom(1); // Reset zoom when navigating
    }
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        onIndexChange(currentIndex - 1);
        setZoom(1);
      } else if (e.key === 'ArrowRight' && currentIndex < files.length - 1) {
        onIndexChange(currentIndex + 1);
        setZoom(1);
      } else if (e.key === 'Escape') {
        onClose();
      } else if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        setZoom(prev => Math.min(prev + 0.25, 3));
      } else if (e.key === '-') {
        e.preventDefault();
        setZoom(prev => Math.max(prev - 0.25, 0.5));
      } else if (e.key === '0') {
        e.preventDefault();
        setZoom(1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, files.length, onClose, onIndexChange]);

  if (!isOpen || !currentFile) return null;

  const imageUrl = getImageUrl(currentFile, 'large');
  const srcSet = getSrcSet(currentFile);
  const isImg = isImageFile(currentFile);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] p-0 bg-black/95 backdrop-blur-md border-0">
        {/* Glass blur overlay background */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        
        <div className="relative flex items-center justify-center min-h-[60vh] z-10">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-20 text-white hover:bg-white/20 rounded-full"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </Button>

          {currentIndex > 0 && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 z-10 text-white hover:bg-white/20"
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
          )}

          {/* Top Metadata Bar */}
          {isImg && currentFile && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-black/60 backdrop-blur-md rounded-lg px-4 py-2 flex items-center gap-4 text-white text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium">{currentFile.filename}</span>
              </div>
              {currentFile.width && currentFile.height && (
                <div className="text-white/70">
                  {currentFile.width} × {currentFile.height}
                </div>
              )}
              {currentFile.fileSize && (
                <div className="text-white/70">
                  {(currentFile.fileSize / 1024 / 1024).toFixed(2)} MB
                </div>
              )}
              {shoot && isAdmin && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-white hover:bg-white/20"
                  onClick={() => {
                    // Make cover functionality
                    toast({ title: 'Cover Photo', description: 'Set as cover photo functionality would go here' });
                  }}
                >
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Make Cover
                </Button>
              )}
            </div>
          )}

          <div className="flex items-center justify-center p-8 overflow-auto" style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}>
            {isImg ? (
              <img
                src={imageUrl}
                srcSet={srcSet}
                sizes="90vw"
                alt={currentFile.filename}
                className="max-w-full max-h-[70vh] object-contain select-none rounded-lg shadow-2xl"
                loading="eager"
                draggable={false}
              />
            ) : (
              <div className="text-white text-center">
                <FileIcon className="h-16 w-16 mx-auto mb-4" />
                <p>{currentFile.filename}</p>
              </div>
            )}
          </div>

          {/* Zoom Controls */}
          {isImg && (
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-md rounded-lg p-1.5">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20"
                onClick={handleZoomOut}
                disabled={zoom <= 0.5}
                title="Zoom out"
              >
                <span className="text-sm">−</span>
              </Button>
              <span className="text-white text-xs min-w-[3rem] text-center font-medium">{Math.round(zoom * 100)}%</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20"
                onClick={handleZoomIn}
                disabled={zoom >= 3}
                title="Zoom in"
              >
                <span className="text-sm">+</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs text-white hover:bg-white/20"
                onClick={handleResetZoom}
                title="Reset zoom (0)"
              >
                Reset
              </Button>
            </div>
          )}

          {/* Flag Image Button (Admin only) */}
          {isAdmin && isImg && shoot && (
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-4 left-1/2 -translate-x-1/2 z-10"
              onClick={() => setShowFlagDialog(true)}
            >
              <AlertCircle className="h-4 w-4 mr-1" />
              Flag Issue
            </Button>
          )}

          {currentIndex < files.length - 1 && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 z-10 text-white hover:bg-white/20"
              onClick={handleNext}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          )}

          {/* Bottom Filmstrip */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-md text-white p-4 z-20">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="font-medium text-sm">{currentFile.filename}</div>
                <div className="text-xs text-gray-300">
                  {currentIndex + 1} of {files.length}
                </div>
              </div>
              <div className="text-xs text-gray-400">
                Use ← → arrow keys to navigate • + - to zoom • ESC to close
              </div>
            </div>
            
            {/* Filmstrip Thumbnails */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
              {files.map((file, index) => {
                    const isActive = index === currentIndex;
                    const fileImageUrl = getImageUrl(file, 'thumb');
                    const fileIsImg = isImageFile(file);
                
                return (
                  <button
                    key={file.id}
                    onClick={() => {
                      onIndexChange(index);
                      setZoom(1);
                    }}
                    className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition-all ${
                      isActive 
                        ? 'border-white ring-2 ring-white/50 scale-105' 
                        : 'border-white/30 hover:border-white/60 opacity-70 hover:opacity-100'
                    }`}
                  >
                    {fileIsImg && fileImageUrl ? (
                      <img
                        src={fileImageUrl}
                        alt={file.filename}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <FileIcon className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Flag Image Dialog */}
        {isAdmin && shoot && (
          <Dialog open={showFlagDialog} onOpenChange={setShowFlagDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Flag Image Issue</DialogTitle>
                <DialogDescription>
                  Flag this image for correction or re-editing. This will create an issue visible to the editor.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Issue Description</Label>
                  <Textarea
                    value={flagReason}
                    onChange={(e) => setFlagReason(e.target.value)}
                    placeholder="Describe what needs to be corrected..."
                    className="min-h-[100px]"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => {
                    setShowFlagDialog(false);
                    setFlagReason('');
                  }}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleFlagImage} 
                    disabled={!flagReason.trim() || flagging}
                    variant="destructive"
                  >
                    {flagging ? 'Flagging...' : 'Flag Image'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
}

