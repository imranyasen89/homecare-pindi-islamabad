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
import { CalendarDays, Clock, MapPin, User, Phone, FileText, Send, Mail } from 'lucide-react';
import { z } from 'zod';

// Validation schema
const bookingSchema = z.object({
  patientName: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  mobileNumber: z.string().regex(/^0[0-9]{10}$/, 'Enter valid Pakistani mobile (e.g., 03001234567)'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  preferredDate: z.string().min(1, 'Date is required'),
  preferredTime: z.string().min(1, 'Time is required'),
  address: z.string().min(10, 'Address must be at least 10 characters').max(500, 'Address too long'),
  area: z.string().refine((val) => val === 'Rawalpindi' || val === 'Islamabad', { message: 'Please select an area' }),
  notes: z.string().max(1000, 'Notes too long').optional().or(z.literal('')),
  otherService: z.string().max(200, 'Service description too long').optional().or(z.literal('')),
});

export function BookingForm() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    patientName: '',
    mobileNumber: '',
    email: '',
    preferredDate: '',
    preferredTime: '',
    address: '',
    area: '' as 'Rawalpindi' | 'Islamabad' | '',
    notes: '',
    otherService: '',
  });
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);

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
    
    // Rate limiting - 60 second cooldown
    const now = Date.now();
    const SUBMIT_COOLDOWN = 60000;
    if (now - lastSubmitTime < SUBMIT_COOLDOWN) {
      const waitTime = Math.ceil((SUBMIT_COOLDOWN - (now - lastSubmitTime)) / 1000);
      toast({
        title: 'Please wait',
        description: `You can submit another request in ${waitTime} seconds.`,
        variant: 'destructive',
      });
      return;
    }
    
    if (selectedServices.length === 0 && !formData.otherService.trim()) {
      toast({
        title: 'Please select at least one service',
        variant: 'destructive',
      });
      return;
    }

    // Validate form data with Zod
    const validationResult = bookingSchema.safeParse(formData);
    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0];
      toast({
        title: 'Validation Error',
        description: firstError.message,
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    setLastSubmitTime(now);

    const allServices = formData.otherService.trim() 
      ? [...selectedServices, `Other: ${formData.otherService.slice(0, 200)}`]
      : selectedServices;

    try {
      const { error } = await supabase
        .from('service_requests')
        .insert({
          patient_name: formData.patientName.slice(0, 100),
          mobile_number: formData.mobileNumber.slice(0, 15),
          email: formData.email ? formData.email.slice(0, 255) : null,
          services: allServices,
          preferred_date: formData.preferredDate,
          preferred_time: formData.preferredTime,
          address: formData.address.slice(0, 500),
          area: formData.area as 'Rawalpindi' | 'Islamabad',
          notes: formData.notes ? formData.notes.slice(0, 1000) : null,
          estimated_price: Math.max(0, Math.min(estimatedPrice, 1000000)),
        });

      if (error) throw error;
      
      setIsSubmitting(false);
      navigate('/confirmation');
    } catch (error: unknown) {
      setIsSubmitting(false);
      console.error('Booking submission failed:', error);
      toast({
        title: 'Unable to submit booking',
        description: 'Please check your information and try again. If the problem persists, contact support.',
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
        
        <div className="space-y-2">
          <Label htmlFor="email">Email (Optional)</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="patient@example.com"
              className="pl-10"
              value={formData.email}
              onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
            />
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
              value={formData.area || undefined} 
              onValueChange={(value: 'Rawalpindi' | 'Islamabad') => setFormData(prev => ({ ...prev, area: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Rawalpindi">
                  Rawalpindi (Travel: Rs. 800)
                </SelectItem>
                <SelectItem value="Islamabad">
                  Islamabad (Travel: Rs. 1,000)
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
