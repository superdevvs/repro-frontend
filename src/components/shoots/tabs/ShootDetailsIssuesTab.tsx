import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertCircle,
  Plus,
} from 'lucide-react';
import { ShootData } from '@/types/shoots';
import { API_BASE_URL } from '@/config/env';
import { format } from 'date-fns';
import { ShootIssueManager } from './ShootIssueManager';

interface ShootDetailsIssuesTabProps {
  shoot: ShootData;
  isAdmin: boolean;
  isPhotographer: boolean;
  isEditor: boolean;
  isClient: boolean;
  role: string;
  onShootUpdate: () => void;
}

interface Issue {
  id: string;
  shootId: string;
  mediaId?: string;
  raisedBy: {
    id: string;
    name: string;
    role: string;
  };
  assignedToRole?: 'editor' | 'photographer';
  assignedToUser?: {
    id: string;
    name: string;
  };
  status: 'open' | 'in-progress' | 'resolved';
  note: string;
  createdAt: string;
  updatedAt: string;
  mediaFilename?: string;
}

export function ShootDetailsIssuesTab({
  shoot,
  isAdmin,
  isPhotographer,
  isEditor,
  isClient,
  role,
  onShootUpdate,
}: ShootDetailsIssuesTabProps) {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [issueManagerOpen, setIssueManagerOpen] = useState(false);

  // Load issues
  useEffect(() => {
    if (!shoot.id) return;
    
    const loadIssues = async () => {
      try {
        const token = localStorage.getItem('authToken') || localStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/api/shoots/${shoot.id}/issues`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });
        
        if (res.ok) {
          const json = await res.json();
          setIssues(json.data || json || []);
        }
      } catch (error) {
        console.error('Error loading issues:', error);
      }
    };
    
    loadIssues();
  }, [shoot.id, onShootUpdate]);

  // Filter issues based on role
  const visibleIssues = issues.filter(issue => {
    if (isAdmin) return true;
    if (isClient) {
      // Client sees only issues they raised
      const currentUserId = localStorage.getItem('userId') || '';
      return issue.raisedBy.id === currentUserId;
    }
    if (isEditor) {
      // Editor sees issues assigned to editor role or specific editor
      return issue.assignedToRole === 'editor';
    }
    if (isPhotographer) {
      // Photographer sees issues assigned to photographer role
      return issue.assignedToRole === 'photographer';
    }
    return false;
  });


  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      'open': { label: 'Open', className: 'bg-red-500/10 text-red-500 border-red-500/20' },
      'in-progress': { label: 'In Progress', className: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
      'resolved': { label: 'Resolved', className: 'bg-green-500/10 text-green-500 border-green-500/20' },
    };
    const statusInfo = statusMap[status] || { label: status, className: 'bg-gray-500/10 text-gray-500 border-gray-500/20' };
    return <Badge className={statusInfo.className}>{statusInfo.label}</Badge>;
  };

  const handleIssueUpdate = () => {
    onShootUpdate();
    // Reload issues
    const loadIssues = async () => {
      try {
        const token = localStorage.getItem('authToken') || localStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/api/shoots/${shoot.id}/issues`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });
        
        if (res.ok) {
          const json = await res.json();
          setIssues(json.data || json || []);
        }
      } catch (error) {
        console.error('Error loading issues:', error);
      }
    };
    loadIssues();
  };

  const hasOpenIssues = visibleIssues.some(issue => issue.status === 'open' || issue.status === 'in-progress');

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Issues</h3>
          {hasOpenIssues && (
            <p className="text-sm text-muted-foreground mt-1">
              {visibleIssues.filter(i => i.status === 'open' || i.status === 'in-progress').length} open issue(s)
            </p>
          )}
        </div>
        {(isAdmin || isClient) && (
          <Button onClick={() => setIssueManagerOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            {isClient ? 'Raise issue' : 'Add issue'}
          </Button>
        )}
      </div>

      {/* Issues List */}
      {visibleIssues.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No issues found
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {visibleIssues.map(issue => (
            <Card key={issue.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {getStatusBadge(issue.status)}
                      {issue.mediaFilename && (
                        <Badge variant="outline" className="text-xs">
                          {issue.mediaFilename}
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Raised by {issue.raisedBy.name} ({issue.raisedBy.role}) on{' '}
                      {format(new Date(issue.createdAt), 'MMM d, yyyy h:mm a')}
                    </div>
                    {issue.assignedToRole && (
                      <div className="text-sm text-muted-foreground">
                        Assigned to: {issue.assignedToRole}
                        {issue.assignedToUser && ` (${issue.assignedToUser.name})`}
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{issue.note}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Warning if open issues exist */}
      {hasOpenIssues && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            This shoot has open issues and will remain in "In review" status until all issues are resolved.
          </AlertDescription>
        </Alert>
      )}

      {/* Issue Manager Modal */}
      <ShootIssueManager
        isOpen={issueManagerOpen}
        onClose={() => setIssueManagerOpen(false)}
        shootId={shoot.id}
        isAdmin={isAdmin}
        isPhotographer={isPhotographer}
        isEditor={isEditor}
        isClient={isClient}
        onIssueUpdate={handleIssueUpdate}
      />
    </div>
  );
}



