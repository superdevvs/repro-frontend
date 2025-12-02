import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, ExternalLink, CalendarIcon, MapPinIcon, ClockIcon, Send, CheckCircle, DollarSign as DollarSignIcon, ChevronUp, ChevronDown } from "lucide-react";
import { format } from 'date-fns';
import { ShootData } from '@/types/shoots';
import { useAuth } from '@/components/auth/AuthProvider';
import { API_BASE_URL } from '@/config/env';
import { useToast } from '@/hooks/use-toast';
import { useShoots } from '@/context/ShootsContext';
import { getWeatherForLocation, WeatherInfo } from '@/services/weatherService';
import { subscribeToWeatherProvider } from '@/state/weatherProviderStore';

// Import tab components
import { ShootDetailsOverviewTab } from './tabs/ShootDetailsOverviewTab';
import { ShootDetailsMediaTab } from './tabs/ShootDetailsMediaTab';
import { ShootDetailsNotesTab } from './tabs/ShootDetailsNotesTab';
import { ShootDetailsIssuesTab } from './tabs/ShootDetailsIssuesTab';
import { ShootDetailsSettingsTab } from './tabs/ShootDetailsSettingsTab';
import { ShootDetailsQuickActions } from './tabs/ShootDetailsQuickActions';
import { SquarePaymentDialog } from '@/components/payments/SquarePaymentDialog';

interface ShootDetailsModalProps {
  shootId: string | number;
  isOpen: boolean;
  onClose: () => void;
  currentRole?: string; // Optional override, defaults to auth role
}

