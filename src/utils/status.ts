const STATUS_TEXT: Record<string, string> = {
  booked: 'Booked',
  scheduled: 'Scheduled',
  confirmed: 'Confirmed',
  in_field: 'Infield',
  uploading: 'Uploading',
  photos_uploaded: 'Uploaded',
  editing: 'Editing',
  editing_complete: 'Editing',
  qc: 'Qc',
  pending_review: 'Pending',
  admin_verified: 'Verified',
  ready: 'Ready',
  delivered: 'Delivered',
  completed: 'Completed',
  canceled: 'Canceled',
};

const humanize = (value: string) =>
  value
    .split('_')
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join('');

export const formatWorkflowStatus = (status?: string | null, fallback = 'Scheduled') => {
  if (!status) return fallback;
  const key = status.toLowerCase();
  return STATUS_TEXT[key] || humanize(key);
};

