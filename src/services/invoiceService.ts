import API_ROUTES from '@/lib/api';
import { InvoiceData } from '@/utils/invoiceUtils';

const getCookieValue = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? match[1] : null;
};

let csrfRequest: Promise<void> | null = null;

const ensureCsrfToken = async () => {
  if (typeof window === 'undefined') return;
  const existing = getCookieValue('XSRF-TOKEN');
  if (existing) return;

  if (!csrfRequest) {
    csrfRequest = fetch(`${import.meta.env.VITE_API_URL}/sanctum/csrf-cookie`, {
      credentials: 'include',
    })
      .then(() => undefined)
      .catch(() => undefined)
      .finally(() => {
        csrfRequest = null;
      });
  }

  await csrfRequest;
};

const normalizeStatus = (
  status: unknown,
  fallback: InvoiceData['status'],
): InvoiceData['status'] => {
  if (!status) return fallback;
  const normalized = String(status).toLowerCase();
  if (normalized === 'sent') return fallback === 'paid' ? 'paid' : 'pending';
  if (normalized === 'completed') return 'paid';
  if (normalized === 'past_due') return 'overdue';
  if (normalized === 'unpaid') return 'pending';
  if (normalized === 'paid' || normalized === 'pending' || normalized === 'overdue') {
    return normalized as InvoiceData['status'];
  }
  return fallback;
};

const coerceNumber = (value: unknown, fallback: number): number => {
  if (typeof value === 'number' && !Number.isNaN(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value);
    if (!Number.isNaN(parsed)) return parsed;
  }
  return fallback;
};

const toServiceList = (value: unknown, fallback: string[]): string[] => {
  if (Array.isArray(value)) {
    return value.map((item) => {
      if (typeof item === 'string') return item;
      if (item && typeof item === 'object') {
        const candidate =
          (item as Record<string, unknown>).name ||
          (item as Record<string, unknown>).title ||
          (item as Record<string, unknown>).description;
        if (typeof candidate === 'string' && candidate.length > 0) {
          return candidate;
        }
      }
      return typeof item === 'number' ? item.toString() : JSON.stringify(item ?? '');
    });
  }
  return fallback;
};

const normalizeInvoiceData = (
  incoming: Record<string, unknown>,
  current?: InvoiceData,
): InvoiceData => {
  const fallback: InvoiceData = current ?? {
    id: String(incoming.id ?? incoming.uuid ?? ''),
    number: String(
      incoming.number ?? incoming.invoice_number ?? incoming.id ?? incoming.uuid ?? 'invoice'
    ),
    client:
      (incoming.client && typeof incoming.client === 'object'
        ? (incoming.client as Record<string, unknown>).name
        : undefined) ??
      (incoming.client_name as string | undefined) ??
      '',
    property:
      (incoming.property && typeof incoming.property === 'object'
        ? (incoming.property as Record<string, unknown>).address
        : undefined) ??
      (incoming.property_address as string | undefined) ??
      '',
    date:
      (incoming.date as string | undefined) ??
      (incoming.issue_date as string | undefined) ??
      (incoming.created_at as string | undefined) ??
      new Date().toISOString(),
    dueDate:
      (incoming.dueDate as string | undefined) ??
      (incoming.due_date as string | undefined) ??
      new Date().toISOString(),
    amount: coerceNumber(incoming.amount, 0),
    status: 'pending',
    services: [],
    paymentMethod: (incoming.payment_method as string | undefined) ?? 'Pending',
  };

  const clientName =
    (incoming.client && typeof incoming.client === 'object'
      ? (incoming.client as Record<string, unknown>).name
      : undefined) ??
    (incoming.client_name as string | undefined);

  const property =
    (incoming.property && typeof incoming.property === 'object'
      ? (incoming.property as Record<string, unknown>).address ??
        (incoming.property as Record<string, unknown>).name
      : undefined) ??
    (incoming.property_address as string | undefined);

  const services = toServiceList(
    incoming.services ?? incoming.items ?? incoming.line_items,
    fallback.services,
  );

  const amount = coerceNumber(
    incoming.amount ?? incoming.total ?? incoming.amount_due ?? incoming.balance,
    fallback.amount,
  );

  return {
    ...fallback,
    id: String(incoming.id ?? incoming.uuid ?? fallback.id),
    number: String(
      incoming.number ?? incoming.invoice_number ?? incoming.reference ?? fallback.number
    ),
    client: clientName ?? fallback.client,
    property: property ?? fallback.property,
    date:
      (incoming.date as string | undefined) ??
      (incoming.issue_date as string | undefined) ??
      (incoming.created_at as string | undefined) ??
      fallback.date,
    dueDate:
      (incoming.dueDate as string | undefined) ??
      (incoming.due_date as string | undefined) ??
      fallback.dueDate,
    amount,
    status: normalizeStatus(
      incoming.status ?? incoming.state ?? incoming.invoice_status,
      fallback.status,
    ),
    services,
    paymentMethod:
      (incoming.payment_method as string | undefined) ??
      (incoming.paymentMethod as string | undefined) ??
      fallback.paymentMethod,
  };
};

export const sendInvoice = async (
  invoiceId: string,
  currentInvoice?: InvoiceData,
): Promise<InvoiceData> => {
  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('authToken') || localStorage.getItem('token')
      : null;

  await ensureCsrfToken();

  const headers: HeadersInit = {
    Accept: 'application/json',
  };

  const xsrf = getCookieValue('XSRF-TOKEN');
  if (xsrf) {
    headers['X-XSRF-TOKEN'] = decodeURIComponent(xsrf);
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(API_ROUTES.invoices.send(invoiceId), {
    method: 'POST',
    headers,
    credentials: 'include',
  });

  if (!response.ok) {
    let message = 'Failed to send invoice.';
    try {
      const errorJson = await response.json();
      message =
        (errorJson && typeof errorJson === 'object' && 'message' in errorJson
          ? (errorJson.message as string)
          : undefined) ||
        (errorJson && typeof errorJson === 'object' && 'error' in errorJson
          ? (errorJson.error as string)
          : undefined) ||
        message;
    } catch (_) {
      const text = await response.text();
      if (text) message = text;
    }
    throw new Error(message);
  }

  let payload: any = null;
  try {
    payload = await response.json();
  } catch (_) {
    payload = null;
  }

  if (!payload || typeof payload !== 'object') {
    return currentInvoice ?? normalizeInvoiceData({}, currentInvoice);
  }

  const invoicePayload =
    (payload && typeof payload === 'object' && 'invoice' in payload
      ? (payload as Record<string, unknown>).invoice
      : undefined) ?? payload;

  if (!invoicePayload || typeof invoicePayload !== 'object') {
    return currentInvoice ?? normalizeInvoiceData({}, currentInvoice);
  }

  return normalizeInvoiceData(invoicePayload as Record<string, unknown>, currentInvoice);
};
