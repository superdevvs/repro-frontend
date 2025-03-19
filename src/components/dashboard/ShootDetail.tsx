
import React, { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { 
  HomeIcon, 
  CalendarIcon, 
  ClockIcon, 
  CameraIcon, 
  UsersIcon, 
  DollarSignIcon,
  MessageSquare,
  ImageIcon,
  Link2,
  Download,
  PenLine
} from "lucide-react";
import { format } from 'date-fns';
import { ShootData } from '@/types/shoots';
import { useAuth } from '@/components/auth/AuthProvider';

interface ShootDetailProps {
  shoot: ShootData | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ShootDetail({ shoot, isOpen, onClose }: ShootDetailProps) {
  const { role } = useAuth();
  const [activeTab, setActiveTab] = useState("details");
  const isAdmin = ['admin', 'superadmin'].includes(role);
  const isPhotographer = role === 'photographer';
  
  if (!shoot) return null;
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    return format(new Date(dateString), 'MMMM d, yyyy');
  };
  
  const getStatusBadge = (status: ShootData['status']) => {
    switch (status) {
      case 'scheduled':
        return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">Scheduled</Badge>;
      case 'completed':
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Pending</Badge>;
      case 'hold':
        return <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20">Hold</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const getPaymentStatus = () => {
    if (!shoot.payment.totalPaid) return <Badge variant="outline">Unpaid</Badge>;
    if (shoot.payment.totalPaid < shoot.payment.totalQuote) {
      return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Partial</Badge>;
    }
    return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Paid</Badge>;
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">Shoot Details</DialogTitle>
            <div className="flex items-center gap-2">
              {getStatusBadge(shoot.status)}
              {isAdmin && getPaymentStatus()}
            </div>
          </div>
          <DialogDescription>
            ID: #{shoot.id} • Created by: {shoot.createdBy || 'Unknown'}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="media" disabled={!shoot.media?.photos?.length}>Media</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Client Information</h3>
                  <div className="flex items-start gap-3">
                    <UsersIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-medium">{shoot.client.name}</p>
                      <p className="text-sm text-muted-foreground">{shoot.client.email}</p>
                      {shoot.client.phone && (
                        <p className="text-sm text-muted-foreground">{shoot.client.phone}</p>
                      )}
                      {shoot.client.company && (
                        <p className="text-sm text-muted-foreground">{shoot.client.company}</p>
                      )}
                      {shoot.client.totalShoots && (
                        <Badge variant="outline" className="mt-1">
                          {shoot.client.totalShoots} Total Shoots
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Property Information</h3>
                  <div className="flex items-start gap-3">
                    <HomeIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-medium">{shoot.location.address}</p>
                      {shoot.location.address2 && (
                        <p className="text-sm">{shoot.location.address2}</p>
                      )}
                      <p className="text-sm text-muted-foreground">
                        {shoot.location.city}, {shoot.location.state} {shoot.location.zip}
                      </p>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Photographer</h3>
                  <div className="flex items-start gap-3">
                    <CameraIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">{shoot.photographer.name}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Schedule</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <CalendarIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Scheduled Date</p>
                        <p className="font-medium">{formatDate(shoot.scheduledDate)}</p>
                      </div>
                    </div>
                    
                    {shoot.completedDate && (
                      <div className="flex items-start gap-3">
                        <ClockIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Completed Date</p>
                          <p className="font-medium">{formatDate(shoot.completedDate)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Services</h3>
                  <div className="flex flex-wrap gap-2">
                    {shoot.services.length > 0 ? (
                      shoot.services.map((service, index) => (
                        <Badge key={index} variant="outline">
                          {service}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No services selected</p>
                    )}
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Payment Details</h3>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Base Quote:</span>
                      <span>${shoot.payment.baseQuote.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax ({shoot.payment.taxRate}%):</span>
                      <span>${shoot.payment.taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-medium">
                      <span>Total Quote:</span>
                      <span>${shoot.payment.totalQuote.toFixed(2)}</span>
                    </div>
                    
                    {shoot.payment.totalPaid !== undefined && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total Paid:</span>
                        <span>${shoot.payment.totalPaid.toFixed(2)}</span>
                      </div>
                    )}
                    
                    {shoot.payment.lastPaymentDate && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Last Payment:</span>
                        <span>{formatDate(shoot.payment.lastPaymentDate)} ({shoot.payment.lastPaymentType})</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {shoot.tourLinks && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-muted-foreground">Tour Links</h3>
                      <div className="space-y-2">
                        {shoot.tourLinks.branded && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Branded Tour</span>
                            <Button variant="outline" size="sm" className="h-7">
                              <Link2 className="h-3.5 w-3.5 mr-1" />
                              View
                            </Button>
                          </div>
                        )}
                        {shoot.tourLinks.mls && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm">MLS Tour</span>
                            <Button variant="outline" size="sm" className="h-7">
                              <Link2 className="h-3.5 w-3.5 mr-1" />
                              View
                            </Button>
                          </div>
                        )}
                        {shoot.tourLinks.genericMls && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Generic MLS Tour</span>
                            <Button variant="outline" size="sm" className="h-7">
                              <Link2 className="h-3.5 w-3.5 mr-1" />
                              View
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="notes" className="mt-4 space-y-6">
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
                  value={shoot.notes?.shootNotes || ''} 
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
                    value={shoot.notes?.photographerNotes || ''}
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
                    value={shoot.notes?.companyNotes || ''}
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
                    value={shoot.notes?.editingNotes || ''}
                    readOnly={role !== 'editor'}
                    className="resize-none min-h-[100px]"
                  />
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="media" className="mt-4">
            {shoot.media?.photos && shoot.media.photos.length > 0 ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {shoot.media.photos.map((photo, index) => (
                    <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
                      <img 
                        src={photo} 
                        alt={`Property photo ${index + 1}`} 
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-end gap-2">
                  {isPhotographer && (
                    <Button variant="outline">
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Upload More
                    </Button>
                  )}
                  <Button>
                    <Download className="h-4 w-4 mr-2" />
                    Download All
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <ImageIcon className="h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No Media Available</h3>
                <p className="text-muted-foreground mt-1 mb-4">
                  {shoot.status === 'completed' 
                    ? 'No media has been uploaded for this shoot yet.' 
                    : 'Media will be available after the shoot is completed.'}
                </p>
                {isPhotographer && shoot.status === 'completed' && (
                  <Button>
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Upload Media
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={onClose}>Close</Button>
          
          {isAdmin && (
            <>
              <Button variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                Send Message
              </Button>
              <Button>
                <PenLine className="h-4 w-4 mr-2" />
                Edit Shoot
              </Button>
            </>
          )}
          
          {isPhotographer && shoot.status === 'scheduled' && (
            <Button>
              <CalendarIcon className="h-4 w-4 mr-2" />
              Mark as Completed
            </Button>
          )}
          
          {role === 'superadmin' && (
            <Button variant="default">
              <DollarSignIcon className="h-4 w-4 mr-2" />
              Process Payment
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
