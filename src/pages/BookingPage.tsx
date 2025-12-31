import { BookingForm } from '@/components/BookingForm';
import { ContactButtons } from '@/components/ContactButtons';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur border-b">
        <div className="container py-3 flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="font-semibold text-foreground">Book Home Service</h1>
            <p className="text-xs text-muted-foreground">Fill in the details below</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <main className="container py-6 animate-fade-in">
        <BookingForm />
        
        {/* Contact Help */}
        <div className="mt-8 pt-6 border-t space-y-4">
          <p className="text-center text-sm text-muted-foreground">
            Need help with your booking?
          </p>
          <ContactButtons />
        </div>
      </main>
    </div>
  );
}
