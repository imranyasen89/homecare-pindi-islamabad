import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ContactButtons } from '@/components/ContactButtons';
import { CheckCircle, Home, Clock } from 'lucide-react';

export default function ConfirmationPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 animate-scale-in">
        {/* Success Icon */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/10 mb-4">
            <CheckCircle className="w-10 h-10 text-success" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Request Sent!</h1>
          <p className="text-muted-foreground mt-2">
            Your home service request has been submitted successfully
          </p>
        </div>

        {/* Info Card */}
        <Card className="p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">What's Next?</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Our team will review your request and contact you shortly to confirm the service details and final price.
              </p>
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm text-muted-foreground mb-3">
              Need immediate assistance?
            </p>
            <ContactButtons />
          </div>
        </Card>

        {/* Back Home */}
        <Button variant="outline" size="lg" className="w-full" asChild>
          <Link to="/" className="flex items-center justify-center gap-2">
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
