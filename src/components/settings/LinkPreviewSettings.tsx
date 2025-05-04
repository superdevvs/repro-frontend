
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FileUploader } from '@/components/media/FileUploader';
import { toast } from 'sonner';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface LinkPreviewData {
  title: string;
  description: string;
  siteName: string;
  imageUrl: string;
}

export function LinkPreviewSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [previewData, setPreviewData] = useState<LinkPreviewData>({
    title: 'RePro Photos',
    description: 'Real Estate Photography Professional Dashboard',
    siteName: 'RePro Photos',
    imageUrl: '/og-image.png',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPreviewData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleImageChange = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      // In a real app, you would upload this file to your server or storage
      // For demo purposes, we'll create a temp URL
      const imageUrl = URL.createObjectURL(file);
      setPreviewData(prev => ({
        ...prev,
        imageUrl
      }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // In a real app, you would make an API call to update the metadata
      // For demo purposes, we'll just show a toast notification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Link preview settings saved successfully", {
        description: "Changes will be reflected when sharing links",
      });
    } catch (error) {
      toast.error("Failed to save link preview settings", {
        description: "Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Link Preview Settings</CardTitle>
        <CardDescription>
          Control how your application appears when links are shared on social media platforms
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Link Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={previewData.title}
                  onChange={handleChange}
                  placeholder="Site title for link preview"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  name="siteName"
                  value={previewData.siteName}
                  onChange={handleChange}
                  placeholder="Site name for link preview"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={previewData.description}
                onChange={handleChange}
                placeholder="Description for link preview"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Preview Image</Label>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <FileUploader
                    onFilesSelected={handleImageChange}
                    accept="image/*"
                    maxFiles={1}
                    label="Upload preview image"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Recommended size: 1200x630 pixels (Aspect ratio 1.91:1)
                  </p>
                </div>
                <div className="border rounded-md overflow-hidden">
                  <AspectRatio ratio={1200/630} className="bg-muted">
                    {previewData.imageUrl && (
                      <img
                        src={previewData.imageUrl}
                        alt="Preview"
                        className="object-cover w-full h-full"
                      />
                    )}
                    {!previewData.imageUrl && (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        No preview image
                      </div>
                    )}
                  </AspectRatio>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Link Preview Example</Label>
              <div className="border rounded-md p-4 space-y-3">
                <div className="w-full h-48 bg-muted rounded-md overflow-hidden">
                  {previewData.imageUrl && (
                    <img
                      src={previewData.imageUrl}
                      alt="Preview"
                      className="object-cover w-full h-full"
                    />
                  )}
                </div>
                <h3 className="font-semibold text-lg">{previewData.title || 'Website Title'}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {previewData.description || 'Website description goes here'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {previewData.siteName || 'website.com'}
                </p>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </CardFooter>
    </Card>
  );
}
