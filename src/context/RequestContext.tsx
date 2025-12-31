import { createContext, useContext, useState, ReactNode } from 'react';
import { ServiceRequest } from '@/types';

interface RequestContextType {
  requests: ServiceRequest[];
  addRequest: (request: Omit<ServiceRequest, 'id' | 'createdAt' | 'status' | 'paymentReceived'>) => void;
  updateRequest: (id: string, updates: Partial<ServiceRequest>) => void;
}

const RequestContext = createContext<RequestContextType | undefined>(undefined);

export function RequestProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);

  const addRequest = (request: Omit<ServiceRequest, 'id' | 'createdAt' | 'status' | 'paymentReceived'>) => {
    const newRequest: ServiceRequest = {
      ...request,
      id: `REQ-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'pending',
      paymentReceived: false,
    };
    setRequests(prev => [newRequest, ...prev]);
  };

  const updateRequest = (id: string, updates: Partial<ServiceRequest>) => {
    setRequests(prev => 
      prev.map(req => req.id === id ? { ...req, ...updates } : req)
    );
  };

  return (
    <RequestContext.Provider value={{ requests, addRequest, updateRequest }}>
      {children}
    </RequestContext.Provider>
  );
}

export function useRequests() {
  const context = useContext(RequestContext);
  if (!context) {
    throw new Error('useRequests must be used within a RequestProvider');
  }
  return context;
}
