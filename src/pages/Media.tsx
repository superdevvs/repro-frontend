import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { PageTransition } from '@/components/layout/PageTransition';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { FileUploader } from '@/components/media/FileUploader';
import { 
  FolderIcon, 
  ImageIcon, 
  PlusIcon, 
  SearchIcon, 
  UploadIcon, 
  VideoIcon,
  FileIcon,
  FilterIcon,
  CheckIcon,
  XIcon,
  MoreHorizontalIcon
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const mediaItems = [
  {
    id: '1',
    type: 'image',
    name: '123_main_st_front.jpg',
    thumbnail: 'https://placehold.co/600x400/png',
    date: '2023-05-10',
    size: '4.2 MB',
    dimensions: '4000 x 3000',
    property: '123 Main Street, Anytown',
    status: 'approved',
  },
  {
    id: '2',
    type: 'image',
    name: '123_main_st_kitchen.jpg',
    thumbnail: 'https://placehold.co/600x400/png',
    date: '2023-05-10',
    size: '3.8 MB',
    dimensions: '4000 x 3000',
    property: '123 Main Street, Anytown',
    status: 'approved',
  },
  {
    id: '3',
    type: 'video',
    name: '123_main_st_walkthrough.mp4',
    thumbnail: 'https://placehold.co/600x400/png',
    date: '2023-05-10',
    size: '24.6 MB',
    duration: '1:32',
    property: '123 Main Street, Anytown',
    status: 'pending',
  },
  {
    id: '4',
    type: 'image',
    name: '456_park_ave_front.jpg',
    thumbnail: 'https://placehold.co/600x400/png',
    date: '2023-05-12',
    size: '4.5 MB',
    dimensions: '4000 x 3000',
    property: '456 Park Avenue, Somewhere',
    status: 'approved',
  },
  {
    id: '5',
    type: 'image',
    name: '456_park_ave_living.jpg',
    thumbnail: 'https://placehold.co/600x400/png',
    date: '2023-05-12',
    size: '3.9 MB',
    dimensions: '4000 x 3000',
    property: '456 Park Avenue, Somewhere',
    status: 'rejected',
  },
  {
    id: '6',
    type: 'document',
    name: '456_park_ave_floorplan.pdf',
    date: '2023-05-12',
    size: '1.2 MB',
    property: '456 Park Avenue, Somewhere',
    status: 'approved',
  },
];

const MediaPage = () => {
  const { toast } = useToast();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [newFolderDialogOpen, setNewFolderDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [currentFolder, setCurrentFolder] = useState('root');
  const [folders, setFolders] = useState<{ id: string; name: string; parent: string }[]>([
    { id: '1', name: 'Properties', parent: 'root' },
    { id: '2', name: 'Documents', parent: 'root' }
  ]);

  const handleUploadComplete = (files: File[]) => {
    setUploadDialogOpen(false);
    
    toast({
      title: 'Upload Complete',
      description: `Successfully uploaded ${files.length} files`,
    });
    
    console.log(`Uploaded ${files.length} files successfully`);
  };

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a folder name',
        variant: 'destructive',
      });
      return;
    }

    const newFolder = {
      id: `folder-${Date.now()}`,
      name: newFolderName,
      parent: currentFolder
    };

    setFolders([...folders, newFolder]);

    toast({
      title: 'Folder Created',
      description: `Created folder: ${newFolderName}`,
    });
    
    console.log(`Created new folder: ${newFolderName}`);

    setNewFolderName('');
    setNewFolderDialogOpen(false);
  };

  const currentFolders = folders.filter(folder => folder.parent === currentFolder);

  return (
    <DashboardLayout>
      <PageTransition>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <Badge className="mb-2 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                Media
              </Badge>
              <h1 className="text-3xl font-bold">Media Library</h1>
              <p className="text-muted-foreground">
                Manage all your property photos, videos, and documents
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => setNewFolderDialogOpen(true)}
              >
                <FolderIcon className="h-4 w-4" />
                New Folder
              </Button>
              <Button 
                className="gap-2"
                onClick={() => setUploadDialogOpen(true)}
              >
                <UploadIcon className="h-4 w-4" />
                Upload Media
              </Button>
            </div>
          </div>
          
          {currentFolder !== 'root' && (
            <Button 
              variant="ghost" 
              className="mb-4"
              onClick={() => setCurrentFolder('root')}
            >
              Back to root
            </Button>
          )}
          
          <div className="flex flex-col space-y-4">
            <Tabs defaultValue="all" className="w-full">
              <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
                <TabsList className="bg-muted/50">
                  <TabsTrigger value="all" className="data-[state=active]:bg-background">All Media</TabsTrigger>
                  <TabsTrigger value="images" className="data-[state=active]:bg-background">Images</TabsTrigger>
                  <TabsTrigger value="videos" className="data-[state=active]:bg-background">Videos</TabsTrigger>
                  <TabsTrigger value="documents" className="data-[state=active]:bg-background">Documents</TabsTrigger>
                </TabsList>
                
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search media..." 
                      className="pl-9 w-[200px] lg:w-[300px]"
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <FilterIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <TabsContent value="all" className="mt-0">
                {currentFolders.length > 0 && (
                  <>
                    <h3 className="font-medium mb-3">Folders</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
                      {currentFolders.map((folder) => (
                        <Card 
                          key={folder.id} 
                          className="glass-card overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => setCurrentFolder(folder.id)}
                        >
                          <CardContent className="p-0">
                            <div className="aspect-video bg-muted/30 flex items-center justify-center">
                              <FolderIcon className="h-16 w-16 text-primary/60" />
                            </div>
                            <div className="p-3">
                              <h3 className="font-medium truncate">{folder.name}</h3>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    <h3 className="font-medium mb-3">Files</h3>
                  </>
                )}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {mediaItems.map((item) => (
                    <Card key={item.id} className="glass-card overflow-hidden hover:shadow-md transition-shadow">
                      <CardContent className="p-0">
                        <div className="relative">
                          {item.type === 'image' || item.type === 'video' ? (
                            <div className="aspect-video bg-muted relative overflow-hidden">
                              <img 
                                src={item.thumbnail} 
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                              {item.type === 'video' && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="bg-black/50 rounded-full p-2">
                                    <VideoIcon className="h-6 w-6 text-white" />
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="aspect-video bg-muted flex items-center justify-center">
                              <FileIcon className="h-12 w-12 text-muted-foreground" />
                            </div>
                          )}
                          
                          <Badge 
                            className={`absolute top-2 right-2 ${
                              item.status === 'approved' 
                                ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                                : item.status === 'pending'
                                ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                : 'bg-red-500/10 text-red-500 border-red-500/20'
                            }`}
                          >
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </Badge>
                        </div>
                        
                        <div className="p-3">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-1">
                              {item.type === 'image' ? (
                                <ImageIcon className="h-3 w-3 text-blue-500" />
                              ) : item.type === 'video' ? (
                                <VideoIcon className="h-3 w-3 text-purple-500" />
                              ) : (
                                <FileIcon className="h-3 w-3 text-orange-500" />
                              )}
                              <span className="text-xs text-muted-foreground">{item.type.toUpperCase()}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">{item.date}</span>
                          </div>
                          
                          <h3 className="font-medium text-sm truncate" title={item.name}>
                            {item.name}
                          </h3>
                          
                          <p className="text-xs text-muted-foreground truncate mt-1">{item.property}</p>
                          
                          <div className="flex justify-between mt-2">
                            <span className="text-xs text-muted-foreground">{item.size}</span>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <CheckIcon className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <XIcon className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <MoreHorizontalIcon className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="images" className="mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {mediaItems.filter(item => item.type === 'image').map((item) => (
                    <Card key={item.id} className="glass-card overflow-hidden hover:shadow-md transition-shadow">
                      <CardContent className="p-0">
                        <div className="relative">
                          <div className="aspect-video bg-muted relative overflow-hidden">
                            <img 
                              src={item.thumbnail} 
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          <Badge 
                            className={`absolute top-2 right-2 ${
                              item.status === 'approved' 
                                ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                                : item.status === 'pending'
                                ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                : 'bg-red-500/10 text-red-500 border-red-500/20'
                            }`}
                          >
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </Badge>
                        </div>
                        
                        <div className="p-3">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-1">
                              <ImageIcon className="h-3 w-3 text-blue-500" />
                              <span className="text-xs text-muted-foreground">IMAGE</span>
                            </div>
                            <span className="text-xs text-muted-foreground">{item.date}</span>
                          </div>
                          
                          <h3 className="font-medium text-sm truncate" title={item.name}>
                            {item.name}
                          </h3>
                          
                          <p className="text-xs text-muted-foreground truncate mt-1">{item.property}</p>
                          
                          <div className="flex justify-between mt-2">
                            <span className="text-xs text-muted-foreground">{item.size}</span>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <CheckIcon className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <XIcon className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <MoreHorizontalIcon className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="videos" className="mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {mediaItems.filter(item => item.type === 'video').map((item) => (
                    <Card key={item.id} className="glass-card overflow-hidden hover:shadow-md transition-shadow">
                      <CardContent className="p-0">
                        <div className="relative">
                          <div className="aspect-video bg-muted relative overflow-hidden">
                            <img 
                              src={item.thumbnail} 
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="bg-black/50 rounded-full p-2">
                                <VideoIcon className="h-6 w-6 text-white" />
                              </div>
                            </div>
                          </div>
                          
                          <Badge 
                            className={`absolute top-2 right-2 ${
                              item.status === 'approved' 
                                ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                                : item.status === 'pending'
                                ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                : 'bg-red-500/10 text-red-500 border-red-500/20'
                            }`}
                          >
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </Badge>
                        </div>
                        
                        <div className="p-3">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-1">
                              <VideoIcon className="h-3 w-3 text-purple-500" />
                              <span className="text-xs text-muted-foreground">VIDEO</span>
                            </div>
                            <span className="text-xs text-muted-foreground">{item.date}</span>
                          </div>
                          
                          <h3 className="font-medium text-sm truncate" title={item.name}>
                            {item.name}
                          </h3>
                          
                          <p className="text-xs text-muted-foreground truncate mt-1">{item.property}</p>
                          
                          <div className="flex justify-between mt-2">
                            <span className="text-xs text-muted-foreground">{item.size}</span>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <CheckIcon className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <XIcon className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <MoreHorizontalIcon className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="documents" className="mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {mediaItems.filter(item => item.type === 'document').map((item) => (
                    <Card key={item.id} className="glass-card overflow-hidden hover:shadow-md transition-shadow">
                      <CardContent className="p-0">
                        <div className="relative">
                          <div className="aspect-video bg-muted flex items-center justify-center">
                            <FileIcon className="h-12 w-12 text-muted-foreground" />
                          </div>
                          
                          <Badge 
                            className={`absolute top-2 right-2 ${
                              item.status === 'approved' 
                                ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                                : item.status === 'pending'
                                ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                : 'bg-red-500/10 text-red-500 border-red-500/20'
                            }`}
                          >
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </Badge>
                        </div>
                        
                        <div className="p-3">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-1">
                              <FileIcon className="h-3 w-3 text-orange-500" />
                              <span className="text-xs text-muted-foreground">DOCUMENT</span>
                            </div>
                            <span className="text-xs text-muted-foreground">{item.date}</span>
                          </div>
                          
                          <h3 className="font-medium text-sm truncate" title={item.name}>
                            {item.name}
                          </h3>
                          
                          <p className="text-xs text-muted-foreground truncate mt-1">{item.property}</p>
                          
                          <div className="flex justify-between mt-2">
                            <span className="text-xs text-muted-foreground">{item.size}</span>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <CheckIcon className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <XIcon className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <MoreHorizontalIcon className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogContent className="sm:max-w-[800px]">
              <DialogHeader>
                <DialogTitle>Upload Media</DialogTitle>
              </DialogHeader>
              <FileUploader 
                onUploadComplete={handleUploadComplete}
                className="mt-4"
              />
            </DialogContent>
          </Dialog>

          <Dialog open={newFolderDialogOpen} onOpenChange={setNewFolderDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Folder</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <FolderIcon className="h-8 w-8 text-muted-foreground col-span-1" />
                  <div className="col-span-3">
                    <Input
                      id="name"
                      placeholder="Enter folder name"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setNewFolderDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateFolder}>Create Folder</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </PageTransition>
    </DashboardLayout>
  );
};

export default MediaPage;
