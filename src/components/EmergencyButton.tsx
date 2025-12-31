import { Button } from '@/components/ui/button';
import { PhoneCall } from 'lucide-react';
import { CONTACT_NUMBER } from '@/data/services';

export function EmergencyButton() {
  const handleEmergencyCall = () => {
    window.location.href = `tel:${CONTACT_NUMBER}`;
  };

  return (
    <Button 
      variant="emergency" 
      size="xl" 
      className="w-full"
      onClick={handleEmergencyCall}
    >
      <PhoneCall className="w-6 h-6" />
      Emergency Call
    </Button>
  );
}
