
export interface ShootData {
  id: string;
  scheduledDate: string;
  time: string;
  client: {
    name: string;
    email: string;
    company?: string;
    phone?: string;
    totalShoots: number;
  };
  location: {
    address: string;
    address2?: string;
    city: string;
    state: string;
    zip: string;
    fullAddress: string;
  };
  photographer: {
    id?: string;
    name: string;
    avatar?: string;
  };
  // Add editor information to the shoot data type
  editor?: {
    id?: string;
    name: string;
    avatar?: string;
  };
  services: string[];
  payment: {
    baseQuote: number;
    taxRate: number;
    taxAmount: number;
    totalQuote: number;
    totalPaid: number;
  };
  status: string;
  notes?: string;
  createdBy: string;
}
