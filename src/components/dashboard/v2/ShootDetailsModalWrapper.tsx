import React from 'react';
import { ShootDetailsModal } from '@/components/shoots/ShootDetailsModal';
import { DashboardShootSummary } from '@/types/dashboard';

interface ShootDetailsModalWrapperProps {
  shoot: DashboardShootSummary | null;
  onClose: () => void;
}

/**
 * Wrapper component to bridge the existing Dashboard code with the new unified ShootDetailsModal.
 * Converts DashboardShootSummary to shootId format expected by ShootDetailsModal.
 */
export const ShootDetailsModalWrapper: React.FC<ShootDetailsModalWrapperProps> = ({ shoot, onClose }) => {
  if (!shoot) return null;

  // Extract shoot ID from the shoot object
  const shootId = String(shoot.id);

  return (
    <ShootDetailsModal
      shootId={shootId}
      isOpen={Boolean(shoot)}
      onClose={onClose}
    />
  );
};



