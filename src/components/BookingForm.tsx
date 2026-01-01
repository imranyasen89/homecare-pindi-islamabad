import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { ServiceCard } from './ServiceCard';
import { services, areaCharges } from '@/data/services';
import { useToast } from '@/hooks/use-toast';
import { CalendarDays, Clock, MapPin, User, Phone, FileText, Send } from 'lucide-react';

export function BookingForm() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    patientName: '',
    mobileNumber: '',
    preferredDate: '',
    preferredTime: '',
    address: '',
    area: '' as 'Rawalpindi' | 'Islamabad' | '',
    notes: '',
    otherService: '',
  });
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const estimatedPrice = useMemo(() => {
    const servicesTotal = selectedServices.reduce((sum, serviceId) => {
      const service = services.find(s => s.id === serviceId);
      return sum + (service?.basePrice || 0);
    }, 0);

    const areaCharge = formData.area 
      ? areaCharges.find(a => a.area === formData.area)?.charge || 0 
      : 0;

    return servicesTotal + areaCharge;
  }, [selectedServices, formData.area]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedServices.length === 0 && !formData.otherService.trim()) {
      toast({
        title: 'Please select at least one service',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.area) {
      toast({
        title: 'Please select your area',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    const allServices = formData.otherService.trim() 
      ? [...selectedServices, `Other: ${formData.otherService}`]
      : selectedServices;

    try {
      const { error } = await supabase
        .from('service_requests')
        .insert({
          patient_name: formData.patientName,
          mobile_number: formData.mobileNumber,
          services: allServices,
          preferred_date: formData.preferredDate,
          preferred_time: formData.preferredTime,
          address: formData.address,
          area: formData.area as 'Rawalpindi' | 'Islamabad',
          notes: formData.notes || null,
          estimated_price: estimatedPrice,
        });

      if (error) throw error;
      
      setIsSubmitting(false);
      navigate('/confirmation');
    } catch (error: any) {
      setIsSubmitting(false);
      toast({
        title: 'Error submitting request',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Services Selection */}
      <div className="space-y-3">
        <Label className="text-lg font-semibold flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Select Services
        </Label>
        <div className="grid gap-3">
          {services.map(service => (
            <ServiceCard
              key={service.id}
              service={service}
              isSelected={selectedServices.includes(service.id)}
              onToggle={toggleService}
            />
          ))}
        </div>
        <div className="space-y-2">
          <Label htmlFor="otherService" className="text-sm text-muted-foreground">
            Other service (specify if needed)
          </Label>
          <Input
            id="otherService"
            placeholder="e.g., Catheter care, Physiotherapy..."
            value={formData.otherService}
            onChange={e => setFormData(prev => ({ ...prev, otherService: e.target.value }))}
          />
        </div>
      </div>

      {/* Patient Details */}
      <Card className="p-4 space-y-4">
        <h3 className="font-semibold flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Patient Details
        </h3>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="patientName">Patient Name *</Label>
            <Input
              id="patientName"
              placeholder="Enter patient name"
              value={formData.patientName}
              onChange={e => setFormData(prev => ({ ...prev, patientName: e.target.value }))}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="mobileNumber">Mobile Number *</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="mobileNumber"
                type="tel"
                placeholder="03XX-XXXXXXX"
                className="pl-10"
                value={formData.mobileNumber}
                onChange={e => setFormData(prev => ({ ...prev, mobileNumber: e.target.value }))}
                required
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Schedule */}
      <Card className="p-4 space-y-4">
        <h3 className="font-semibold flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-primary" />
          Preferred Schedule
        </h3>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="preferredDate">Preferred Date *</Label>
            <Input
              id="preferredDate"
              type="date"
              value={formData.preferredDate}
              onChange={e => setFormData(prev => ({ ...prev, preferredDate: e.target.value }))}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="preferredTime">Preferred Time *</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="preferredTime"
                type="time"
                className="pl-10"
                value={formData.preferredTime}
                onChange={e => setFormData(prev => ({ ...prev, preferredTime: e.target.value }))}
                required
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Location */}
      <Card className="p-4 space-y-4">
        <h3 className="font-semibold flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          Location
        </h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="area">Area *</Label>
            <Select 
              value={formData.area} 
              onValueChange={(value: 'Rawalpindi' | 'Islamabad') => setFormData(prev => ({ ...prev, area: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Rawalpindi">
                  Rawalpindi (Travel: Rs. 200)
                </SelectItem>
                <SelectItem value="Islamabad">
                  Islamabad (Travel: Rs. 300)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Complete Address *</Label>
            <Textarea
              id="address"
              placeholder="House/Flat number, Street, Sector/Area..."
              value={formData.address}
              onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
              required
              rows={3}
            />
          </div>
        </div>
      </Card>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Additional Notes (Optional)</Label>
        <Textarea
          id="notes"
          placeholder="Any special instructions or patient conditions..."
          value={formData.notes}
          onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          rows={2}
        />
      </div>

      {/* Price Estimate */}
      {estimatedPrice > 0 && (
        <Card className="p-4 bg-primary/5 border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Estimated Price</p>
              <p className="text-2xl font-bold text-primary">Rs. {estimatedPrice}</p>
            </div>
            <p className="text-xs text-muted-foreground max-w-[200px] text-right">
              Final price may vary after confirmation
            </p>
          </div>
        </Card>
      )}

      {/* Submit */}
      <Button type="submit" size="xl" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          'Sending Request...'
        ) : (
          <>
            <Send className="w-5 h-5" />
            Book Home Service
          </>
        )}
      </Button>
    </form>
  );
}
