import type { ElementType } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ContactButtons } from '@/components/ContactButtons';
import { EmergencyButton } from '@/components/EmergencyButton';
import { services } from '@/data/services';
import {
  Syringe,
  Droplets,
  Activity,
  TestTube,
  Bandage,
  ChevronRight,
  Shield,
  Clock,
  MapPin,
} from 'lucide-react';

const iconMap: Record<string, ElementType> = {
  Syringe,
  Droplets,
  Activity,
  TestTube,
  Bandage,
};

export default function Index() {
  return (
    <div className="min-h-screen gradient-hero">

      {/* Hero */}
      <section className="container pt-8 pb-6">
        <div className="text-center space-y-4 px-2">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm">
            <MapPin className="w-4 h-4" />
            Serving Rawalpindi & Islamabad
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold">
            Quality Medical Care <br />
            <span className="text-primary">At Your Doorstep</span>
          </h1>

          <p className="text-muted-foreground max-w-md mx-auto text-sm sm:text-base">
            Professional home healthcare services by trained staff
          </p>
        </div>
      </section>

      {/* Trust */}
      <section className="container pb-6">
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-500" />
            Trained Staff
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            Quick Response
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-yellow-500" />
            Home Visits
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="container pb-6">
        <h2 className="text-xl font-semibold mb-4">
          Our Services
        </h2>

        <div className="flex flex-col gap-3">
          {services.slice(0, 6).map((service) => {
            const IconComponent = iconMap[service.icon] || Activity;

            return (
              <Card
                key={service.id}
                className="
                  p-4 
                  flex flex-col gap-3 
                  sm:flex-row sm:items-center sm:justify-between
                  hover:shadow-md transition
                "
              >
                {/* LEFT SIDE */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-primary flex-shrink-0">
                    <IconComponent className="w-6 h-6" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-sm sm:text-base">
                      {service.name}
                    </h3>

                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {service.description}
                    </p>
                  </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="flex items-center justify-between sm:justify-end gap-4 mt-2 sm:mt-0">
                  <p className="text-primary font-bold whitespace-nowrap">
                    Rs. {service.basePrice}
                  </p>

                  <Link to="/book">
                    <Button size="sm">
                      Book
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-8 space-y-4">
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

      {/* Footer */}
      <footer className="container pb-8">
        <Card className="p-4 bg-secondary/50 border-transparent">
          <p className="text-sm text-center text-muted-foreground">
            Professional home care services in Rawalpindi & Islamabad.
          </p>
        </Card>
      </footer>
    </div>
  );
}