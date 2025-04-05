
import React, { useState } from 'react';
import { PageTransition } from '@/components/layout/PageTransition';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from "sonner";
import { ExternalLink, Upload, Copy, Eye, Download, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Skeleton } from '@/components/ui/skeleton';

// Example data for tours (would normally come from API)
const exampleTours = {
  cubicasa: [
    { id: '1', propertyId: 'P1001', name: '123 Main St', status: 'active', url: 'https://example.com/cubicasa/123-main', thumbnailUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=240&auto=format', createdAt: '2023-10-15' },
    { id: '2', propertyId: 'P1002', name: '456 Oak Ave', status: 'active', url: 'https://example.com/cubicasa/456-oak', thumbnailUrl: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=240&auto=format', createdAt: '2023-11-12' },
  ],
  matterport: [
    { id: '1', propertyId: 'P1001', name: '123 Main St', status: 'active', url: 'https://example.com/matterport/123-main', thumbnailUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=240&auto=format', createdAt: '2023-10-16' },
    { id: '3', propertyId: 'P1003', name: '789 Pine Rd', status: 'processing', url: 'https://example.com/matterport/789-pine', thumbnailUrl: 'https://images.unsplash.com/photo-1600585152915-d208bec867a1?q=80&w=240&auto=format', createdAt: '2023-12-05' },
  ],
  iguide: [
    { id: '2', propertyId: 'P1002', name: '456 Oak Ave', status: 'active', url: 'https://example.com/iguide/456-oak', thumbnailUrl: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=240&auto=format', createdAt: '2023-11-14' },
  ]
};

export default function VirtualTours() {
  const [activeTab, setActiveTab] = useState('cubicasa');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState<string>('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isAddingTour, setIsAddingTour] = useState(false);
  const [newTourUrl, setNewTourUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const openPreview = (url: string, type: string, title: string) => {
    setPreviewUrl(url);
    setPreviewType(type);
    setPreviewTitle(title);
    setIsPreviewOpen(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("URL copied to clipboard");
  };

  const handleAddTour = (provider: string) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsAddingTour(false);
      setNewTourUrl('');
      setFile(null);
      
      toast.success(`${provider} tour added successfully`);
    }, 1500);
  };

  return (
    <PageTransition>
      <div className="container max-w-screen-xl mx-auto py-6 space-y-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Virtual Tours</h1>
            <p className="text-muted-foreground">
              Manage 3D virtual tours and floor plans across multiple providers
            </p>
          </div>
          <Button onClick={() => setIsAddingTour(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Tour
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full sm:w-auto grid sm:inline-flex grid-cols-3 sm:grid-cols-none mb-4">
            <TabsTrigger value="cubicasa">Cubicasa Floor Plans</TabsTrigger>
            <TabsTrigger value="matterport">Matterport 3D Tours</TabsTrigger>
            <TabsTrigger value="iguide">iGUIDE Tours</TabsTrigger>
          </TabsList>
          
          {['cubicasa', 'matterport', 'iguide'].map((provider) => (
            <TabsContent key={provider} value={provider} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {exampleTours[provider as keyof typeof exampleTours].length === 0 ? (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">No tours found</CardTitle>
                      <CardDescription>
                        Add your first {provider} tour to get started
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        onClick={() => setIsAddingTour(true)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Tour
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  exampleTours[provider as keyof typeof exampleTours].map((tour) => (
                    <Card key={tour.id} className="overflow-hidden">
                      <div className="aspect-[4/3] relative bg-muted group cursor-pointer" 
                           onClick={() => openPreview(tour.url, provider, tour.name)}>
                        <img 
                          src={tour.thumbnailUrl}
                          alt={`${tour.name} preview`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <Eye className="h-8 w-8 text-white" />
                        </div>
                        {tour.status === 'processing' && (
                          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                            <p className="text-white font-medium text-sm bg-primary px-3 py-1 rounded-full">Processing</p>
                          </div>
                        )}
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{tour.name}</CardTitle>
                        <CardDescription>
                          Property ID: {tour.propertyId}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => openPreview(tour.url, provider, tour.name)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => copyToClipboard(tour.url)}
                          >
                            <Copy className="h-4 w-4 mr-1" />
                            Copy Link
                          </Button>
                          {provider === 'cubicasa' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Download PDF
                            </Button>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Added: {new Date(tour.createdAt).toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
        
        <Separator className="my-8" />
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Integration Instructions</h2>
          
          <div className="space-y-4">
            <Collapsible>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full flex justify-between">
                  <span>Cubicasa Integration Guide</span>
                  <Plus className="h-4 w-4" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="p-4 border rounded-md mt-2">
                <p className="mb-2">To integrate Cubicasa floor plans:</p>
                <ol className="list-decimal ml-5 space-y-1">
                  <li>Upload PDF floor plans directly using the "Add New Tour" button</li>
                  <li>Or provide the Cubicasa project URL</li>
                  <li>The system will generate shareable links automatically</li>
                </ol>
                <Button variant="link" className="p-0 h-auto mt-2" asChild>
                  <a href="https://www.cubi.casa/developers/" target="_blank" rel="noopener noreferrer" className="flex items-center">
                    Cubicasa API Documentation
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </Button>
              </CollapsibleContent>
            </Collapsible>
            
            <Collapsible>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full flex justify-between">
                  <span>Matterport Integration Guide</span>
                  <Plus className="h-4 w-4" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="p-4 border rounded-md mt-2">
                <p className="mb-2">To integrate Matterport 3D tours:</p>
                <ol className="list-decimal ml-5 space-y-1">
                  <li>Add Matterport tour URL using the "Add New Tour" button</li>
                  <li>Tours will be embedded via iframe for seamless viewing</li>
                  <li>Provide the unique Matterport model ID for best results</li>
                </ol>
                <Button variant="link" className="p-0 h-auto mt-2" asChild>
                  <a href="https://developers.matterport.com/" target="_blank" rel="noopener noreferrer" className="flex items-center">
                    Matterport API Documentation
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </Button>
              </CollapsibleContent>
            </Collapsible>
            
            <Collapsible>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full flex justify-between">
                  <span>iGUIDE Integration Guide</span>
                  <Plus className="h-4 w-4" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="p-4 border rounded-md mt-2">
                <p className="mb-2">To integrate iGUIDE tours:</p>
                <ol className="list-decimal ml-5 space-y-1">
                  <li>Upload ZIP files or provide direct iGUIDE URL</li>
                  <li>System will extract floor plans and tour information automatically</li>
                  <li>Use the provided API token from your iGUIDE account settings</li>
                </ol>
                <Button variant="link" className="p-0 h-auto mt-2" asChild>
                  <a href="https://goiguide.com/api/" target="_blank" rel="noopener noreferrer" className="flex items-center">
                    iGUIDE API Documentation
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </Button>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </div>
      
      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{previewTitle}</DialogTitle>
            <DialogDescription>
              {previewType === 'cubicasa' ? 'Cubicasa Floor Plan' : 
               previewType === 'matterport' ? 'Matterport 3D Tour' : 
               'iGUIDE Tour'}
            </DialogDescription>
          </DialogHeader>
          <div className="aspect-[16/9] w-full bg-muted overflow-hidden rounded">
            <iframe 
              src={previewUrl || ''}
              className="w-full h-full"
              title={`${previewType} preview for ${previewTitle}`}
              allowFullScreen
            />
          </div>
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>Close</Button>
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={() => copyToClipboard(previewUrl || '')}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </Button>
              <Button>
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Full View
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Add Tour Dialog */}
      <Dialog open={isAddingTour} onOpenChange={setIsAddingTour}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Tour</DialogTitle>
            <DialogDescription>
              Add a new virtual tour or floor plan from one of our supported providers.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="cubicasa" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="cubicasa">Cubicasa</TabsTrigger>
              <TabsTrigger value="matterport">Matterport</TabsTrigger>
              <TabsTrigger value="iguide">iGUIDE</TabsTrigger>
            </TabsList>
            
            <TabsContent value="cubicasa" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cubicasa-file">Upload Floor Plan PDF</Label>
                <Input
                  id="cubicasa-file"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                />
              </div>
              
              <div className="text-center text-sm text-muted-foreground">OR</div>
              
              <div className="space-y-2">
                <Label htmlFor="cubicasa-url">Cubicasa Project URL</Label>
                <Input
                  id="cubicasa-url"
                  value={newTourUrl}
                  onChange={(e) => setNewTourUrl(e.target.value)}
                  placeholder="https://www.cubi.casa/project/..."
                />
              </div>
              
              <Button 
                className="w-full" 
                onClick={() => handleAddTour('Cubicasa')}
                disabled={isLoading || (!file && !newTourUrl)}
              >
                {isLoading ? (
                  <>
                    <Skeleton className="h-4 w-4 mr-2 rounded-full animate-pulse" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Floor Plan
                  </>
                )}
              </Button>
            </TabsContent>
            
            <TabsContent value="matterport" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="matterport-url">Matterport Tour URL</Label>
                <Input
                  id="matterport-url"
                  value={newTourUrl}
                  onChange={(e) => setNewTourUrl(e.target.value)}
                  placeholder="https://my.matterport.com/show/?m=..."
                />
              </div>
              
              <Button 
                className="w-full" 
                onClick={() => handleAddTour('Matterport')}
                disabled={isLoading || !newTourUrl}
              >
                {isLoading ? (
                  <>
                    <Skeleton className="h-4 w-4 mr-2 rounded-full animate-pulse" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Matterport Tour
                  </>
                )}
              </Button>
            </TabsContent>
            
            <TabsContent value="iguide" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="iguide-file">Upload iGUIDE ZIP File</Label>
                <Input
                  id="iguide-file"
                  type="file"
                  accept=".zip"
                  onChange={handleFileChange}
                />
              </div>
              
              <div className="text-center text-sm text-muted-foreground">OR</div>
              
              <div className="space-y-2">
                <Label htmlFor="iguide-url">iGUIDE Tour URL</Label>
                <Input
                  id="iguide-url"
                  value={newTourUrl}
                  onChange={(e) => setNewTourUrl(e.target.value)}
                  placeholder="https://goiguide.com/tour/..."
                />
              </div>
              
              <Button 
                className="w-full" 
                onClick={() => handleAddTour('iGUIDE')}
                disabled={isLoading || (!file && !newTourUrl)}
              >
                {isLoading ? (
                  <>
                    <Skeleton className="h-4 w-4 mr-2 rounded-full animate-pulse" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Add iGUIDE Tour
                  </>
                )}
              </Button>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
}
