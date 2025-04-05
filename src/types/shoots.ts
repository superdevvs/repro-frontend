
import { ReactNode } from 'react';

export type ShootStatus = 'scheduled' | 'completed' | 'in-progress' | 'cancelled';
export type TimeRange = 'today' | 'day' | 'week' | 'month' | 'year' | 'all';

export interface MediaItem {
  id: string;
  url: string;
  name?: string;
  type?: string;
  approved?: boolean;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
}

export interface Photographer {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  rate?: number;
}

export interface Location {
  address: string;
  city?: string;
  state?: string;
  zipCode?: string;
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
}

export interface ShootMedia {
  photos?: MediaItem[];
  videos?: MediaItem[];
  floorplans?: MediaItem[];
  slideshows?: MediaItem[];
}

export interface ShootData {
  id: string;
  client: Client;
  photographer?: Photographer;
  scheduledDate: string | Date;
  status: ShootStatus;
  location?: Location;
  payment: Payment;
  media?: ShootMedia;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
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
