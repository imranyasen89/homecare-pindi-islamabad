import { Button } from '@/components/ui/button';
import { Phone, MessageCircle } from 'lucide-react';
import { CONTACT_NUMBER } from '@/data/services';

export function ContactButtons() {
  const handleCall = () => {
    window.location.href = `tel:${CONTACT_NUMBER}`;
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent('Hello! I would like to inquire about home care medical services.');
    window.open(`https://wa.me/92${CONTACT_NUMBER.slice(1)}?text=${message}`, '_blank');
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full">
      <Button 
        variant="outline" 
        size="lg" 
        className="flex-1"
        onClick={handleCall}
      >
        <Phone className="w-5 h-5" />
        Call Now
      </Button>
      <Button 
        variant="whatsapp" 
        size="lg" 
        className="flex-1"
        onClick={handleWhatsApp}
      >
        <MessageCircle className="w-5 h-5" />
        WhatsApp
      </Button>
    </div>
  );
}
