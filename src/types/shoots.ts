
export interface ShootData {
  id: string;
  scheduledDate: string;
  time: string;  // Required field
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
    totalPaid: number;  // Making this required
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
    photos?: Array<string>; // Legacy format for backward compatibility
    slideshows?: Array<{
      id: string;
      title: string;
      url: string;
    }>;
  };
  tourLinks?: {
    matterport?: string;
    iGuide?: string;
    cubicasa?: string;
    branded?: string;
    mls?: string;
    genericMls?: string;
  };
  files?: {
    [key: string]: {
      id: string;
      filename: string;
      storedFilename: string;
      path: string;
      url: string;
      fileType: string;
      fileSize: number;
      formattedSize: string;
      uploadedBy: string;
      isImage: boolean;
      isVideo: boolean;
    };
  };
  tourPurchased?: boolean; // Add this field for ImportShootsDialog
}

// Update the PhotographerAvailability interface to include the required properties
export interface PhotographerAvailability {
  id: string;
  photographerId: string;
  photographerName?: string; // Add this field for compatibility
  date: string;
  timeSlots: {
    start: string;
    end: string;
    booked: boolean;
  }[];
  startTime?: string; // Add for backward compatibility
  endTime?: string;   // Add for backward compatibility
}
