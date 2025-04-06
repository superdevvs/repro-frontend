
import { ShootData } from "@/types/shoots";

export const shootsData: ShootData[] = [
  {
    id: "1",
    scheduledDate: "2025-03-10",
    client: {
      name: "Dave Cornelius",
      email: "dhcornelius@gmail.com",
      totalShoots: 1
    },
    location: {
      address: "3520 Tyler Street",
      city: "Falls Church",
      state: "VA",
      zip: "22041",
      fullAddress: "3520 Tyler Street, Falls Church, VA 22041"
    },
    photographer: {
      name: "Jay Snap",
    },
    services: ["HDR Photos"],
    payment: {
      baseQuote: 275.00,
      taxRate: 6.00,
      taxAmount: 16.50,
      totalQuote: 291.50,
      totalPaid: 291.50,
      lastPaymentDate: "2025-02-03",
      lastPaymentType: "Square Online"
    },
    status: "scheduled",
    createdBy: "KC Real Estate Group"
  },
  {
    id: "2",
    scheduledDate: "2025-03-03",
    client: {
      name: "Marney Kirk",
      email: "marney@realtormarney.com",
      phone: "(410) 493-4884",
      totalShoots: 4
    },
    location: {
      address: "4 Salthill Court",
      city: "Timonium",
      state: "MD",
      zip: "21093",
      fullAddress: "4 Salthill Court, Timonium, MD 21093"
    },
    photographer: {
      name: "Nate Gregorio",
    },
    services: ["25 HDR Photo + Walkthough Video"],
    payment: {
      baseQuote: 250.00,
      taxRate: 6.00,
      taxAmount: 15.00,
      totalQuote: 265.00
    },
    status: "scheduled",
    createdBy: "Michael Bereson"
  },
  {
    id: "3",
    scheduledDate: "2025-02-28",
    client: {
      name: "Mimma Andriuolo",
      email: "mandriuoloweichert@gmail.com",
      phone: "(201) 819-8128",
      company: "Weichert Realtors, Ridgewood",
      totalShoots: 4
    },
    location: {
      address: "869 High Mountain Road",
      city: "Franklin Lakes",
      state: "NJ",
      zip: "7417",
      fullAddress: "869 High Mountain Road, Franklin Lakes, NJ 07417"
    },
    photographer: {
      name: "Lee Tomassetti",
    },
    services: ["Just Drone Photos Package", "2D Floor plans", "HDR Photos + Video"],
    payment: {
      baseQuote: 700.00,
      taxRate: 0.00,
      taxAmount: 0,
      totalQuote: 700.00
    },
    status: "scheduled",
    createdBy: "Bill Hang"
  },
  {
    id: "4",
    scheduledDate: "2025-02-07",
    completedDate: "2025-02-08",
    client: {
      name: "Carl Herber",
      email: "carl@herberhometeam.com",
      phone: "(443) 286-4099",
      company: "EXP Realty",
      totalShoots: 15
    },
    location: {
      address: "3519 Gough Street",
      city: "Baltimore",
      state: "MD",
      zip: "21224",
      fullAddress: "3519 Gough Street, Baltimore, MD 21224"
    },
    photographer: {
      name: "Nate Gregorio",
    },
    services: ["15 HDR -Rental Listings only"],
    payment: {
      baseQuote: 145.00,
      taxRate: 6.00,
      taxAmount: 8.70,
      totalQuote: 153.70
    },
    status: "completed",
    createdBy: "Michael Bereson"
  },
  {
    id: "5",
    scheduledDate: "2025-02-07",
    completedDate: "2025-02-08",
    client: {
      name: "Gregory Gray",
      email: "gregorygray1@gmail.com",
      phone: "(443) 857-1191",
      totalShoots: 15
    },
    location: {
      address: "1041 Flester Lane",
      city: "Laurel",
      state: "MD",
      zip: "20707",
      fullAddress: "1041 Flester Lane, Laurel, MD 20707"
    },
    photographer: {
      name: "Delmar Harrod",
    },
    services: ["25 Flash Photos", "5 Flash Photos"],
    payment: {
      baseQuote: 150.00,
      taxRate: 6.00,
      taxAmount: 9.00,
      totalQuote: 159.00
    },
    status: "completed",
    createdBy: "Michael Bereson"
  },
  {
    id: "6",
    scheduledDate: "2025-02-07",
    completedDate: "2025-02-08",
    client: {
      name: "Pitina Stucky De Juan",
      email: "pstucky1@psinternationalteam.com",
      phone: "(410) 900-7436",
      totalShoots: 8
    },
    location: {
      address: "215 Regester Avenue",
      city: "Baltimore",
      state: "MD",
      zip: "21212",
      fullAddress: "215 Regester Avenue, Baltimore, MD 21212"
    },
    photographer: {
      name: "Harrison Hart",
    },
    services: ["HDR Photos"],
    payment: {
      baseQuote: 199.00,
      taxRate: 6.00,
      taxAmount: 11.94,
      totalQuote: 210.94,
      totalPaid: 210.94,
      lastPaymentDate: "2025-01-28",
      lastPaymentType: "Square Online"
    },
    status: "completed",
    createdBy: "Michael Bereson"
  },
  {
    id: "7",
    scheduledDate: "2025-02-04",
    client: {
      name: "Ajay Khetarpal",
      email: "ajk@maxxum.org",
      phone: "(301) 310-1280",
      company: "Maxxum Real Estate",
      totalShoots: 16
    },
    location: {
      address: "2277 Lewis Avenue",
      city: "Rockville",
      state: "MD",
      zip: "20851",
      fullAddress: "2277 Lewis Avenue, Rockville, MD 20851"
    },
    photographer: {
      name: "Jay Snap",
    },
    services: [],
    payment: {
      baseQuote: 0,
      taxRate: 6.00,
      taxAmount: 0,
      totalQuote: 0
    },
    status: "pending",
    createdBy: "Super Admin"
  },
  {
    id: "8",
    scheduledDate: "2025-01-31",
    completedDate: "2025-02-01",
    client: {
      name: "Jocelyn Dulany",
      email: "Jocelyn@justvybe.com",
      phone: "(410) 693-4242",
      totalShoots: 87
    },
    location: {
      address: "3167 Kessler Road",
      city: "Halethorpe",
      state: "MD",
      zip: "21227",
      fullAddress: "3167 Kessler Road, Halethorpe, MD 21227"
    },
    photographer: {
      name: "Harrison Hart",
    },
    services: ["25 HDR Photos"],
    payment: {
      baseQuote: 166.25,
      taxRate: 6.00,
      taxAmount: 9.98,
      totalQuote: 176.23,
      totalPaid: 176.23,
      lastPaymentDate: "2025-01-31",
      lastPaymentType: "Square Online"
    },
    status: "completed",
    media: {
      photos: [
        "/placeholder.svg",
        "/placeholder.svg",
        "/placeholder.svg",
        "/placeholder.svg",
        "/placeholder.svg"
      ]
    },
    tourLinks: {
      branded: "https://example.com/tour/branded/8",
      mls: "https://example.com/tour/mls/8",
      genericMls: "https://example.com/tour/generic/8"
    },
    createdBy: "Michael Bereson"
  }
];

