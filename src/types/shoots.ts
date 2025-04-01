
export interface ShootData {
  id: string;
  scheduledDate: string;
  completedDate?: string;
  time?: string;
  client: {
    id?: string;
    name: string;
    email: string;
    phone?: string;
    company?: string;
    totalShoots?: number;
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
  services: string[];
  payment: {
    baseQuote: number;
    taxRate: number;
    taxAmount: number;
    totalQuote: number;
    totalPaid?: number;
    lastPaymentDate?: string;
    lastPaymentType?: string;
  };
  tourPurchased?: boolean;
  notes?: {
    shootNotes?: string;
    photographerNotes?: string;
    companyNotes?: string;
    editingNotes?: string;
  };
  createdBy?: string;
  status: 'scheduled' | 'completed' | 'pending' | 'hold';
  media?: {
    photos?: string[];
    videos?: string[];
    floorplans?: string[];
    slideshows?: {
      id: string;
      title: string;
      url: string;
      visible: boolean;
    }[];
  };
  tourLinks?: {
    branded?: string;
    mls?: string;
    genericMls?: string;
  };
}

export interface PhotographerAvailability {
  id: string;
  photographerId: string;
  photographerName: string;
  date: Date;
  startTime: string;
  endTime: string;
}
