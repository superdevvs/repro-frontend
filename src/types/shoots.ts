
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
    id?: string;
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
    lastPaymentDate?: string;
    lastPaymentType?: string;
  };
  status: string;
  notes?: string | {
    shootNotes?: string;
    photographerNotes?: string;
    companyNotes?: string;
    editingNotes?: string;
  };
  createdBy: string;
  completedDate?: string;
  media?: {
    images?: Array<{
      id: string;
      url: string;
      thumbnail?: string;
      type: string;
      approved?: boolean;
    }>;
    videos?: Array<{
      id: string;
      url: string;
      thumbnail?: string;
      type: string;
      approved?: boolean;
    }>;
    files?: Array<{
      id: string;
      url: string;
      name: string;
      type: string;
      size: number;
    }>;
  };
  tourLinks?: {
    matterport?: string;
    iGuide?: string;
    cubicasa?: string;
  };
}

// New interface for photographer availability
export interface PhotographerAvailability {
  id: string;
  photographerId: string;
  date: string;
  timeSlots: {
    start: string;
    end: string;
    booked: boolean;
  }[];
}
