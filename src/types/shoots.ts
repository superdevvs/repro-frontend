
export interface ShootData {
  id: string | number;
  scheduledDate: string | Date;
  time?: string;
  status: 'scheduled' | 'pending' | 'completed' | 'hold';
  location: {
    address?: string;
    fullAddress?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  client: {
    id?: string | number;
    name?: string;
    email?: string;
    phone?: string;
  };
  photographer?: {
    id?: string | number;
    name?: string;
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
  };
  completedDate?: string;
  services?: string[];
}

export interface ShootsContextType {
  shoots: ShootData[];
  loading: boolean;
  error: Error | null;
  addShoot: (shoot: ShootData) => void;
  updateShoot: (id: string | number, updates: Partial<ShootData>) => void;
  deleteShoot: (id: string | number) => void;
}
