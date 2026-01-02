import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface DbServiceRequest {
  id: string;
  patient_name: string;
  mobile_number: string;
  email: string | null;
  services: string[];
  preferred_date: string;
  preferred_time: string;
  address: string;
  area: 'Rawalpindi' | 'Islamabad';
  notes: string | null;
  estimated_price: number;
  final_price: number | null;
  status: 'pending' | 'accepted' | 'on_the_way' | 'completed' | 'rejected';
  assigned_staff: string | null;
  payment_received: boolean;
  created_at: string;
}

export function useServiceRequests() {
  const [requests, setRequests] = useState<DbServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('service_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests((data as DbServiceRequest[]) || []);
    } catch (error: any) {
      toast({
        title: 'Error fetching requests',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateRequest = async (id: string, updates: Partial<DbServiceRequest>) => {
    try {
      const { error } = await supabase
        .from('service_requests')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setRequests(prev =>
        prev.map(req => (req.id === id ? { ...req, ...updates } : req))
      );

      toast({
        title: 'Request updated',
      });
    } catch (error: any) {
      toast({
        title: 'Error updating request',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return { requests, isLoading, fetchRequests, updateRequest };
}
