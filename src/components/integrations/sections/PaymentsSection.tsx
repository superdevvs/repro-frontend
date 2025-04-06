
import React, { useState } from 'react';
import { IntegrationCard } from '../IntegrationCard';
import { CreditCardIcon, BanknoteIcon, WalletIcon } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export function PaymentsSection() {
  const [stripeEnabled, setStripeEnabled] = useState(false);
  const [squareEnabled, setSquareEnabled] = useState(true);
  const [paypalEnabled, setPaypalEnabled] = useState(false);
  const [splitPayments, setSplitPayments] = useState(true);
  
  const handleConnect = (service: string) => {
    toast({
      title: "Connecting to " + service,
      description: "Redirecting to authentication page...",
    });
  };
  
  const handleDisconnect = (service: string) => {
    toast({
      title: "Disconnected " + service,
      description: "The service has been disconnected successfully.",
    });
  };
  
  const handleConfigure = (service: string) => {
    toast({
      title: "Configure " + service,
      description: "Opening configuration options...",
    });
  };
  
  const handleSplitPayments = (enabled: boolean) => {
    setSplitPayments(enabled);
    toast({
      title: `Split Payments ${enabled ? 'Enabled' : 'Disabled'}`,
      description: `Photographers will ${enabled ? 'now' : 'no longer'} receive their share automatically.`,
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Payments</h2>
      
      <div className="space-y-3">
        <IntegrationCard
          title="Stripe"
          description="Process credit card payments"
          status="not_connected"
          icon={<CreditCardIcon className="h-4 w-4" />}
          onConnect={() => handleConnect('Stripe')}
        />
        
        <IntegrationCard
          title="Square"
          description="In-person and online payments"
          status="connected"
          icon={<BanknoteIcon className="h-4 w-4" />}
          toggleOption={{
            label: "Split Payments",
            enabled: splitPayments,
            onChange: handleSplitPayments
          }}
          onDisconnect={() => handleDisconnect('Square')}
          onConfigure={() => handleConfigure('Square')}
        />
        
        <IntegrationCard
          title="PayPal"
          description="Accept PayPal payments"
          status="not_connected"
          icon={<WalletIcon className="h-4 w-4" />}
          onConnect={() => handleConnect('PayPal')}
        />
      </div>
    </div>
  );
}