// Helper functions to work with the data
export const getShootById = (id: string): ShootData | undefined => {
  return shootsData.find(shoot => shoot.id === id);
};

export const getShootsByStatus = (status: ShootData['status']): ShootData[] => {
  return shootsData.filter(shoot => shoot.status === status);
};

export const getShootsByPhotographer = (photographerName: string): ShootData[] => {
  return shootsData.filter(shoot => shoot.photographer.name === photographerName);
};

export const getShootsByClient = (clientName: string): ShootData[] => {
  return shootsData.filter(shoot => shoot.client.name === clientName);
};

export const getShootsByDateRange = (startDate: Date, endDate: Date): ShootData[] => {
  return shootsData.filter(shoot => {
    const shootDate = new Date(shoot.scheduledDate);
    return shootDate >= startDate && shootDate <= endDate;
  });
};

export const getTotalRevenue = (): number => {
  return shootsData.reduce((total, shoot) => total + (shoot.payment.totalPaid || 0), 0);
};

export const getTotalShoots = (): number => {
  return shootsData.length;
};

export const getUniquePaidClients = (): number => {
  const paidClients = new Set(
    shootsData
      .filter(shoot => shoot.payment.totalPaid && shoot.payment.totalPaid > 0)
      .map(shoot => shoot.client.name)
  );
  return paidClients.size;
};

export const getUniquePhotographers = (): string[] => {
  const photographers = new Set(shootsData.map(shoot => shoot.photographer.name));
  return Array.from(photographers);
};

export const getUniqueClients = (): string[] => {
  const clients = new Set(shootsData.map(shoot => shoot.client.name));
  return Array.from(clients);
};
