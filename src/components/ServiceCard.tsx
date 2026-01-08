import { Service } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { Syringe, Droplets, Activity, TestTube, Bandage } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Syringe,
  Droplets,
  Activity,
  TestTube,
  Bandage,
};

interface ServiceCardProps {
  service: Service;
  isSelected: boolean;
  onToggle: (serviceId: string) => void;
}

export function ServiceCard({ service, isSelected, onToggle }: ServiceCardProps) {
  const IconComponent = iconMap[service.icon] || Activity;

  return (
    <Card 
      className={`relative p-4 cursor-pointer transition-all duration-200 hover:shadow-card ${
        isSelected 
          ? 'border-primary bg-primary/5 shadow-card' 
          : 'border-border hover:border-primary/30'
      }`}
      onClick={() => onToggle(service.id)}
    >
      <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
          isSelected ? 'bg-primary text-primary-foreground' : 'bg-secondary text-primary'
        }`}>
          <IconComponent className="w-6 h-6" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold text-foreground">{service.name}</h3>
            <Checkbox 
              checked={isSelected} 
              onClick={(e) => e.stopPropagation()}
              className="border-2"
            />
          </div>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {service.description}
          </p>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-lg font-bold text-primary">Rs. {service.basePrice}</span>
            <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">
              {service.estimatedTime}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
