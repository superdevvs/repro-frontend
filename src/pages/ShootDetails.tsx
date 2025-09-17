import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calendar, MapPin, User, DollarSign, CreditCard } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/components/auth";
import WorkflowDashboard from "@/components/WorkflowDashboard";
import axios from 'axios';

interface Shoot {
  id: number;
  client: {
    id: number;
    name: string;
    email: string;
  };
  photographer: {
    id: number;
    name: string;
    email: string;
  } | null;
  service: {
    id: number;
    name: string;
    description: string;
    price: number;
  };
  address: string;
  city: string;
  state: string;
  zip: string;
  scheduled_date: string;
  time: string;
  base_quote: number;
  tax_amount: number;
  total_quote: number;
  payment_status: string;
  status: string;
  workflow_status: string;
  notes?: string;
  created_at: string;
  total_paid: number;
  remaining_balance: number;
}

const ShootDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [shoot, setShoot] = useState<Shoot | null>(null);
  const [loading, setLoading] = useState(true);
  const [creatingPayment, setCreatingPayment] = useState(false);

  useEffect(() => {
    if (id) {
      fetchShootDetails();
    }
  }, [id]);

  const fetchShootDetails = async () => {
    try {
      const response = await axios.get(`/api/shoots/${id}`);
      setShoot(response.data.data);
    } catch (error) {
      console.error('Error fetching shoot details:', error);
      toast({
        title: "Error",
        description: "Failed to fetch shoot details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePaymentLink = async () => {
    if (!shoot) return;
    
    setCreatingPayment(true);
    try {
      const response = await axios.post(`/api/shoots/${shoot.id}/create-checkout-link`);
      
      // Open payment link in new window
      window.open(response.data.checkoutUrl, '_blank');
      
      toast({
        title: "Payment Link Created",
        description: "Payment window opened. Complete payment to update status.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to create payment link",
        variant: "destructive",
      });
    } finally {
      setCreatingPayment(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      booked: { label: 'Booked', variant: 'secondary' as const },
      cancelled: { label: 'Cancelled', variant: 'destructive' as const },
      completed: { label: 'Completed', variant: 'default' as const },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, variant: 'secondary' as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      paid: { label: 'Paid', variant: 'default' as const },
      unpaid: { label: 'Unpaid', variant: 'destructive' as const },
      partial: { label: 'Partial', variant: 'secondary' as const },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, variant: 'secondary' as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!shoot) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Shoot Not Found</h1>
          <Button onClick={() => navigate('/shoots')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shoots
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate('/shoots')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shoots
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Shoot #{shoot.id}</h1>
            <p className="text-muted-foreground">
              {new Date(shoot.scheduled_date).toLocaleDateString()} at {shoot.time}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusBadge(shoot.status)}
          {getPaymentStatusBadge(shoot.payment_status)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Shoot Information */}
        <div className="lg:col-span-1 space-y-6">
          {/* Basic Details */}
          <Card>
            <CardHeader>
              <CardTitle>Shoot Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">
                    {new Date(shoot.scheduled_date).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-muted-foreground">{shoot.time}</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  <div className="font-medium">{shoot.address}</div>
                  <div className="text-sm text-muted-foreground">
                    {shoot.city}, {shoot.state} {shoot.zip}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">Client: {shoot.client.name}</div>
                  <div className="text-sm text-muted-foreground">{shoot.client.email}</div>
                </div>
              </div>

              {shoot.photographer && (
                <div className="flex items-center space-x-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Photographer: {shoot.photographer.name}</div>
                    <div className="text-sm text-muted-foreground">{shoot.photographer.email}</div>
                  </div>
                </div>
              )}

              <Separator />

              <div>
                <div className="font-medium mb-2">Service</div>
                <div className="text-sm">
                  <div className="font-medium">{shoot.service.name}</div>
                  <div className="text-muted-foreground">{shoot.service.description}</div>
                </div>
              </div>

              {shoot.notes && (
                <>
                  <Separator />
                  <div>
                    <div className="font-medium mb-2">Notes</div>
                    <div className="text-sm text-muted-foreground">{shoot.notes}</div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4" />
                <span>Payment Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Base Quote:</span>
                <span>${shoot.base_quote.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${shoot.tax_amount.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total:</span>
                <span>${shoot.total_quote.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Paid:</span>
                <span className="text-green-600">${shoot.total_paid.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Remaining:</span>
                <span className={shoot.remaining_balance > 0 ? "text-red-600" : "text-green-600"}>
                  ${shoot.remaining_balance.toFixed(2)}
                </span>
              </div>

              {shoot.remaining_balance > 0 && (user?.role === 'admin' || user?.role === 'client') && (
                <Button 
                  className="w-full mt-4" 
                  onClick={handleCreatePaymentLink}
                  disabled={creatingPayment}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  {creatingPayment ? 'Creating...' : 'Pay Now'}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Workflow Dashboard */}
        <div className="lg:col-span-2">
          <WorkflowDashboard 
            shootId={shoot.id} 
            userRole={user?.role || 'client'} 
          />
        </div>
      </div>
    </div>
  );
};

export default ShootDetails;