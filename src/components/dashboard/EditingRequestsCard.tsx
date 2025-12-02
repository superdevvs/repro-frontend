import React from 'react';
import { Card } from './v2/SharedComponents';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EditingRequest } from '@/services/editingRequestService';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { EditingRequestsCardSkeleton } from './v2/EditingRequestsCardSkeleton';

interface EditingRequestsCardProps {
  requests: EditingRequest[];
  loading?: boolean;
  onCreate?: () => void;
  maxItems?: number;
}

const PRIORITY_STYLES: Record<EditingRequest['priority'], string> = {
  low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  normal: 'bg-sky-50 text-sky-700 border-sky-200',
  high: 'bg-rose-50 text-rose-700 border-rose-200',
};

const STATUS_STYLES: Record<EditingRequest['status'], string> = {
  open: 'text-amber-600 bg-amber-50 border-amber-200',
  in_progress: 'text-sky-600 bg-sky-50 border-sky-200',
  completed: 'text-emerald-600 bg-emerald-50 border-emerald-200',
};

export const EditingRequestsCard: React.FC<EditingRequestsCardProps> = ({
  requests,
  loading,
  onCreate,
  maxItems = 5,
}) => {
  const list = requests.slice(0, maxItems);

  return (
    <Card className="flex flex-col h-full gap-4">
      <div>
        <h2 className="text-lg font-bold text-foreground">Special editing requests</h2>
        <p className="text-sm text-muted-foreground">Track escalations routed to the editing team.</p>
      </div>

      {loading ? (
        <EditingRequestsCardSkeleton />
      ) : list.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <p className="text-sm text-muted-foreground italic">No active requests.</p>
          {onCreate && (
            <Button size="sm" onClick={onCreate} className="w-full">
              New request
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-1">
          {list.map((request) => {
            const createdLabel = request.created_at
              ? format(new Date(request.created_at), 'MMM d • h:mm a')
              : null;
            const shootLabel = request.shoot?.address
              ? request.shoot.address
              : request.shoot_id
                ? `Shoot #${request.shoot_id}`
                : 'No shoot linked';

            return (
              <div
                key={request.id}
                className="rounded-2xl border border-border/60 bg-muted/20 p-3 hover:border-primary/40 transition-colors"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{request.summary}</p>
                    <p className="text-xs text-muted-foreground">{shootLabel}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={cn('text-[10px] font-semibold border', PRIORITY_STYLES[request.priority])}>
                      {request.priority}
                    </Badge>
                    <Badge className={cn('text-[10px] font-semibold border', STATUS_STYLES[request.status])}>
                      {request.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
                <div className="mt-2 text-xs text-muted-foreground flex justify-between">
                  <span>Tracking: {request.tracking_code}</span>
                  {createdLabel && <span>{createdLabel}</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {onCreate && list.length > 0 && (
        <Button size="sm" onClick={onCreate} className="w-full mt-2">
          New request
        </Button>
      )}
    </Card>
  );
};

