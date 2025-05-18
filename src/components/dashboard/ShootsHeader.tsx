
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePermission } from '@/hooks/usePermission';

interface ShootsHeaderProps {
  title: string;
  subtitle: string;
}

export function ShootsHeader({ title, subtitle }: ShootsHeaderProps) {
  const navigate = useNavigate();
  const shootPermissions = usePermission().forResource('shoots');
  
  // Show the button to users who have permission to book shoots
  const canBookShoot = shootPermissions.canBook();
  
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <Badge className="mb-2 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
          Shoots
        </Badge>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground">
          {subtitle}
        </p>
      </div>
      
      {canBookShoot && (
        <Button onClick={() => navigate('/book-shoot')}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Book New Shoot
        </Button>
      )}
    </div>
  );
}
