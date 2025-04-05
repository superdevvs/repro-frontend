
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useDropzone } from 'react-dropzone';
import { Eye, Upload, X, Check, AlertCircle, Image, Video, FileText } from 'lucide-react';
import { ShootData, MediaItem } from '@/types/shoots';
import { useToast } from '@/hooks/use-toast';

interface ShootMediaTabProps {
  shoot: ShootData;
  setShoot: (shoot: ShootData) => void;
  isPhotographer: boolean;
}

export function ShootMediaTab({ shoot, setShoot, isPhotographer }: ShootMediaTabProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('photos');
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [uploadingVideos, setUploadingVideos] = useState(false);
  const [uploadingDocuments, setUploadingDocuments] = useState(false);

  // Initialize media data from shoot or create empty arrays
  const mediaData = {
    photos: shoot.media?.photos || [],
    videos: shoot.media?.videos || [],
    documents: shoot.media?.documents || []
  };

  const handleMediaUpload = (files: File[], mediaType: 'photos' | 'videos' | 'documents') => {
    // In a real app, you would upload these files to your server
    console.log(`Uploading ${files.length} ${mediaType}:`, files);
    
    const setUploading = {
      'photos': setUploadingPhotos,
      'videos': setUploadingVideos,
      'documents': setUploadingDocuments
    }[mediaType];
    
    setUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      // Create mock media items based on the uploaded files
      const newMedia = files.map(file => ({
        id: `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type,
        size: file.size,
        uploadDate: new Date().toISOString(),
        approved: false
      }));
      
      // Update the shoot object with the new media
      const updatedMedia = {
        ...shoot.media,
        [mediaType]: [...(shoot.media?.[mediaType] || []), ...newMedia]
      };
      
      setShoot({
        ...shoot,
        media: updatedMedia
      });
      
      setUploading(false);
      
      toast({
        title: `${mediaType.charAt(0).toUpperCase() + mediaType.slice(1)} uploaded`,
        description: `Successfully uploaded ${files.length} ${files.length === 1 ? 'file' : 'files'}`
      });
    }, 1500);
  };
  
  const onPhotosDrop = (acceptedFiles: File[]) => {
    handleMediaUpload(acceptedFiles, 'photos');
  };
  
  const onVideosDrop = (acceptedFiles: File[]) => {
    handleMediaUpload(acceptedFiles, 'videos');
  };
  
  const onDocumentsDrop = (acceptedFiles: File[]) => {
    handleMediaUpload(acceptedFiles, 'documents');
  };
  
  const {
    getRootProps: getPhotosRootProps,
    getInputProps: getPhotosInputProps,
    isDragActive: isPhotosDragActive
  } = useDropzone({
    onDrop: onPhotosDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif']
    },
    disabled: !isPhotographer || uploadingPhotos
  });
  
  const {
    getRootProps: getVideosRootProps,
    getInputProps: getVideosInputProps,
    isDragActive: isVideosDragActive
  } = useDropzone({
    onDrop: onVideosDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi', '.wmv']
    },
    disabled: !isPhotographer || uploadingVideos
  });
  
  const {
    getRootProps: getDocumentsRootProps,
    getInputProps: getDocumentsInputProps,
    isDragActive: isDocumentsDragActive
  } = useDropzone({
    onDrop: onDocumentsDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    disabled: !isPhotographer || uploadingDocuments
  });

  // Just a placeholder for the actual approval logic
  const handleApproveMedia = (id: string, mediaType: 'photos' | 'videos' | 'documents') => {
    const updatedMedia = shoot.media?.[mediaType]?.map(item => 
      item.id === id ? { ...item, approved: true } : item
    );
    
    const newMedia = {
      ...shoot.media,
      [mediaType]: updatedMedia
    };
    
    setShoot({
      ...shoot,
      media: newMedia
    });
    
    toast({
      title: "Media approved",
      description: "The selected media has been approved"
    });
  };
  
  const handleDeleteMedia = (id: string, mediaType: 'photos' | 'videos' | 'documents') => {
    const updatedMedia = {
      ...shoot.media,
      [mediaType]: shoot.media?.[mediaType]?.filter(item => item.id !== id)
    };
    
    setShoot({
      ...shoot,
      media: updatedMedia
    });
    
    toast({
      title: "Media deleted",
      description: "The selected media has been deleted"
    });
  };
  
  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="photos" className="flex items-center gap-2">
            <Image className="w-4 h-4" />
            <span>Photos</span>
            {mediaData.photos.length > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {mediaData.photos.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="videos" className="flex items-center gap-2">
            <Video className="w-4 h-4" />
            <span>Videos</span>
            {mediaData.videos.length > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {mediaData.videos.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span>Documents</span>
            {mediaData.documents.length > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {mediaData.documents.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="photos" className="mt-4">
          {isPhotographer && (
            <div
              {...getPhotosRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer mb-6 transition-colors ${
                isPhotosDragActive ? 'bg-primary/10 border-primary' : 'hover:bg-muted/50'
              }`}
            >
              <input {...getPhotosInputProps()} />
              <div className="flex flex-col items-center justify-center gap-2">
                <Upload className="w-8 h-8 text-muted-foreground" />
                <h3 className="font-medium">Drag & drop photos here</h3>
                <p className="text-sm text-muted-foreground">
                  or click to select files
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Supported formats: JPG, PNG, GIF
                </p>
              </div>
            </div>
          )}
          
          {uploadingPhotos && (
            <Card className="mb-6">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="animate-spin">
                  <Upload className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Uploading photos...</p>
                  <p className="text-sm text-muted-foreground">This may take a few moments</p>
                </div>
              </CardContent>
            </Card>
          )}
          
          {mediaData.photos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {mediaData.photos.map((photo) => (
                <Card key={photo.id} className="overflow-hidden">
                  <div className="relative aspect-video">
                    <img
                      src={photo.url}
                      alt={photo.name || 'Property photo'}
                      className="w-full h-full object-cover"
                    />
                    {photo.approved && (
                      <Badge className="absolute top-2 right-2 bg-green-600">
                        <Check className="h-3 w-3 mr-1" /> Approved
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-3">
                    <div className="flex justify-between items-center">
                      <p className="text-sm truncate" title={photo.name}>
                        {photo.name}
                      </p>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {!photo.approved && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-green-600" 
                            onClick={() => handleApproveMedia(photo.id, 'photos')}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-destructive"
                          onClick={() => handleDeleteMedia(photo.id, 'photos')}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <AlertCircle className="h-12 w-12 text-muted-foreground opacity-20" />
              </div>
              <h3 className="font-medium text-lg mb-1">No photos uploaded</h3>
              <p className="text-muted-foreground">
                {isPhotographer 
                  ? "Upload photos to share with the client" 
                  : "The photographer hasn't uploaded any photos yet"}
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="videos" className="mt-4">
          {isPhotographer && (
            <div
              {...getVideosRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer mb-6 transition-colors ${
                isVideosDragActive ? 'bg-primary/10 border-primary' : 'hover:bg-muted/50'
              }`}
            >
              <input {...getVideosInputProps()} />
              <div className="flex flex-col items-center justify-center gap-2">
                <Upload className="w-8 h-8 text-muted-foreground" />
                <h3 className="font-medium">Drag & drop videos here</h3>
                <p className="text-sm text-muted-foreground">
                  or click to select files
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Supported formats: MP4, MOV, AVI
                </p>
              </div>
            </div>
          )}
          
          {uploadingVideos && (
            <Card className="mb-6">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="animate-spin">
                  <Upload className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Uploading videos...</p>
                  <p className="text-sm text-muted-foreground">This may take a few moments</p>
                </div>
              </CardContent>
            </Card>
          )}
          
          {mediaData.videos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {mediaData.videos.map((video) => (
                <Card key={video.id} className="overflow-hidden">
                  <div className="relative aspect-video">
                    <video 
                      src={video.url}
                      className="w-full h-full object-cover" 
                      controls
                    ></video>
                    {video.approved && (
                      <Badge className="absolute top-2 right-2 bg-green-600">
                        <Check className="h-3 w-3 mr-1" /> Approved
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-3">
                    <div className="flex justify-between items-center">
                      <p className="text-sm truncate" title={video.name}>
                        {video.name}
                      </p>
                      <div className="flex gap-1">
                        {!video.approved && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-green-600" 
                            onClick={() => handleApproveMedia(video.id, 'videos')}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-destructive"
                          onClick={() => handleDeleteMedia(video.id, 'videos')}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <AlertCircle className="h-12 w-12 text-muted-foreground opacity-20" />
              </div>
              <h3 className="font-medium text-lg mb-1">No videos uploaded</h3>
              <p className="text-muted-foreground">
                {isPhotographer 
                  ? "Upload videos to share with the client" 
                  : "The photographer hasn't uploaded any videos yet"}
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="documents" className="mt-4">
          {isPhotographer && (
            <div
              {...getDocumentsRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer mb-6 transition-colors ${
                isDocumentsDragActive ? 'bg-primary/10 border-primary' : 'hover:bg-muted/50'
              }`}
            >
              <input {...getDocumentsInputProps()} />
              <div className="flex flex-col items-center justify-center gap-2">
                <Upload className="w-8 h-8 text-muted-foreground" />
                <h3 className="font-medium">Drag & drop documents here</h3>
                <p className="text-sm text-muted-foreground">
                  or click to select files
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Supported formats: PDF, DOC, DOCX
                </p>
              </div>
            </div>
          )}
          
          {uploadingDocuments && (
            <Card className="mb-6">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="animate-spin">
                  <Upload className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Uploading documents...</p>
                  <p className="text-sm text-muted-foreground">This may take a few moments</p>
                </div>
              </CardContent>
            </Card>
          )}
          
          {mediaData.documents.length > 0 ? (
            <div className="space-y-2">
              {mediaData.documents.map((doc) => (
                <Card key={doc.id}>
                  <CardContent className="p-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <p className="text-sm" title={doc.name}>
                          {doc.name}
                        </p>
                        {doc.approved && (
                          <Badge variant="outline" className="text-green-600 border-green-600 ml-2">
                            <Check className="h-3 w-3 mr-1" /> Approved
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {!doc.approved && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-green-600" 
                            onClick={() => handleApproveMedia(doc.id, 'documents')}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-destructive"
                          onClick={() => handleDeleteMedia(doc.id, 'documents')}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <AlertCircle className="h-12 w-12 text-muted-foreground opacity-20" />
              </div>
              <h3 className="font-medium text-lg mb-1">No documents uploaded</h3>
              <p className="text-muted-foreground">
                {isPhotographer 
                  ? "Upload documents to share with the client" 
                  : "The photographer hasn't uploaded any documents yet"}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <Separator className="my-6" />
      
      <div className="space-y-2">
        <h3 className="font-semibold text-sm">Delivery Instructions</h3>
        <p className="text-sm text-muted-foreground">
          Upload all required media for this shoot. The client will be notified once the media is ready for review.
          Photos should be edited according to our standard guidelines. Videos should be in 4K resolution.
        </p>
      </div>
    </div>
  );
}