export function ShootDetailsModal({ 
  shootId, 
  isOpen, 
  onClose,
  currentRole 
}: ShootDetailsModalProps) {
  const navigate = useNavigate();
  const { role: authRole, user } = useAuth();
  const { toast } = useToast();
  const { updateShoot } = useShoots();
  
  const [shoot, setShoot] = useState<ShootData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [providerVersion, setProviderVersion] = useState(0);
  const [isMediaExpanded, setIsMediaExpanded] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  
  // Use provided role or fallback to auth role
  const currentUserRole = currentRole || authRole;
  
  // Role checks
  const isAdmin = ['admin', 'superadmin'].includes(currentUserRole);
  const isPhotographer = currentUserRole === 'photographer';
  const isEditor = currentUserRole === 'editor';
  const isClient = currentUserRole === 'client';

  // Subscribe to weather provider updates
  useEffect(() => {
    const unsubscribe = subscribeToWeatherProvider(() => {
      setProviderVersion((version) => version + 1);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  // Fetch shoot data
  useEffect(() => {
    if (!isOpen || !shootId) return;
    
    const fetchShoot = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('authToken') || localStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/api/shoots/${shootId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });
        
        if (!res.ok) throw new Error('Failed to fetch shoot');
        
        const json = await res.json();
        // Handle different API response structures
        let shootData = json.data || json;
        
        // If the response has nested structure, try to extract
        if (json.success && json.data) {
          shootData = json.data;
        }
        
        // Normalize the data structure
        if (shootData) {
          // Ensure location object exists
          if (!shootData.location && (shootData.address || shootData.city)) {
            shootData.location = {
              address: shootData.address || '',
              city: shootData.city || '',
              state: shootData.state || '',
              zip: shootData.zip || '',
              fullAddress: shootData.fullAddress || shootData.address || '',
            };
          }
          
          // Ensure services is an array
          if (!Array.isArray(shootData.services)) {
            if (shootData.service) {
              shootData.services = [shootData.service.name || shootData.service];
            } else if (typeof shootData.services === 'string') {
              shootData.services = [shootData.services];
            } else {
              shootData.services = [];
            }
          }
          
          // Ensure scheduledDate exists
          if (!shootData.scheduledDate && shootData.scheduled_date) {
            shootData.scheduledDate = shootData.scheduled_date;
          }
        }
        
        setShoot(shootData);
      } catch (error) {
        console.error('Error fetching shoot:', error);
        toast({
          title: 'Error',
          description: 'Failed to load shoot details',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchShoot();
  }, [isOpen, shootId, toast]);

  // Fetch weather data - match dashboard logic exactly
  useEffect(() => {
    if (!shoot || !isOpen) {
      setWeather(null);
      return;
    }

    // Use exact same location logic as dashboard
    // Dashboard uses: shoot.cityStateZip || shoot.addressLine
    let location: string | null = null;
    
    // Try dashboard properties first (for DashboardShootSummary compatibility)
    if ((shoot as any).cityStateZip) {
      location = (shoot as any).cityStateZip;
    } else if ((shoot as any).addressLine) {
      location = (shoot as any).addressLine;
    } else if (shoot.location?.fullAddress) {
      // Fallback to ShootData location
      location = shoot.location.fullAddress;
    } else if (shoot.location?.address) {
      location = shoot.location.address;
    }
    
    if (!location) {
      setWeather(null);
      return;
    }

    const controller = new AbortController();
    setWeather(null);

    // Use exact same date logic as dashboard - dashboard uses shoot.startTime directly
    const dateInput = (shoot as any).startTime || undefined;

    getWeatherForLocation(location, dateInput, controller.signal)
      .then((info) => {
        setWeather(info || null);
      })
      .catch(() => {
        setWeather(null);
      });

    return () => {
      controller.abort();
    };
  }, [shoot?.id, shoot?.location?.fullAddress, shoot && (shoot as any).cityStateZip, shoot && (shoot as any).addressLine, shoot && (shoot as any).startTime, isOpen, providerVersion]);

  // Refresh shoot data
  const refreshShoot = async () => {
    if (!shootId) return;
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/shoots/${shootId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      
      if (res.ok) {
        const json = await res.json();
        const shootData = json.data || json;
        setShoot(shootData);
      }
    } catch (error) {
      console.error('Error refreshing shoot:', error);
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      'booked': { label: 'Booked', className: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
      'raw_uploaded': { label: 'Raw uploaded', className: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
      'editing': { label: 'Editing', className: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
      'in_review': { label: 'In review', className: 'bg-orange-500/10 text-orange-500 border-orange-500/20' },
      'ready': { label: 'Ready', className: 'bg-green-500/10 text-green-500 border-green-500/20' },
      'delivered': { label: 'Delivered', className: 'bg-green-600/10 text-green-600 border-green-600/20' },
      'scheduled': { label: 'Scheduled', className: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
      'completed': { label: 'Completed', className: 'bg-green-500/10 text-green-500 border-green-500/20' },
    };
    
    const statusInfo = statusMap[status.toLowerCase()] || { label: status, className: 'bg-gray-500/10 text-gray-500 border-gray-500/20' };
    return <Badge className={statusInfo.className}>{statusInfo.label}</Badge>;
  };

  // Get weather badge
  const getWeatherBadge = () => {
    const weatherData = weather || shoot?.weather;
    if (!weatherData && !shoot?.weather?.temperature && !(shoot as any).temperature) return null;
    
    // Use same unified fallback logic as dashboard
    const temperature = weather?.temperature ?? shoot?.weather?.temperature ?? (shoot as any).temperature;
    const description = weather?.description;
    
    return (
      <Badge variant="outline" className="bg-sky-50 text-sky-700 border-sky-200">
        {temperature && `${temperature}°`}
        {description && ` • ${description}`}
      </Badge>
    );
  };

  // Send to editing handler
  const handleSendToEditing = async () => {
    if (!shoot) return;
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/shoots/${shoot.id}/send-to-editing`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ editor_id: shoot.editor?.id }),
      });
      
      if (!res.ok) throw new Error('Failed to send to editing');
      
      // Update status to 'editing'
      try {
        await fetch(`${API_BASE_URL}/api/shoots/${shoot.id}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({ status: 'editing', workflowStatus: 'editing' }),
        });
      } catch (statusError) {
        console.error('Failed to update status:', statusError);
      }
      
      toast({
        title: 'Success',
        description: 'Shoot sent to editing',
      });
      refreshShoot();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send to editing',
        variant: 'destructive',
      });
    }
  };

  // Mark complete handler
  const handleFinalise = async () => {
    if (!shoot) return;
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/shoots/${shoot.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ status: 'delivered', workflowStatus: 'delivered' }),
      });
      
      if (!res.ok) throw new Error('Failed to finalise shoot');
      
      toast({
        title: 'Success',
        description: 'Shoot finalised and moved to delivery stage',
      });
      refreshShoot();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to finalise shoot',
        variant: 'destructive',
      });
    }
  };

  const handleProcessPayment = () => {
    // Debug logging to check payment data
    console.log('Payment Debug:', {
      shoot: !!shoot,
      shootId: shoot?.id,
      payment: shoot?.payment,
      totalQuote: shoot?.payment?.totalQuote,
      totalPaid: shoot?.payment?.totalPaid,
      amountDue: amountDue,
      amountDueCondition: amountDue > 0
    });
    
    setIsPaymentDialogOpen(true);
  };

  const handlePaymentSuccess = (payment: any) => {
    toast({
      title: 'Payment Successful',
      description: 'Payment has been processed successfully.',
    });
    refreshShoot(); // Reload shoot data to update payment status
  };

  const amountDue = shoot ? (shoot.payment?.totalQuote || 0) - (shoot.payment?.totalPaid || 0) : 0;

  // Full page path
  const fullPagePath = useMemo(() => {
    if (!shoot?.id) return null;
    const parsedId = Number(shoot.id);
    return Number.isFinite(parsedId) ? `/shoots/${parsedId}` : null;
  }, [shoot?.id]);

  // Determine visible tabs based on role (excluding media which is always in right pane)
  const visibleTabs = useMemo(() => {
    const tabs = [];
    tabs.push({ id: 'overview', label: 'Overview' });
    tabs.push({ id: 'notes', label: 'Notes' });
    
    // Issues tab - visible to all but with different permissions
    tabs.push({ id: 'issues', label: 'Issues' });
    
    // Tours tab - admin only
    if (isAdmin) {
      tabs.push({ id: 'settings', label: 'Tours' });
    }
    
    return tabs;
  }, [isAdmin]);

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh]">
          <div className="flex items-center justify-center p-8">
            <div className="text-muted-foreground">Loading shoot details...</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!shoot) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh]">
          <div className="flex items-center justify-center p-8">
            <div className="text-muted-foreground">Shoot not found</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-full max-h-[98vh] h-auto sm:max-h-[95vh] sm:h-[95vh] overflow-y-auto flex flex-col p-0">
        {/* Action buttons - Top right: Send to editing, Finalise, View full page (before close) - Desktop only */}
        <div className="hidden sm:flex absolute top-4 z-[60] items-center gap-1.5 right-14">
          {isAdmin && (
            <>
              <Button
                variant="default"
                size="sm"
                className="h-7 text-xs px-3 bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950 dark:hover:bg-purple-900 dark:text-purple-300 dark:border-purple-800"
                onClick={handleSendToEditing}
              >
                <Send className="h-3 w-3 mr-1" />
                <span>Send to editing</span>
              </Button>
              <Button
                variant="default"
                size="sm"
                className="h-7 text-xs px-3 bg-green-50 hover:bg-green-100 text-green-700 border-green-200 dark:bg-green-950 dark:hover:bg-green-900 dark:text-green-300 dark:border-green-800"
                onClick={handleFinalise}
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                <span>Finalise</span>
              </Button>
            </>
          )}
          {fullPagePath && (
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs px-3"
              onClick={() => {
                onClose();
                navigate(fullPagePath);
              }}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              <span>View full page</span>
            </Button>
          )}
        </div>
        
        {/* Mobile: View full page button - Top right before close button */}
        {fullPagePath && (
          <div className="sm:hidden absolute top-3 right-12 z-[60]">
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs px-2.5"
              onClick={() => {
                onClose();
                navigate(fullPagePath);
              }}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              <span className="hidden xs:inline">View full page</span>
              <span className="xs:hidden">View</span>
            </Button>
          </div>
        )}
        
        {/* Header */}
        <DialogHeader className="px-3 sm:px-4 pt-3 sm:pt-4 pb-2 sm:pb-3 border-b flex-shrink-0">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-2 sm:gap-4">
            <div className="flex-1 min-w-0 w-full sm:w-auto">
              {/* "Shoot details" label - Left aligned on mobile */}
              <div className="text-xs sm:text-sm text-primary mb-1.5 sm:mb-2 font-medium text-left">
                Shoot details
              </div>
              
              {/* Main Title - Location/Address with Status Badge inline */}
              <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2 flex-wrap">
                <DialogTitle className="text-base sm:text-lg font-bold truncate text-left">
                  {shoot.location?.address || shoot.location?.fullAddress || 'Shoot Details'}
                </DialogTitle>
                <div className="flex-shrink-0">
                  {getStatusBadge(shoot.status || shoot.workflowStatus || 'booked')}
                </div>
              </div>
              
              {/* Client Only - Left aligned on mobile */}
              {shoot.client?.name && (
                <div className="text-xs sm:text-sm text-muted-foreground text-left">
                  <span className="font-medium">Client :</span> {shoot.client.name}
                  {shoot.client.company && (
                    <span className="hidden sm:inline"> • {shoot.client.company}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* Split Pane Layout - Stack on mobile, expandable media */}
        <div className={`flex flex-col sm:flex-row overflow-hidden pb-20 sm:pb-0 ${isMediaExpanded ? 'min-h-[70vh]' : 'min-h-[50vh]'} sm:flex-1 sm:min-h-0`}>
          {/* Left Pane - Full width on mobile, 40% on desktop */}
          <div className={`w-full sm:w-[40%] border-r sm:border-r border-b sm:border-b-0 flex flex-col ${isMediaExpanded ? 'min-h-[35vh]' : 'flex-1'} sm:min-h-0 overflow-hidden bg-muted/30 flex-1 sm:flex-none`}>
            {/* Tab Navigation */}
            <div className="px-2 sm:px-4 py-1.5 sm:py-2 border-b bg-background flex-shrink-0 overflow-x-auto">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full justify-start h-7 sm:h-8 bg-transparent p-0 min-w-max sm:min-w-0">
                  {visibleTabs.filter(tab => tab.id !== 'media').map(tab => (
                    <TabsTrigger 
                      key={tab.id} 
                      value={tab.id} 
                      className="text-[11px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 h-7 sm:h-8 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:rounded-none whitespace-nowrap"
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            {/* Main Content Area - Independent scrolling */}
            <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-2 sm:px-4 py-2 sm:py-2.5">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsContent value="overview" className="mt-0">
                  <ShootDetailsOverviewTab
                    shoot={shoot}
                    isAdmin={isAdmin}
                    isPhotographer={isPhotographer}
                    isEditor={isEditor}
                    isClient={isClient}
                    role={currentUserRole}
                    onShootUpdate={refreshShoot}
                    weather={weather || null}
                  />
                </TabsContent>

                <TabsContent value="notes" className="mt-0">
                  <ShootDetailsNotesTab
                    shoot={shoot}
                    isAdmin={isAdmin}
                    isPhotographer={isPhotographer}
                    isEditor={isEditor}
                    role={currentUserRole}
                    onShootUpdate={refreshShoot}
                  />
                </TabsContent>

                <TabsContent value="issues" className="mt-0">
                  <ShootDetailsIssuesTab
                    shoot={shoot}
                    isAdmin={isAdmin}
                    isPhotographer={isPhotographer}
                    isEditor={isEditor}
                    isClient={isClient}
                    role={currentUserRole}
                    onShootUpdate={refreshShoot}
                  />
                </TabsContent>

                {isAdmin && (
                  <TabsContent value="settings" className="mt-0">
                    <ShootDetailsSettingsTab
                      shoot={shoot}
                      isAdmin={isAdmin}
                      onShootUpdate={refreshShoot}
                    />
                  </TabsContent>
                )}
              </Tabs>
            </div>

            {/* Buttons Section at Bottom */}
            <div className="px-2 sm:px-4 py-1.5 sm:py-2 border-t bg-background flex-shrink-0 space-y-2">
              <ShootDetailsQuickActions
                shoot={shoot}
                isAdmin={isAdmin}
                isPhotographer={isPhotographer}
                isEditor={isEditor}
                isClient={isClient}
                role={currentUserRole}
                onShootUpdate={refreshShoot}
              />
              {/* Process Payment Button - Bottom of left pane (Desktop only) */}
              {isAdmin && (
                <Button
                  variant="default"
                  size="sm"
                  className="hidden sm:flex w-full h-8 text-xs px-3 bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950 dark:hover:bg-orange-900 dark:text-orange-300 dark:border-orange-800"
                  onClick={handleProcessPayment}
                >
                  <DollarSignIcon className="h-3.5 w-3.5 mr-1.5" />
                  <span>Process payment</span>
                </Button>
              )}
            </div>
          </div>

          {/* Right Pane - Full width on mobile, 60% on desktop - Media Tab Always Visible, Expandable */}
          <div className={`w-full sm:w-[60%] flex flex-col ${isMediaExpanded ? 'fixed inset-x-0 bottom-0 top-[7.5rem] sm:relative sm:inset-auto sm:top-auto sm:bottom-auto flex-1' : 'h-auto max-h-[12vh] overflow-hidden'} sm:min-h-0 sm:flex-1 sm:max-h-none transition-all duration-300 flex-1 sm:flex-none bg-background border-t sm:border-t-0 z-40 sm:z-auto shadow-lg sm:shadow-none`}>
            <div className={`flex-1 min-h-0 flex flex-col overflow-hidden px-2 sm:px-3 py-1.5 sm:py-2 ${!isMediaExpanded ? 'overflow-hidden' : ''}`}>
              <ShootDetailsMediaTab
                shoot={shoot}
                isAdmin={isAdmin}
                isPhotographer={isPhotographer}
                isEditor={isEditor}
                isClient={isClient}
                role={currentUserRole}
                onShootUpdate={refreshShoot}
                isExpanded={isMediaExpanded}
                onToggleExpand={() => setIsMediaExpanded(!isMediaExpanded)}
              />
            </div>
          </div>
        </div>
        
        {/* Bottom Overlay Buttons - Mobile only */}
        {isAdmin && (
          <div className="fixed sm:hidden bottom-0 left-0 right-0 bg-background border-t shadow-lg z-50 px-3 py-2 space-y-2">
            {/* Admin-only actions */}
            {/* Send to editing and Finalise - One line */}
            <div className="flex gap-2">
              <Button
                variant="default"
                size="sm"
                className="flex-1 h-8 text-xs px-3 bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950 dark:hover:bg-purple-900 dark:text-purple-300 dark:border-purple-800"
                onClick={handleSendToEditing}
              >
                <Send className="h-3.5 w-3.5 mr-1.5" />
                <span>Send to editing</span>
              </Button>
              <Button
                variant="default"
                size="sm"
                className="flex-1 h-8 text-xs px-3 bg-green-50 hover:bg-green-100 text-green-700 border-green-200 dark:bg-green-950 dark:hover:bg-green-900 dark:text-green-300 dark:border-green-800"
                onClick={handleFinalise}
              >
                <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                <span>Finalise</span>
              </Button>
            </div>
            {/* Process payment - Full width */}
            <Button
              variant="default"
              size="sm"
              className="w-full h-9 text-xs px-3 bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950 dark:hover:bg-orange-900 dark:text-orange-300 dark:border-orange-800"
              onClick={handleProcessPayment}
            >
              <DollarSignIcon className="h-3.5 w-3.5 mr-1.5" />
              <span>Process payment</span>
            </Button>
          </div>
        )}
      </DialogContent>

      {shoot && (
        <SquarePaymentDialog
          isOpen={isPaymentDialogOpen}
          onClose={() => setIsPaymentDialogOpen(false)}
          amount={amountDue || 100} // Default to $100 if amountDue is 0
          shootId={shoot.id}
          shootAddress={shoot.location?.fullAddress || shoot.location?.address}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </Dialog>
  );
}

