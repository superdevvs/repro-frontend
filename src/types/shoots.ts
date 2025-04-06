
import { ReactNode } from 'react';

export type ShootStatus = 'scheduled' | 'completed' | 'in-progress' | 'cancelled' | 'pending' | 'hold' | 'booked';
export type TimeRange = 'today' | 'day' | 'week' | 'month' | 'year' | 'all';

export interface MediaItem {
  id: string;
  url: string;
  name?: string;
  type?: string;
  approved?: boolean;
}

export interface Client {
  id?: string; // Make id optional to fix existing data
  name: string;
  email: string;
  phone?: string;
  company?: string;
  totalShoots?: number;
}

export interface Photographer {
  id?: string; // Make id optional to fix existing data
  name: string;
  email?: string; // Make email optional to fix existing data
  avatar?: string;
  phone?: string;
  rate?: number;
}

export interface Location {
  address: string;
  address2?: string; 
  city?: string;
  state?: string;
  zipCode?: string;
  zip?: string; // Some components use zipCode, others use zip
  fullAddress?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Payment {
  totalPaid: number;
  invoiceId?: string;
  status?: 'paid' | 'pending' | 'overdue';
  date?: string;
  baseQuote?: number;
  taxRate?: number;
  taxAmount?: number;
  totalQuote?: number;
  lastPaymentDate?: string;
  lastPaymentType?: string;
}

export interface ShootMedia {
  photos?: MediaItem[];
  videos?: MediaItem[];
  floorplans?: MediaItem[];
  slideshows?: MediaItem[];
  documents?: MediaItem[];
}

export interface Notes {
  shootNotes?: string;
  photographerNotes?: string;
  companyNotes?: string;
  editingNotes?: string;
}

export interface TourLinks {
  branded?: string;
  mls?: string;
  genericMls?: string;
}

export interface ShootData {
  id: string;
  client: Client;
  photographer?: Photographer;
  scheduledDate: string | Date;
  completedDate?: string | Date;
  status: ShootStatus;
  location: Location;
  payment: Payment;
  media?: ShootMedia;
  notes?: Notes | string;
  createdAt?: string;
  updatedAt?: string;
  time?: string;
  services?: string[];
  tourLinks?: TourLinks;
  tourPurchased?: boolean;
  createdBy?: string;
}

// Context type definition
export interface ShootsContextType {
  shoots: ShootData[];
  loading: boolean;
  error: Error | null;
  addShoot: (shoot: ShootData) => void;
  updateShoot: (id: string | number, updates: Partial<ShootData>) => void;
  deleteShoot: (id: string | number) => void;
  getUniquePhotographers: () => any[];
  getUniqueEditors: () => any[];
  getUniqueClients: () => any[];
  getClientShootsByStatus: (status: string) => ShootData[];
}

// Component Props Types
export interface DashboardHeaderProps {
  isAdmin: boolean;
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
}

export interface StatsCardGridProps {
  showRevenue: boolean;
  showClientStats: boolean;
  showPhotographerInterface: boolean;
  shoots: ShootData[];
  timeRange: TimeRange;
}

export interface UpcomingShootsProps {
  shoots: ShootData[];
  timeRange?: TimeRange;
}

export interface RevenueOverviewProps {
  shoots: ShootData[];
  timeRange: TimeRange;
}

export interface CalendarSectionProps {
  shoots: ShootData[];
  timeRange?: TimeRange;
}

export interface CalendarProps {
  shoots: ShootData[];
  className?: string;
  height?: number;
  onDateSelect?: (date: Date | undefined) => void;
}

export interface ShootsFilterProps {
  selectedRange: TimeRange;
  onChange: (range: TimeRange) => void;
}

export interface PhotographerAvailability {
  id?: string;
  photographerId: string;
  photographerName: string;
  date: Date;
  startTime?: string;
  endTime?: string;
  slots?: {
    date: string;
    times: string[];
  }[];
}

export interface ClientStatsProps {
  totalClients: number;
  activeClients: number;
  inactiveClients: number;
  totalShoots: number;
}

// Helper function to ensure Notes object from string
export function ensureNotesObject(notes: Notes | string | undefined): Notes {
  if (typeof notes === 'string') {
    return { shootNotes: notes };
  }
  return notes || {};
}
