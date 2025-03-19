
export interface ShootData {
  id: string;
  scheduled: string;
  completed?: string;
  client: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    totalShoots?: number;
  };
  address: {
    street: string;
    street2?: string;
    city: string;
    state: string;
    zip: string;
    fullAddress: string;
  };
  photographer: {
    name: string;
    avatar?: string;
  };
  services: string[];
  pricing: {
    baseQuote: number;
    tax: number;
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
  };
  createdBy?: string;
  status: 'scheduled' | 'completed' | 'pending' | 'cancelled';
}

export const shootsData: ShootData[] = [
  {
    id: "001",
    scheduled: "3/10/2025",
    client: {
      name: "Dave Cornelius",
      email: "dhcornelius@gmail.com",
      totalShoots: 1
    },
    address: {
      street: "3520 Tyler Street",
      city: "Falls Church",
      state: "VA",
      zip: "22041",
      fullAddress: "3520 Tyler Street, Falls Church, VA 22041"
    },
    photographer: {
      name: "Jay Snap"
    },
    services: ["HDR Photos"],
    pricing: {
      baseQuote: 275.00,
      tax: 6.00,
      taxAmount: 16.50,
      totalQuote: 291.50,
      totalPaid: 291.50,
      lastPaymentDate: "2/3/2025",
      lastPaymentType: "Square Online"
    },
    createdBy: "KC Real Estate Group",
    status: "scheduled"
  },
  {
    id: "002",
    scheduled: "3/3/2025",
    client: {
      name: "Marney Kirk",
      email: "marney@realtormarney.com",
      phone: "(410) 493-4884",
      totalShoots: 4
    },
    address: {
      street: "4 Salthill Court",
      city: "Timonium",
      state: "MD",
      zip: "21093",
      fullAddress: "4 Salthill Court, Timonium, MD 21093"
    },
    photographer: {
      name: "Nate Gregorio"
    },
    services: ["25 HDR Photo + Walkthough Video"],
    pricing: {
      baseQuote: 250.00,
      tax: 6.00,
      taxAmount: 15.00,
      totalQuote: 265.00
    },
    createdBy: "Michael Bereson",
    status: "scheduled"
  },
  {
    id: "003",
    scheduled: "2/28/2025",
    client: {
      name: "Mimma Andriuolo",
      email: "mandriuoloweichert@gmail.com",
      phone: "(201) 819-8128",
      company: "Weichert Realtors, Ridgewood",
      totalShoots: 4
    },
    address: {
      street: "869 High Mountain Road",
      city: "Franklin Lakes",
      state: "NJ",
      zip: "7417",
      fullAddress: "869 High Mountain Road, Franklin Lakes, NJ 07417"
    },
    photographer: {
      name: "Lee Tomassetti"
    },
    services: ["Just Drone Photos Package", "2D Floor plans", "HDR Photos + Video"],
    pricing: {
      baseQuote: 700.00,
      tax: 0.00,
      taxAmount: 0,
      totalQuote: 700.00
    },
    createdBy: "Bill Hang",
    status: "scheduled"
  },
  {
    id: "004",
    scheduled: "2/18/2025",
    client: {
      name: "Yvonne Lee",
      email: "yvonnetlee@hotmail.com",
      phone: "(301) 613-6070",
      company: "Keller Williams Capital Properties",
      totalShoots: 43
    },
    address: {
      street: "14905 Taryn Lea Court",
      city: "Accokeek",
      state: "MD",
      zip: "20607",
      fullAddress: "14905 Taryn Lea Court, Accokeek, MD 20607"
    },
    photographer: {
      name: "KK - Kumnith Keo"
    },
    services: ["10 Exterior HDR Photos"],
    pricing: {
      baseQuote: 100.00,
      tax: 6.00,
      taxAmount: 6.00,
      totalQuote: 106.00
    },
    createdBy: "Michael Bereson",
    status: "scheduled"
  },
  {
    id: "005",
    scheduled: "2/14/2025",
    client: {
      name: "KC Real Estate Group",
      email: "kate@c21nm.com",
      company: "Century 21 New Mellinium",
      totalShoots: 35
    },
    address: {
      street: "6317 Tilden Lane",
      city: "Rockville",
      state: "MD",
      zip: "20852",
      fullAddress: "6317 Tilden Lane, Rockville, MD 20852"
    },
    photographer: {
      name: "Jay Snap"
    },
    services: ["HDR Photo + iGuide"],
    pricing: {
      baseQuote: 575.00,
      tax: 6.00,
      taxAmount: 34.50,
      totalQuote: 609.50
    },
    createdBy: "Super Admin",
    status: "scheduled"
  },
  {
    id: "006",
    scheduled: "2/7/2025",
    completed: "2/8/2025",
    client: {
      name: "Carl Herber",
      email: "carl@herberhometeam.com",
      phone: "(443) 286-4099",
      company: "EXP Realty",
      totalShoots: 15
    },
    address: {
      street: "3519 Gough Street",
      city: "Baltimore",
      state: "MD",
      zip: "21224",
      fullAddress: "3519 Gough Street, Baltimore, MD 21224"
    },
    photographer: {
      name: "Nate Gregorio"
    },
    services: ["15 HDR -Rental Listings only"],
    pricing: {
      baseQuote: 145.00,
      tax: 6.00,
      taxAmount: 8.70,
      totalQuote: 153.70
    },
    createdBy: "Michael Bereson",
    status: "completed"
  },
  {
    id: "007",
    scheduled: "2/7/2025",
    completed: "2/8/2025",
    client: {
      name: "Gregory Gray",
      email: "gregorygray1@gmail.com",
      phone: "(443) 857-1191",
      totalShoots: 15
    },
    address: {
      street: "1041 Flester Lane",
      city: "Laurel",
      state: "MD",
      zip: "20707",
      fullAddress: "1041 Flester Lane, Laurel, MD 20707"
    },
    photographer: {
      name: "Delmar Harrod"
    },
    services: ["25 Flash Photos", "5 Flash Photos"],
    pricing: {
      baseQuote: 150.00,
      tax: 6.00,
      taxAmount: 9.00,
      totalQuote: 159.00
    },
    createdBy: "Michael Bereson",
    status: "completed"
  },
  {
    id: "008",
    scheduled: "2/7/2025",
    completed: "2/8/2025",
    client: {
      name: "Pitina Stucky De Juan",
      email: "pstucky1@psinternationalteam.com",
      phone: "(410) 900-7436",
      totalShoots: 8
    },
    address: {
      street: "215 Regester Avenue",
      city: "Baltimore",
      state: "MD",
      zip: "21212",
      fullAddress: "215 Regester Avenue, Baltimore, MD 21212"
    },
    photographer: {
      name: "Harrison Hart"
    },
    services: ["HDR Photos"],
    pricing: {
      baseQuote: 199.00,
      tax: 6.00,
      taxAmount: 11.94,
      totalQuote: 210.94,
      totalPaid: 210.94,
      lastPaymentDate: "1/28/2025",
      lastPaymentType: "Square Online"
    },
    createdBy: "Michael Bereson",
    status: "completed"
  },
  {
    id: "009",
    scheduled: "2/7/2025",
    completed: "2/8/2025",
    client: {
      name: "Jocelyn Dulany",
      email: "Jocelyn@justvybe.com",
      phone: "(410) 693-4242",
      totalShoots: 87
    },
    address: {
      street: "2110 Saint Paul Street",
      city: "Baltimore",
      state: "MD",
      zip: "21218",
      fullAddress: "2110 Saint Paul Street, Baltimore, MD 21218"
    },
    photographer: {
      name: "Nate Gregorio"
    },
    services: ["30 HDR Photos + 2D Floor Plans*"],
    pricing: {
      baseQuote: 256.50,
      tax: 6.00,
      taxAmount: 15.39,
      totalQuote: 271.89
    },
    createdBy: "Michael Bereson",
    status: "completed"
  },
  {
    id: "010",
    scheduled: "2/7/2025",
    completed: "2/8/2025",
    client: {
      name: "Michael Giangiordano",
      email: "mgiangiordano1016@gmail.com",
      phone: "(267) 688-1449",
      company: "Century 21 Forrester Real Estate",
      totalShoots: 44
    },
    address: {
      street: "1208 Tasker Street",
      city: "Philadelphia",
      state: "PA",
      zip: "19148",
      fullAddress: "1208 Tasker Street, Philadelphia, PA 19148"
    },
    photographer: {
      name: "Lee Tomassetti"
    },
    services: ["45 HDR Photos"],
    pricing: {
      baseQuote: 275.00,
      tax: 0.00,
      taxAmount: 0,
      totalQuote: 275.00
    },
    createdBy: "Bill Hang",
    status: "completed"
  },
  {
    id: "011",
    scheduled: "2/5/2025",
    completed: "2/6/2025",
    client: {
      name: "Tina Beliveau",
      email: "melissa@thebeliveaugroup.com",
      phone: "(443) 595-7535",
      totalShoots: 35
    },
    address: {
      street: "10559 Gateridge Road",
      city: "Cockeysville",
      state: "MD",
      zip: "21030",
      fullAddress: "10559 Gateridge Road, Cockeysville, MD 21030"
    },
    photographer: {
      name: "Harrison Hart"
    },
    services: ["25 Flash Photos"],
    pricing: {
      baseQuote: 125.00,
      tax: 6.00,
      taxAmount: 7.50,
      totalQuote: 132.50,
      totalPaid: 132.50,
      lastPaymentDate: "2/6/2025",
      lastPaymentType: "Square Online"
    },
    createdBy: "Michael Bereson",
    status: "completed"
  },
  {
    id: "012",
    scheduled: "2/5/2025",
    completed: "2/6/2025",
    client: {
      name: "KC Real Estate Group",
      email: "kate@c21nm.com",
      company: "Century 21 New Mellinium",
      totalShoots: 35
    },
    address: {
      street: "4 Monroe Street",
      street2: "705",
      city: "Rockville",
      state: "MD",
      zip: "20850",
      fullAddress: "4 Monroe Street, 705, Rockville, MD 20850"
    },
    photographer: {
      name: "Jay Snap"
    },
    services: ["35 HDR Photos"],
    pricing: {
      baseQuote: 149.00,
      tax: 0.00,
      taxAmount: 0,
      totalQuote: 149.00,
      totalPaid: 149.00,
      lastPaymentDate: "2/6/2025",
      lastPaymentType: "Square Online"
    },
    createdBy: "Super Admin",
    status: "completed"
  }
];
