import React, { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InvoiceData } from '@/utils/invoiceUtils';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast as sonnerToast } from "sonner";
import { ExternalLink, Trash, Plus, Edit, Check, DollarSignIcon as DSIcon } from "lucide-react";
import { ShootData } from "@/types/shoots";
import { format } from "date-fns";
import { Switch } from "@/components/ui/switch";
import { DollarSignIcon } from "lucide-react";

import { PaymentDialog } from "@/components/invoices/PaymentDialog"; // ensure this matches your file's export

interface ShootSettingsTabProps {
  shoot: ShootData;
  isAdmin?: boolean;
  isClient?: boolean;
  onUpdate?: (updated: Partial<ShootData>) => void; // optimistic update callback
  onDelete?: () => void;
  onProcessPayment?: (invoice: InvoiceData) => void;
  currentInvoice?: InvoiceData | null;
}

type TourLinkKey = "branded" | "mls" | "genericMls";
type Tour3DKey = "matterport" | "iGuide" | "cubicasa";

const TOUR_KEYS: TourLinkKey[] = ["branded", "mls", "genericMls"];
const TOUR_3D_KEYS: Tour3DKey[] = ["matterport", "iGuide", "cubicasa"];

export function ShootSettingsTab({
  shoot,
  isAdmin = false,
  isClient = false,
  onUpdate,
  onDelete,
  onProcessPayment,
  currentInvoice = null,
}: ShootSettingsTabProps) {
  // ---------- local state ----------
  const [tourLinks, setTourLinks] = useState<Record<string, string | undefined>>({});
  const [isDeletingTour, setIsDeletingTour] = useState<TourLinkKey | Tour3DKey | null>(null);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // 3D edit state
  const [editing3DKey, setEditing3DKey] = useState<Tour3DKey | null>(null);
  const [editing3DValue, setEditing3DValue] = useState("");
  const [isSaving3D, setIsSaving3D] = useState(false);

  // toggles (use shoot meta if available; safe cast to avoid TS errors)
  const [isFinalized, setIsFinalized] = useState<boolean>(() => !!(shoot as any)?.meta?.finalized);
  const [isDownloadable, setIsDownloadable] = useState<boolean>(() => !!(shoot as any)?.meta?.downloadable);
  const [isMarkedPaid, setIsMarkedPaid] = useState<boolean>(() => !!(shoot as any)?.payment?.totalPaid);
  const [isSortLocked, setIsSortLocked] = useState<boolean>(() => !!(shoot as any)?.meta?.sortLocked);

  const [savingToggleKey, setSavingToggleKey] = useState<string | null>(null); // to show loading state per toggle

  // Payment dialog state
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false); // kept if needed elsewhere

  // Local invoice state (sync with prop if provided)
  const [localInvoice, setLocalInvoice] = useState<InvoiceData | null>(currentInvoice ?? null);

  // initialize from prop
  useEffect(() => {
    const initial: Record<string, string | undefined> = {};
    TOUR_KEYS.forEach((k) => {
      // @ts-ignore
      initial[k] = (shoot as any).tourLinks?.[k] ?? undefined;
    });
    TOUR_3D_KEYS.forEach((k) => {
      // @ts-ignore
      initial[k] = (shoot as any).tourLinks?.[k] ?? undefined;
    });
    setTourLinks(initial);

    // refresh toggles from fresh shoot prop
    setIsFinalized(!!(shoot as any)?.meta?.finalized);
    setIsDownloadable(!!(shoot as any)?.meta?.downloadable);
    setIsMarkedPaid(!!(shoot as any)?.payment?.totalPaid);
    setIsSortLocked(!!(shoot as any)?.meta?.sortLocked);
  }, [shoot]);

  // keep localInvoice in sync with prop changes
  useEffect(() => {
    setLocalInvoice(currentInvoice ?? null);
  }, [currentInvoice]);

  // ---------- helpers ----------
  const formatMoney = (v: number) => `$${v.toFixed(2)}`;
  const computedTaxAmount = () => ((shoot as any)?.payment?.baseQuote ?? 0) * ((shoot as any)?.payment?.taxRate ?? 0) / 100;
  const computedTotalQuote = () => (shoot as any)?.payment?.baseQuote ?? 0 + computedTaxAmount();

  // ---------- generic toggle persistence ----------
  const toggleSetting = async (key: string, value: boolean) => {
    setSavingToggleKey(key);
    try {
      // Replace with your real endpoint
      const res = await fetch(`/api/shoots/${shoot.id}/settings/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      });
      if (!res.ok) throw new Error(`Server ${res.status}`);

      // optimistic update to parent
      onUpdate?.({ meta: { ...((shoot as any).meta || {}), [key]: value } } as any);
      sonnerToast.success("Updated");
    } catch (err) {
      console.error("Toggle update failed", err);
      sonnerToast.error("Failed to update");
    } finally {
      setSavingToggleKey(null);
    }
  };

  // ---------- tour link deletion (2D + 3D) ----------
  const confirmDeleteTour = async (key: TourLinkKey | Tour3DKey) => {
    if (!isAdmin) {
      sonnerToast.error("You don't have permission to remove links");
      return;
    }

    const ok = window.confirm("Delete this tour link? This action cannot be undone.");
    if (!ok) return;

    setIsDeletingTour(key);
    try {
      // Replace with your real API endpoint
      const res = await fetch(`/api/shoots/${shoot.id}/tour-link/${key}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`Server ${res.status}`);

      const updatedLinks = { ...tourLinks, [key]: undefined };
      setTourLinks(updatedLinks);
      sonnerToast.success("Tour link removed");
      onUpdate?.({ tourLinks: updatedLinks });
    } catch (err) {
      console.error("Failed to delete tour link", err);
      sonnerToast.error("Failed to remove link");
    } finally {
      setIsDeletingTour(null);
    }
  };

  // ---------- 3D save ----------
  const startEdit3D = (key: Tour3DKey) => {
    setEditing3DKey(key);
    setEditing3DValue(tourLinks[key] ?? "");
  };

  const cancelEdit3D = () => {
    setEditing3DKey(null);
    setEditing3DValue("");
  };

  const save3DTour = async () => {
    if (!editing3DKey) return;
    const value = editing3DValue.trim();
    if (value && !/^https?:\/\//i.test(value)) {
      sonnerToast.error("Please enter a valid URL (must start with http:// or https://)");
      return;
    }
    setIsSaving3D(true);
    try {
      // Use same endpoint as other tour links; backend should accept 3D keys
      const res = await fetch(`/api/shoots/${shoot.id}/tour-link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: editing3DKey, url: value || null }),
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);

      const updated = { ...tourLinks, [editing3DKey]: value || undefined };
      setTourLinks(updated);
      setEditing3DKey(null);
      setEditing3DValue("");
      sonnerToast.success("3D tour saved");
      onUpdate?.({ tourLinks: updated });
    } catch (err) {
      console.error("Save 3D tour failed", err);
      sonnerToast.error("Failed to save 3D tour");
    } finally {
      setIsSaving3D(false);
    }
  };

  // ---------- Payment helpers: fetch/create invoice ----------
  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}`, Accept: 'application/json' } : { Accept: 'application/json' };
  };

  const fetchInvoiceForShoot = async (): Promise<InvoiceData | null> => {
    try {
      // Try a shoot-scoped endpoint first
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/shoots/${shoot.id}/invoice`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const json = await res.json();
        const invoice: InvoiceData = json.data ?? json;
        console.log("Fetched invoice via /shoots/:id/invoice", invoice);
        return invoice;
      }

      // fallback to search invoices by shootId
      const res2 = await fetch(`${import.meta.env.VITE_API_URL}/api/invoices?shootId=${shoot.id}`, {
        headers: getAuthHeaders(),
      });
      if (res2.ok) {
        const json2 = await res2.json();
        const items = json2.data ?? json2;
        if (Array.isArray(items) && items.length > 0) {
          console.log("Fetched invoice list and picked first", items[0]);
          return items[0] as InvoiceData;
        }
      }

      return null;
    } catch (err) {
      console.error("fetchInvoiceForShoot error", err);
      return null;
    }
  };

  const createInvoiceForShoot = async (): Promise<InvoiceData | null> => {
    try {
      // Minimal payload; adjust according to backend requirements
      const payload = {
        shootId: shoot.id,
        amount: (shoot as any)?.payment?.totalQuote ?? (shoot as any)?.payment?.baseQuote ?? 0,
        description: `Invoice for shoot ${shoot.id}`,
      };

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/invoices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(getAuthHeaders() as any) },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.error("createInvoiceForShoot failed status", res.status);
        throw new Error(`Server ${res.status}`);
      }

      const json = await res.json();
      const created: InvoiceData = json.data ?? json;
      console.log("Created invoice", created);
      return created;
    } catch (err) {
      console.error("createInvoiceForShoot error", err);
      return null;
    }
  };

  // ---------- openPaymentDialog resilient flow ----------
  const openPaymentDialog = async () => {
    console.log("openPaymentDialog invoked", { isAdmin, isClient, localInvoice, currentInvoice });

    if (!(isAdmin || isClient)) {
      sonnerToast.error("You don't have permission to process payments");
      return;
    }

    if (localInvoice) {
      setPaymentDialogOpen(true);
      return;
    }

    sonnerToast("Searching for invoice...", { type: "info" });
    // try fetch
    const fetched = await fetchInvoiceForShoot();
    if (fetched) {
      setLocalInvoice(fetched);
      // optionally inform parent
      if (onProcessPayment) {
        try { onProcessPayment(fetched); } catch (e) { /* ignore */ }
      }
      setPaymentDialogOpen(true);
      return;
    }

    // ask user to create invoice
    const create = window.confirm("No invoice found for this shoot. Would you like to create one now?");
    if (!create) {
      sonnerToast.error("No invoice available to process for this shoot");
      return;
    }

    sonnerToast("Creating invoice...", { type: "info" });
    const created = await createInvoiceForShoot();
    if (created) {
      setLocalInvoice(created);
      if (onProcessPayment) {
        try { onProcessPayment(created); } catch (e) { /* ignore */ }
      }
      sonnerToast.success("Invoice created. You can now process payment.");
      setPaymentDialogOpen(true);
      return;
    }

    sonnerToast.error("Failed to create invoice");
    return;
  };

  const handlePaymentComplete = (invoiceId: string, paymentMethod: string) => {
    // Close dialog
    setPaymentDialogOpen(false);

    // Optionally update local invoice/payment flags
    if (localInvoice && String(localInvoice.id) === String(invoiceId)) {
      setLocalInvoice({ ...localInvoice, status: "paid" as any, paymentMethod });
    }

    // notify parent
    if (onProcessPayment && localInvoice) {
      try { onProcessPayment(localInvoice); } catch (e) { /* ignore */ }
    }

    sonnerToast.success(`Payment processed (${paymentMethod}) for invoice ${invoiceId}`);
  };

  // ---------- render ----------
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left column: Tour Links (2D) + 3D section */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Tour Links</h3>
        </div>

        <div className="flex gap-3">
          {TOUR_KEYS.map((key) => {
            const label = key === "branded" ? "Branded" : key === "mls" ? "MLS" : "Generic MLS";
            const url = tourLinks[key] as string | undefined;

            const handleClick = () => {
              if (key === "branded") navigate("/branded");
              else if (key === "mls") navigate("/mls");
              else if (key === "genericMls") navigate("/genericmls");
            };

            return (
              <Button
                key={key}
                variant={url ? "outline" : "secondary"}
                className="flex-1 justify-center"
                onClick={handleClick}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                {label}
              </Button>
            );
          })}
        </div>

        {/* -------------- 3D Tours Section -------------- */}
        <div className="mt-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">3D Tours</h3>
            <p className="text-sm text-muted-foreground">Manage Matterport, iGuide and Cubicasa links.</p>
          </div>

          <div className="space-y-3 mt-3">
            {TOUR_3D_KEYS.map((key) => {
              const label = key === "matterport" ? "Matterport" : key === "iGuide" ? "iGuide" : "Cubicasa";
              const url = tourLinks[key] as string | undefined;
              const isEditing = editing3DKey === key;

              return (
                <div key={key} className="border rounded-lg p-3 flex flex-col">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-muted-foreground">
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 12h18" /></svg>
                      </div>
                      <div>
                        <div className="font-medium">{label} Link</div>
                        <div className="text-xs text-muted-foreground">{url ?? "Not set"}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {url && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => window.open(url, "_blank")}>
                                <ExternalLink className="h-3.5 w-3.5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">Open 3D tour</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}

                      {isEditing ? (
                        <></>
                      ) : (
                        <>
                          {isAdmin && (
                            <Button variant="ghost" size="sm" onClick={() => startEdit3D(key)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          {isAdmin && url && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => confirmDeleteTour(key)}
                              disabled={isDeletingTour === key}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {isEditing && (
                    <div className="mt-3 grid grid-cols-1 gap-2">
                      <Input value={editing3DValue} onChange={(e) => setEditing3DValue(e.target.value)} placeholder={`https://`} />
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={cancelEdit3D}>Cancel</Button>
                        <Button variant="default" size="sm" onClick={save3DTour} disabled={isSaving3D}>
                          {isSaving3D ? "Saving..." : "Save"}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right column: small list-style toggles + process payment */}
      <div>
        <div className="space-y-1 border rounded-lg divide-y">
          {/* Finalize */}
          {isAdmin && (
            <div className="flex items-center justify-between px-4 py-2 text-sm">
              <span>Finalize</span>
              <Switch
                checked={isFinalized}
                onCheckedChange={(checked: boolean) => {
                  setIsFinalized(checked);
                  toggleSetting("finalized", checked);
                }}
                disabled={savingToggleKey === "finalized"}
              />
            </div>
          )}

          {/* Downloadable */}
          {isAdmin && (
            <div className="flex items-center justify-between px-4 py-2 text-sm">
              <span>Downloadable</span>
              <Switch
                checked={isDownloadable}
                onCheckedChange={(checked: boolean) => {
                  setIsDownloadable(checked);
                  toggleSetting("downloadable", checked);
                }}
                disabled={savingToggleKey === "downloadable"}
              />
            </div>
          )}
        </div>

        {/* Process Payment button for admins OR clients */}
        {(isAdmin || isClient) && (
          <div className="mt-3">
            <Button
              variant="default"
              className="w-full flex items-center justify-center gap-2"
              onClick={openPaymentDialog}
            >
              <DollarSignIcon className="h-4 w-4 mr-2" />
              Process Payment
            </Button>
          </div>
        )}
      </div>

      {/* PaymentDialog (reused shared component). */}
      <PaymentDialog
        invoice={localInvoice}
        isOpen={paymentDialogOpen}
        onClose={() => setPaymentDialogOpen(false)}
        onPaymentComplete={handlePaymentComplete}
      />
    </div>
  );
}

export default ShootSettingsTab;
