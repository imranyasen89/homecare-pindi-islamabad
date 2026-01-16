import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useServiceRequests, DbServiceRequest } from '@/hooks/useServiceRequests';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { services } from '@/data/services';
import { format } from 'date-fns';
import { 
  Clock, MapPin, Phone, User, FileText, 
  CheckCircle, XCircle, Truck, DollarSign,
  Calendar, AlertCircle, Loader2, LogOut, MessageSquare, Mail
} from 'lucide-react';

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-warning/10 text-warning border-warning/30', icon: Clock },
  accepted: { label: 'Accepted', color: 'bg-primary/10 text-primary border-primary/30', icon: CheckCircle },
  on_the_way: { label: 'On the Way', color: 'bg-medical/10 text-medical border-medical/30', icon: Truck },
  completed: { label: 'Completed', color: 'bg-success/10 text-success border-success/30', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'bg-destructive/10 text-destructive border-destructive/30', icon: XCircle },
};

interface RequestCardProps {
  request: DbServiceRequest;
  onUpdate: (id: string, updates: Partial<DbServiceRequest>) => void;
}

function RequestCard({ request, onUpdate }: RequestCardProps) {
  const [finalPrice, setFinalPrice] = useState(request.final_price?.toString() || request.estimated_price.toString());
  const [assignedStaff, setAssignedStaff] = useState(request.assigned_staff || '');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const StatusIcon = statusConfig[request.status].icon;

const getStatusMessage = (status: DbServiceRequest['status']) => {
    const messages: Record<string, string> = {
      accepted: `Hello ${request.patient_name}, your home care service request has been ACCEPTED. We will contact you shortly to confirm the schedule.`,
      on_the_way: `Hello ${request.patient_name}, our medical professional is ON THE WAY to your location. Please be ready.`,
      completed: `Hello ${request.patient_name}, your service has been COMPLETED. Thank you for choosing us! Please make payment via JazzCash: 03047070016`,
      rejected: `Hello ${request.patient_name}, we regret to inform you that we are unable to fulfill your request at this time. Please contact us for more details.`,
    };
    return messages[status] || `Hello ${request.patient_name}, your request status has been updated to: ${status}`;
  };

  const handleStatusChange = (status: DbServiceRequest['status']) => {
    onUpdate(request.id, { status });
  };

  const sendStatusUpdateSMS = (status: DbServiceRequest['status']) => {
    const message = getStatusMessage(status);
    window.open(`sms:${request.mobile_number}?body=${encodeURIComponent(message)}`, '_blank');
  };

  const sendStatusUpdateWhatsApp = (status: DbServiceRequest['status']) => {
    const message = getStatusMessage(status);
    const phone = request.mobile_number.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const sendPaymentReceivedNotification = () => {
    const message = `Hello ${request.patient_name}, we have RECEIVED your payment of Rs. ${request.final_price || request.estimated_price}. Thank you for choosing our services!`;
    return message;
  };

  const handleSaveDetails = () => {
    onUpdate(request.id, {
      final_price: parseFloat(finalPrice),
      assigned_staff: assignedStaff,
    });
    setIsDialogOpen(false);
  };

  const handlePaymentToggle = () => {
    onUpdate(request.id, { payment_received: !request.payment_received });
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
            <span className="font-mono text-sm text-muted-foreground">{request.id.slice(0, 8)}</span>
            <Badge variant="outline" className={statusConfig[request.status].color}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {statusConfig[request.status].label}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {format(new Date(request.created_at), 'MMM d, yyyy h:mm a')}
          </p>
        </div>
        {request.payment_received && (
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
          <span className="font-medium">{request.patient_name}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{request.mobile_number}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span>{request.address}, {request.area}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span>{request.preferred_date} at {request.preferred_time}</span>
        </div>
      </div>

      {/* Contact Patient Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <Button 
          size="sm" 
          variant="outline"
          className="bg-success/10 border-success/30 text-success hover:bg-success/20"
          asChild
        >
          <a href={`tel:${request.mobile_number}`}>
            <Phone className="w-4 h-4 mr-1" />
            Call
          </a>
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          className="bg-primary/10 border-primary/30 text-primary hover:bg-primary/20"
          asChild
        >
          <a href={`sms:${request.mobile_number}?body=Hello ${encodeURIComponent(request.patient_name)}, this is a message regarding your home care service booking.`}>
            <MessageSquare className="w-4 h-4 mr-1" />
            SMS
          </a>
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          className="bg-green-500/10 border-green-500/30 text-green-600 hover:bg-green-500/20"
          asChild
        >
          <a 
            href={`https://wa.me/${request.mobile_number.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${request.patient_name}, this is a message regarding your home care service booking.`)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageSquare className="w-4 h-4 mr-1" />
            WhatsApp
          </a>
        </Button>
        {request.email && (
          <Button 
            size="sm" 
            variant="outline"
            className="bg-blue-500/10 border-blue-500/30 text-blue-600 hover:bg-blue-500/20"
            asChild
          >
            <a href={`mailto:${request.email}?subject=Home Care Service Booking&body=Hello ${encodeURIComponent(request.patient_name)},%0D%0A%0D%0AThis is regarding your home care service booking.`}>
              <Mail className="w-4 h-4 mr-1" />
              Email
            </a>
          </Button>
        )}
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
            {request.final_price ? 'Final Price' : 'Estimated Price'}
          </p>
          <p className="text-xl font-bold text-primary">
            Rs. {request.final_price || request.estimated_price}
          </p>
        </div>
        {request.assigned_staff && (
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Assigned Staff</p>
            <p className="font-medium">{request.assigned_staff}</p>
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
          <Button size="sm" variant="default" onClick={() => handleStatusChange('completed')}>
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
          variant={request.payment_received ? 'secondary' : 'outline'}
          onClick={handlePaymentToggle}
        >
          <DollarSign className="w-4 h-4 mr-1" />
          {request.payment_received ? 'Payment Received' : 'Mark Paid'}
        </Button>
      </div>

      {/* Status Update Notifications */}
      {request.status !== 'pending' && (
        <div className="pt-2 border-t space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Send Status Update to Patient:</p>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline"
              className="bg-primary/10 border-primary/30 text-primary hover:bg-primary/20"
              onClick={() => sendStatusUpdateSMS(request.status)}
            >
              <MessageSquare className="w-4 h-4 mr-1" />
              SMS Update
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              className="bg-green-500/10 border-green-500/30 text-green-600 hover:bg-green-500/20"
              onClick={() => sendStatusUpdateWhatsApp(request.status)}
            >
              <MessageSquare className="w-4 h-4 mr-1" />
              WhatsApp Update
            </Button>
          </div>
          {request.payment_received && (
            <div className="flex gap-2 mt-2">
              <Button 
                size="sm" 
                variant="outline"
                className="bg-success/10 border-success/30 text-success hover:bg-success/20"
                onClick={() => {
                  const msg = sendPaymentReceivedNotification();
                  window.open(`sms:${request.mobile_number}?body=${encodeURIComponent(msg)}`, '_blank');
                }}
              >
                <DollarSign className="w-4 h-4 mr-1" />
                SMS Payment Confirm
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="bg-success/10 border-success/30 text-success hover:bg-success/20"
                onClick={() => {
                  const msg = sendPaymentReceivedNotification();
                  const phone = request.mobile_number.replace(/[^0-9]/g, '');
                  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
                }}
              >
                <DollarSign className="w-4 h-4 mr-1" />
                WhatsApp Payment
              </Button>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, isLoading: authLoading, isAdmin, signOut } = useAuth();
  const { requests, isLoading, updateRequest } = useServiceRequests();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [authLoading, user, navigate]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-destructive/10 mx-auto mb-4 flex items-center justify-center">
            <XCircle className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Access Denied</h2>
          <p className="text-muted-foreground mt-2">You don't have admin privileges to access this page.</p>
          <Button onClick={signOut} variant="outline" className="mt-4">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </Card>
      </div>
    );
  }

  const filteredRequests = statusFilter === 'all' 
    ? requests 
    : requests.filter(r => r.status === statusFilter);

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  // Financial Summary calculations
  const completedRequests = requests.filter(r => r.status === 'completed');
  const totalRevenue = completedRequests.reduce((sum, r) => sum + (r.final_price || r.estimated_price), 0);
  const paidRevenue = completedRequests.filter(r => r.payment_received).reduce((sum, r) => sum + (r.final_price || r.estimated_price), 0);
  const unpaidRevenue = totalRevenue - paidRevenue;
  const completedCount = completedRequests.length;
  const paidCount = completedRequests.filter(r => r.payment_received).length;

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur border-b">
        <div className="container py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Manage service requests & health blogs</p>
            </div>
            <div className="flex items-center gap-2">
              {pendingCount > 0 && (
                <Badge className="bg-warning text-warning-foreground">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {pendingCount} New
                </Badge>
              )}
              <Button variant="outline" size="sm" asChild>
                <a href="#/admin/blog">Blog Manager</a>
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </Button>
            </div>
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

      {/* Financial Summary */}
      <div className="container py-4 border-b">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-primary" />
          Financial Summary
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card className="p-3 bg-primary/5">
            <p className="text-xs text-muted-foreground">Total Revenue</p>
            <p className="text-xl font-bold text-primary">Rs. {totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">{completedCount} completed</p>
          </Card>
          <Card className="p-3 bg-success/10">
            <p className="text-xs text-muted-foreground">Paid</p>
            <p className="text-xl font-bold text-success">Rs. {paidRevenue.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">{paidCount} payments</p>
          </Card>
          <Card className="p-3 bg-warning/10">
            <p className="text-xs text-muted-foreground">Unpaid</p>
            <p className="text-xl font-bold text-warning">Rs. {unpaidRevenue.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">{completedCount - paidCount} pending</p>
          </Card>
          <Card className="p-3 bg-secondary">
            <p className="text-xs text-muted-foreground">Total Requests</p>
            <p className="text-xl font-bold">{requests.length}</p>
            <p className="text-xs text-muted-foreground">{pendingCount} pending</p>
          </Card>
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
              <RequestCard key={request.id} request={request} onUpdate={updateRequest} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
