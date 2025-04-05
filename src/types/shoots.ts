
export interface ShootData {
  id: string | number;
  scheduledDate: string | Date;
  time?: string;
  status: 'scheduled' | 'pending' | 'completed' | 'hold' | 'booked';
  location: {
    address?: string;
    address2?: string;
    fullAddress?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    zip?: string; // For backward compatibility
  };
  client: {
    id?: string | number;
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
    totalShoots?: number;
  };
  photographer?: {
    id?: string | number;
    name?: string;
    avatar?: string;
  };
  notes?: {
    shootNotes?: string;
    photographerNotes?: string;
    companyNotes?: string;
    editingNotes?: string;
  };
  payment?: {
    totalPaid: number;
    status?: string;
    baseQuote?: number;
    taxRate?: number;
    taxAmount?: number;
    totalQuote?: number;
    lastPaymentDate?: string;
    lastPaymentType?: string;
  };
  completedDate?: string;
  services?: string[];
  media?: {
    photos?: string[];
    videos?: string[];
    floorplans?: string[];
  };
  tourLinks?: {
    branded?: string;
    mls?: string;
    genericMls?: string;
  };
  createdBy?: string;
}

export interface ShootsContextType {
  shoots: ShootData[];
  loading: boolean;
  error: Error | null;
  addShoot: (shoot: ShootData) => void;
  updateShoot: (id: string | number, updates: Partial<ShootData>) => void;
  deleteShoot: (id: string | number) => void;
  getUniquePhotographers?: () => { id: string; name: string }[];
  getUniqueEditors?: () => { id: string; name: string }[];
  getUniqueClients?: () => { id: string; name: string }[];
  getClientShootsByStatus?: (status: string) => ShootData[];
}

export interface PhotographerAvailability {
  photographerId: string;
  slots: Array<{
    date: string;
    times: string[];
  }>;
}
