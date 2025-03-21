
import React, { useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { CheckCircleIcon } from 'lucide-react';

interface ClientPropertyFormProps {
  client: string;
  setClient: (value: string) => void;
  address: string;
  setAddress: (value: string) => void;
  city: string;
  setCity: (value: string) => void;
  state: string;
  setState: (value: string) => void;
  zip: string;
  setZip: (value: string) => void;
  clients: Array<{ id: string; name: string; company?: string }>;
  selectedPackage: string;
  setSelectedPackage: (id: string) => void;
  packages: Array<{ id: string; name: string; description: string; price: number }>;
}

export function ClientPropertyForm({
  client,
  setClient,
  address,
  setAddress,
  city,
  setCity,
  state,
  setState,
  zip,
  setZip,
  clients,
  selectedPackage,
  setSelectedPackage,
  packages
}: ClientPropertyFormProps) {
  // Find the selected client's name for display
  const selectedClient = clients.find(c => c.id === client);
  const clientFromUrl = client !== '';

  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="client">Select Client</Label>
          {clientFromUrl ? (
            <div className="flex items-center mt-2 p-2 bg-primary/5 border border-primary/20 rounded-md">
              <span className="text-primary font-medium">{selectedClient?.name || 'Selected Client'}</span>
              {selectedClient?.company && (
                <span className="ml-2 text-sm text-muted-foreground">({selectedClient.company})</span>
              )}
            </div>
          ) : (
            <Select value={client} onValueChange={setClient}>
              <SelectTrigger>
                <SelectValue placeholder="Select a client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name} {c.company && `(${c.company})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        
        <div>
          <Label htmlFor="address">Property Address</Label>
          <Input
            id="address"
            placeholder="Street address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="state">State</Label>
            <Select value={state} onValueChange={setState}>
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MD">Maryland</SelectItem>
                <SelectItem value="VA">Virginia</SelectItem>
                <SelectItem value="DC">Washington DC</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <Label htmlFor="zip">ZIP Code</Label>
          <Input
            id="zip"
            placeholder="ZIP Code"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label>Select Package</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
          {packages.map((pkg) => (
            <Card
              key={pkg.id}
              className={`cursor-pointer transition-all ${
                selectedPackage === pkg.id 
                  ? 'border-primary/50 bg-primary/5' 
                  : 'hover:border-primary/30 hover:bg-primary/5'
              }`}
              onClick={() => setSelectedPackage(pkg.id)}
            >
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{pkg.name}</p>
                    <p className="text-sm text-muted-foreground">{pkg.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${pkg.price}</p>
                    {selectedPackage === pkg.id && (
                      <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center ml-auto">
                        <CheckCircleIcon className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
