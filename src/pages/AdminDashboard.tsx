import { useState } from 'react';
import { useRequests } from '@/context/RequestContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { services } from '@/data/services';
import { ServiceRequest } from '@/types';
import { format } from 'date-fns';
import { 
  Clock, MapPin, Phone, User, FileText, 
  CheckCircle, XCircle, Truck, DollarSign,
  Calendar, AlertCircle
} from 'lucide-react';

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-warning/10 text-warning border-warning/30', icon: Clock },
  accepted: { label: 'Accepted', color: 'bg-primary/10 text-primary border-primary/30', icon: CheckCircle },
  on_the_way: { label: 'On the Way', color: 'bg-medical/10 text-medical border-medical/30', icon: Truck },
  completed: { label: 'Completed', color: 'bg-success/10 text-success border-success/30', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'bg-destructive/10 text-destructive border-destructive/30', icon: XCircle },
};

function RequestCard({ request }: { request: ServiceRequest }) {
  const { updateRequest } = useRequests();
  const [finalPrice, setFinalPrice] = useState(request.finalPrice?.toString() || request.estimatedPrice.toString());
  const [assignedStaff, setAssignedStaff] = useState(request.assignedStaff || '');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const StatusIcon = statusConfig[request.status].icon;

  const handleStatusChange = (status: ServiceRequest['status']) => {
    updateRequest(request.id, { status });
  };

  const handleSaveDetails = () => {
    updateRequest(request.id, {
      finalPrice: parseFloat(finalPrice),
      assignedStaff,
    });
    setIsDialogOpen(false);
  };

  const handlePaymentToggle = () => {
    updateRequest(request.id, { paymentReceived: !request.paymentReceived });
  };

  const getServiceNames = (serviceIds: string[]) => {
    return serviceIds.map(id => {
      if (id.startsWith('Other:')) return id;
      const service = services.find(s => s.id === id);
      return service?.name || id;
    });
  };

  return (
    <Card className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm text-muted-foreground">{request.id}</span>
            <Badge variant="outline" className={statusConfig[request.status].color}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {statusConfig[request.status].label}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {format(new Date(request.createdAt), 'MMM d, yyyy h:mm a')}
          </p>
        </div>
        {request.paymentReceived && (
          <Badge className="bg-success text-success-foreground">
            <DollarSign className="w-3 h-3 mr-1" />
            Paid
          </Badge>
        )}
      </div>

      {/* Patient Info */}
      <div className="grid gap-2 text-sm">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{request.patientName}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-muted-foreground" />
          <a href={`tel:${request.mobileNumber}`} className="text-primary hover:underline">
            {request.mobileNumber}
          </a>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span>{request.address}, {request.area}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span>{request.preferredDate} at {request.preferredTime}</span>
        </div>
      </div>

      {/* Services */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Services:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {getServiceNames(request.services).map((name, i) => (
            <Badge key={i} variant="secondary">{name}</Badge>
          ))}
        </div>
      </div>

      {/* Notes */}
      {request.notes && (
        <div className="p-3 bg-secondary/50 rounded-lg text-sm">
          <p className="text-muted-foreground italic">{request.notes}</p>
        </div>
      )}

      {/* Pricing */}
      <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
        <div>
          <p className="text-xs text-muted-foreground">
            {request.finalPrice ? 'Final Price' : 'Estimated Price'}
          </p>
          <p className="text-xl font-bold text-primary">
            Rs. {request.finalPrice || request.estimatedPrice}
          </p>
        </div>
        {request.assignedStaff && (
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Assigned Staff</p>
            <p className="font-medium">{request.assignedStaff}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 pt-2 border-t">
        {request.status === 'pending' && (
          <>
            <Button size="sm" onClick={() => handleStatusChange('accepted')}>
              <CheckCircle className="w-4 h-4 mr-1" />
              Accept
            </Button>
            <Button size="sm" variant="destructive" onClick={() => handleStatusChange('rejected')}>
              <XCircle className="w-4 h-4 mr-1" />
              Reject
            </Button>
          </>
        )}
        {request.status === 'accepted' && (
          <Button size="sm" onClick={() => handleStatusChange('on_the_way')}>
            <Truck className="w-4 h-4 mr-1" />
            On the Way
          </Button>
        )}
        {request.status === 'on_the_way' && (
          <Button size="sm" variant="success" onClick={() => handleStatusChange('completed')}>
            <CheckCircle className="w-4 h-4 mr-1" />
            Complete
          </Button>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              Edit Details
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Request Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="finalPrice">Final Price (Rs.)</Label>
                <Input
                  id="finalPrice"
                  type="number"
                  value={finalPrice}
                  onChange={e => setFinalPrice(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assignedStaff">Assigned Staff</Label>
                <Input
                  id="assignedStaff"
                  placeholder="Enter staff name"
                  value={assignedStaff}
                  onChange={e => setAssignedStaff(e.target.value)}
                />
              </div>
              <Button onClick={handleSaveDetails} className="w-full">
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Button 
          size="sm" 
          variant={request.paymentReceived ? 'secondary' : 'outline'}
          onClick={handlePaymentToggle}
        >
          <DollarSign className="w-4 h-4 mr-1" />
          {request.paymentReceived ? 'Payment Received' : 'Mark Paid'}
        </Button>
      </div>
    </Card>
  );
}

export default function AdminDashboard() {
  const { requests } = useRequests();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredRequests = statusFilter === 'all' 
    ? requests 
    : requests.filter(r => r.status === statusFilter);

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur border-b">
        <div className="container py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Manage service requests</p>
            </div>
            {pendingCount > 0 && (
              <Badge className="bg-warning text-warning-foreground">
                <AlertCircle className="w-3 h-3 mr-1" />
                {pendingCount} New
              </Badge>
            )}
          </div>

          {/* Filter */}
          <div className="mt-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Requests</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="on_the_way">On the Way</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Requests List */}
      <main className="container py-6">
        {filteredRequests.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-secondary mx-auto mb-4 flex items-center justify-center">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground">No Requests</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {statusFilter === 'all' 
                ? 'No service requests have been submitted yet'
                : `No ${statusFilter} requests found`}
            </p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredRequests.map(request => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
