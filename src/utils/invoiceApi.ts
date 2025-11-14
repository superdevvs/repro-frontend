import API_ROUTES from '@/lib/api';
import { InvoiceData } from './invoiceUtils';

export interface MarkInvoicePaidPayload {
  payment_method: string;
  paid_at?: string;
}

export type InvoiceValidationErrors =
  | string
  | string[]
  | Record<string, string[]>
  | null
  | undefined;

export class InvoiceApiError extends Error {
  status: number;
  details?: InvoiceValidationErrors;

  constructor(message: string, status: number, details?: InvoiceValidationErrors) {
    super(message);
    this.name = 'InvoiceApiError';
    this.status = status;
    this.details = details;
  }
}

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  'credit-card': 'Credit Card',
  'credit_card': 'Credit Card',
  'bank-transfer': 'Bank Transfer',
  'bank_transfer': 'Bank Transfer',
  'square-upi': 'Square UPI',
  'square_upi': 'Square UPI',
  cash: 'Cash',
};

const resolvePaymentMethod = (rawMethod?: string, fallback?: string) => {
  if (!rawMethod && fallback) return fallback;
  if (!rawMethod) return '';
  const normalized = rawMethod.toLowerCase();
  return PAYMENT_METHOD_LABELS[normalized] || PAYMENT_METHOD_LABELS[normalized.replace(/\s+/g, '-')]
    || rawMethod;
};

const normalizeInvoiceStatus = (status?: string, fallback?: string) => {
  if (!status && fallback) return fallback;
  if (!status) return 'pending';
  return status;
};

const coerceNumber = (value: unknown, fallback?: number) => {
  if (typeof value === 'number' && !Number.isNaN(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (!Number.isNaN(parsed)) return parsed;
  }
  return fallback ?? 0;
};

const coerceDateString = (value: unknown, fallback?: string) => {
  if (typeof value === 'string' && value.trim()) {
    return value;
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  return fallback ?? '';
};

const extractClientName = (raw: any, fallback?: string) => {
  if (!raw) return fallback ?? '';
  if (typeof raw === 'string') return raw;
  if (typeof raw === 'object') {
    if (typeof raw.name === 'string') return raw.name;
    if (typeof raw.client_name === 'string') return raw.client_name;
    if (typeof raw.company === 'string') return raw.company;
  }
  return fallback ?? '';
};

const extractServices = (raw: any, fallback?: string[]) => {
  if (Array.isArray(raw)) {
    return raw.map((service) => {
      if (typeof service === 'string') return service;
      if (service && typeof service === 'object') {
        return service.name || service.title || JSON.stringify(service);
      }
      return String(service);
    });
  }
  return fallback ?? [];
};

const getInvoicePayload = (json: any) => {
  if (json && typeof json === 'object') {
    if (json.data) return json.data;
    if (json.invoice) return json.invoice;
  }
  return json;
};

export const normalizeInvoiceFromApi = (raw: any, base?: InvoiceData): InvoiceData => {
  const id = String(raw?.id ?? raw?.invoice_id ?? base?.id ?? raw?.number ?? '');
  const number = String(raw?.number ?? base?.number ?? id);
  const amount = coerceNumber(raw?.amount ?? raw?.total ?? base?.amount ?? 0, base?.amount);
  const status = normalizeInvoiceStatus(raw?.status, base?.status);
  const date = coerceDateString(
    raw?.date ?? raw?.issue_date ?? raw?.created_at,
    base?.date ?? new Date().toISOString(),
  );
  const dueDate = coerceDateString(
    raw?.due_date ?? raw?.dueDate ?? raw?.due_at,
    base?.dueDate ?? date,
  );
  const paymentMethodRaw = raw?.payment_method ?? raw?.paymentMethod ?? base?.paymentMethodCode ?? base?.paymentMethod;
  const paymentMethod = resolvePaymentMethod(paymentMethodRaw, base?.paymentMethod);

  return {
    ...base,
    id,
    number,
    client: extractClientName(raw?.client ?? raw?.client_name, base?.client),
    property: typeof raw?.property === 'string'
      ? raw.property
      : typeof raw?.property?.name === 'string'
        ? raw.property.name
        : base?.property ?? '',
    date,
    dueDate,
    amount,
    status,
    services: extractServices(raw?.services, base?.services),
    paymentMethod,
    paymentMethodCode: typeof paymentMethodRaw === 'string' ? paymentMethodRaw : base?.paymentMethodCode,
    sent_at: raw?.sent_at ?? raw?.sentAt ?? base?.sent_at ?? null,
    paid_at: raw?.paid_at ?? raw?.paidAt ?? base?.paid_at ?? null,
    balance_due: raw?.balance_due ?? raw?.balanceDue ?? base?.balance_due ?? null,
    total: raw?.total ?? base?.total ?? amount,
    currency: raw?.currency ?? base?.currency ?? null,
  };
};

export async function markInvoicePaid(
  invoiceId: string | number,
  payload: MarkInvoicePaidPayload,
  base?: InvoiceData,
): Promise<InvoiceData> {
  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('authToken') || localStorage.getItem('token')
      : null;

  const response = await fetch(API_ROUTES.invoices.markPaid(invoiceId), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  let json: any = null;
  try {
    json = await response.json();
  } catch (error) {
    json = null;
  }

  if (!response.ok) {
    const message =
      (json && (json.message || json.error || json.errors))
        || `Unable to mark invoice ${invoiceId} as paid.`;
    throw new InvoiceApiError(String(message), response.status, json?.errors ?? json?.error ?? null);
  }

  const payloadData = getInvoicePayload(json);
  return normalizeInvoiceFromApi(payloadData, base);
}

