
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';

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
  clients: Array<{ id: string; name: string }>;
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
  clients
}: ClientPropertyFormProps) {
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
          <Select value={client} onValueChange={setClient}>
            <SelectTrigger>
              <SelectValue placeholder="Select a client" />
            </SelectTrigger>
            <SelectContent>
              {clients.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
    </motion.div>
  );
}
