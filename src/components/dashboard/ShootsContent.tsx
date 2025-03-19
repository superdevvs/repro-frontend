
import React from 'react';
import { CameraIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { ShootCard } from '@/components/dashboard/ShootCard';
import { ShootsList } from '@/components/dashboard/ShootsList';
import { ShootData } from '@/types/shoots';

interface ShootsContentProps {
  filteredShoots: ShootData[];
  viewMode: 'grid' | 'list';
  onShootSelect: (shoot: ShootData) => void;
}

export function ShootsContent({ 
  filteredShoots, 
  viewMode, 
  onShootSelect 
}: ShootsContentProps) {
  // Convert ShootData to ShootCard props
  const mapShootToCardProps = (shoot: ShootData) => ({
    id: shoot.id,
    address: shoot.location.fullAddress,
    date: shoot.scheduledDate,
    time: "10:00 AM - 12:00 PM", // This should come from the actual data
    photographer: {
      name: shoot.photographer.name,
      avatar: shoot.photographer.avatar || "https://ui.shadcn.com/avatars/01.png", // Default avatar
    },
    client: {
      name: shoot.client.name,
    },
    status: shoot.status as any,
    price: shoot.payment.totalQuote,
    delay: 0,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {filteredShoots.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredShoots.map((shoot, index) => (
              <ShootCard
                key={shoot.id}
                {...mapShootToCardProps(shoot)}
                delay={index}
                onClick={() => onShootSelect(shoot)}
              />
            ))}
          </div>
        ) : (
          <ShootsList 
            shoots={filteredShoots}
            onViewDetails={onShootSelect}
          />
        )
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center mb-4">
            <CameraIcon className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No shoots found</h3>
          <p className="text-muted-foreground mt-1">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}
    </motion.div>
  );
}
