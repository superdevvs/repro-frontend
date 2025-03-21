
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';

interface ImageUploadProps {
  onChange: (url: string) => void;
  initialImage?: string;
}

export function ImageUpload({ onChange, initialImage }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(initialImage || null);
  const [isHovering, setIsHovering] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);
      
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id || 'user'}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;
      
      // Upload file to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('user-files')
        .upload(filePath, file);
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('user-files')
        .getPublicUrl(filePath);
      
      // Update preview and callback
      setPreview(publicUrl);
      onChange(publicUrl);
      
      toast({
        title: "Image uploaded",
        description: "Your profile photo has been updated",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      
      // Fallback to object URL if Supabase upload fails
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      onChange(objectUrl);
      
      toast({
        title: "Cloud upload failed",
        description: "Image saved locally only",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleClearImage = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // If the preview URL is from Supabase, try to delete the file
    if (preview && preview.includes('supabase')) {
      try {
        // Extract path from URL
        const url = new URL(preview);
        const path = url.pathname.split('/').slice(-2).join('/');
        
        // Delete from storage
        await supabase.storage
          .from('user-files')
          .remove([path]);
      } catch (error) {
        console.error('Error removing image from storage:', error);
      }
    }
    
    setPreview(null);
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    toast({
      title: "Image removed",
      description: "Your profile photo has been removed",
    });
  };

  return (
    <div className="flex flex-col items-center">
      <div 
        className="relative group"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <Avatar 
          className="h-24 w-24 cursor-pointer" 
          onClick={handleButtonClick}
        >
          <AvatarImage src={preview || user?.avatar} />
          <AvatarFallback className="text-xl">
            {user?.name?.slice(0, 2) || 'U'}
          </AvatarFallback>
        </Avatar>
        
        {(isHovering || !preview) && (
          <div 
            className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center cursor-pointer"
            onClick={handleButtonClick}
          >
            <Camera className="h-6 w-6 text-white" />
          </div>
        )}
        
        {preview && (
          <button 
            className="absolute -top-1 -right-1 h-6 w-6 bg-destructive text-white rounded-full flex items-center justify-center"
            onClick={handleClearImage}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      <Button 
        variant="outline" 
        size="sm" 
        className="mt-3 text-xs"
        onClick={handleButtonClick}
        disabled={uploading}
      >
        <Upload className="h-3 w-3 mr-1" />
        {uploading ? 'Uploading...' : 'Change Photo'}
      </Button>
    </div>
  );
}
