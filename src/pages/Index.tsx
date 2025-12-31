import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ContactButtons } from '@/components/ContactButtons';
import { EmergencyButton } from '@/components/EmergencyButton';
import { services } from '@/data/services';
import { Syringe, Droplets, Activity, TestTube, Bandage, ChevronRight, Shield, Clock, MapPin } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Syringe,
  Droplets,
  Activity,
  TestTube,
  Bandage,
};

export default function Index() {
  return (
    <div className="min-h-screen gradient-hero">
      {/* Hero Section */}
      <section className="container pt-8 pb-6">
        <div className="text-center space-y-4 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium">
            <MapPin className="w-4 h-4" />
            Serving Rawalpindi & Islamabad
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
            Quality Medical Care<br />
            <span className="text-primary">At Your Doorstep</span>
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Professional nursing and medical services delivered to your home by trained healthcare providers
          </p>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="container pb-6">
        <div className="flex flex-wrap justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="w-4 h-4 text-success" />
            Trained Staff
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4 text-primary" />
            Quick Response
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 text-warning" />
            Home Visits
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="container pb-6">
        <h2 className="text-xl font-semibold mb-4">Our Services</h2>
        <div className="grid gap-3 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          {services.slice(0, 4).map(service => {
            const IconComponent = iconMap[service.icon] || Activity;
            return (
              <Card key={service.id} className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-primary flex-shrink-0">
                  <IconComponent className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground">{service.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">{service.description}</p>
                </div>
                <p className="text-primary font-bold whitespace-nowrap">Rs. {service.basePrice}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container pb-8 space-y-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <Button size="xl" className="w-full" asChild>
          <Link to="/book" className="flex items-center justify-center gap-2">
            Book Home Service
            <ChevronRight className="w-5 h-5" />
          </Link>
        </Button>
        
        <ContactButtons />
        
        <div className="pt-4">
          <EmergencyButton />
        </div>
      </section>

      {/* Footer Info */}
      <footer className="container pb-8">
        <Card className="p-4 bg-secondary/50 border-transparent">
          <p className="text-sm text-center text-muted-foreground">
            We provide professional home care services in Rawalpindi and Islamabad. 
            All our staff are trained and certified healthcare providers.
          </p>
        </Card>
      </footer>
    </div>
  );
}
