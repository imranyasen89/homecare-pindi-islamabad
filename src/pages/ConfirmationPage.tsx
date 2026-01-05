import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ContactButtons } from '@/components/ContactButtons';
import { paymentMethods } from '@/data/services';
import { CheckCircle, Home, Clock, CreditCard, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ConfirmationPage() {
  const { toast } = useToast();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: `${label} copied to clipboard`,
    });
  };

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

        {/* Payment Methods */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Payment Options</h3>
          </div>
          
          {/* EasyPaisa */}
          <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-green-600">EasyPaisa</p>
                <p className="text-lg font-mono">{paymentMethods.easyPaisa.number}</p>
              </div>
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => copyToClipboard(paymentMethods.easyPaisa.number, 'EasyPaisa number')}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Please send payment after service completion and confirmation from our team
          </p>
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
