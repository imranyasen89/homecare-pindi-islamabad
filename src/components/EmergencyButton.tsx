import React from 'react';
import { Button } from '@/components/ui/button';
import { PhoneCall } from 'lucide-react';
import { CONTACT_NUMBER } from '@/data/services';

export const EmergencyButton = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  (props, ref) => {
    const handleEmergencyCall = () => {
      window.location.href = `tel:${CONTACT_NUMBER}`;
    };

    return (
      <Button 
        ref={ref}
        variant="emergency" 
        size="xl" 
        className="w-full"
        onClick={handleEmergencyCall}
        {...props}
      >
        <PhoneCall className="w-6 h-6" />
        Emergency Call
      </Button>
    );
  }
);

EmergencyButton.displayName = 'EmergencyButton';
