import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Calendar, DollarSign, TrendingUp, Users, Plus, Edit, Trash2, ShoppingCart, Eye, EyeOff, Send, CheckCircle, Ticket } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function MentorDashboard() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [events, setEvents] = useState([]);
  const [leads, setLeads] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [ticketPrice, setTicketPrice] = useState('');
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    category: '',
    event_datetime: '',
    duration: 60,
    available_slots: 10,
    price_per_lead: 0,
  });
  const [profileForm, setProfileForm] = useState({
    bio: '',
    expertise: '',
    experience: '',
  });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.user) {
      setUser(location.state.user);
      fetchData();
      return;
    }

    const checkAuth = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/auth/me`, { withCredentials: true });
        if (response.data.role !== 'MENTOR') {
          navigate('/');
          return;
        }
        setUser(response.data);
        fetchData();
      } catch (error) {
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate, location.state]);

  const fetchData = async () => {
    try {
      const [profileRes, eventsRes, leadsRes, invitationsRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/mentor/profile`, { withCredentials: true }),
        axios.get(`${BACKEND_URL}/api/mentor/events`, { withCredentials: true }),
        axios.get(`${BACKEND_URL}/api/mentor/leads`, { withCredentials: true }),
        axios.get(`${BACKEND_URL}/api/mentor/invitations`, { withCredentials: true }),
      ]);
      
      setProfile(profileRes.data);
      setEvents(eventsRes.data);
      setLeads(leadsRes.data);
      setInvitations(invitationsRes.data);
      
      setProfileForm({
        bio: profileRes.data.bio || '',
        expertise: profileRes.data.expertise?.join(', ') || '',
        experience: profileRes.data.experience || '',
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${BACKEND_URL}/api/mentor/profile`,
        {
          ...profileForm,
          expertise: profileForm.expertise.split(',').map(s => s.trim()).filter(Boolean),
        },
        { withCredentials: true }
      );
      toast.success('Profile updated successfully');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to update profile');
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${BACKEND_URL}/api/mentor/events`,
        { ...eventForm, event_datetime: new Date(eventForm.event_datetime).toISOString() },
        { withCredentials: true }
      );
      toast.success('Event created successfully');
      setShowCreateDialog(false);
      setEventForm({
        title: '',
        description: '',
        category: '',
        event_datetime: '',
        duration: 60,
        available_slots: 10,
        price_per_lead: 0,
      });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create event');
    }
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${BACKEND_URL}/api/mentor/events/${editingEvent.event_id}`,
        { ...eventForm, event_datetime: new Date(eventForm.event_datetime).toISOString() },
        { withCredentials: true }
      );
      toast.success('Event updated successfully');
      setEditingEvent(null);
      setEventForm({
        title: '',
        description: '',
        category: '',
        event_datetime: '',
        duration: 60,
        available_slots: 10,
        price_per_lead: 0,
      });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to update event');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    
    try {
      await axios.delete(`${BACKEND_URL}/api/mentor/events/${eventId}`, { withCredentials: true });
      toast.success('Event deleted successfully');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to delete event');
    }
  };

  const startEditEvent = (event) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title,
      description: event.description,
      category: event.category,
      event_datetime: new Date(event.event_datetime).toISOString().slice(0, 16),
      duration: event.duration,
      available_slots: event.available_slots,
      price_per_lead: event.price_per_lead,
    });
  };

  const handlePurchaseLead = async (lead) => {
    try {
      const orderResponse = await axios.post(
        `${BACKEND_URL}/api/mentor/leads/${lead.lead_id}/purchase`,
        {},
        { withCredentials: true }
      );

      // DEMO PAYMENT GATEWAY - Show payment code dialog
      const demoCode = orderResponse.data.demo_payment_code;
      const paymentId = orderResponse.data.payment_id;
      const amount = orderResponse.data.amount;
      
      // Show simple prompt for demo code entry
      const enteredCode = window.prompt(
        `Demo Payment Gateway\n\nAmount: ₹${amount}\n\nYour payment code is: ${demoCode}\n\nEnter the code above to complete payment:`,
        ''
      );
      
      if (enteredCode === demoCode) {
        // Verify payment
        try {
          await axios.post(
            `${BACKEND_URL}/api/mentor/payment-verify`,
            {
              demo_payment_code: enteredCode,
              payment_id: paymentId
            },
            { withCredentials: true }
          );
          toast.success('Lead purchased successfully! Check your email for lead details.');
          fetchData();
        } catch (error) {
          toast.error('Payment verification failed');
        }
      } else if (enteredCode !== null) {
        toast.error('Invalid payment code. Please try again.');
      }
      
      // COMMENTED OUT: Real Razorpay integration
      // const options = {
      //   key: orderResponse.data.key,
      //   amount: orderResponse.data.amount,
      //   currency: orderResponse.data.currency,
      //   order_id: orderResponse.data.order_id,
      //   name: 'LeadBridge',
      //   description: `Purchase lead for ${lead.event_title}`,
      //   handler: async function (response) {
      //     try {
      //       await axios.post(
      //         `${BACKEND_URL}/api/mentor/payment-verify`,
      //         {
      //           razorpay_payment_id: response.razorpay_payment_id,
      //           razorpay_order_id: response.razorpay_order_id,
      //           razorpay_signature: response.razorpay_signature,
      //         },
      //         { withCredentials: true }
      //       );
      //       toast.success('Lead purchased successfully!');
      //       fetchData();
      //     } catch (error) {
      //       toast.error('Payment verification failed');
      //     }
      //   },
      //   prefill: {
      //     name: user.name,
      //     email: user.email,
      //   },
      //   theme: {
      //     color: '#064E3B',
      //   },
      // };
      // const razorpay = new window.Razorpay(options);
      // razorpay.open();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to initiate purchase');
    }
  };

  const handleInviteGuest = async () => {
    if (!selectedLead || !ticketPrice) {
      toast.error('Please enter a ticket price');
      return;
    }

    try {
      await axios.post(
        `${BACKEND_URL}/api/mentor/leads/${selectedLead.lead_id}/invite`,
        { ticket_price: parseFloat(ticketPrice) },
        { withCredentials: true }
      );
      toast.success('Guest invited successfully! They will receive an email to pay for their ticket.');
      setShowInviteDialog(false);
      setSelectedLead(null);
      setTicketPrice('');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to invite guest');
    }
  };

  const openInviteDialog = (lead) => {
    setSelectedLead(lead);
    setTicketPrice(lead.price_per_lead?.toString() || '2000');
    setShowInviteDialog(true);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const verifiedLeads = leads.filter(l => l.status === 'VERIFIED');
  const purchasedLeads = leads.filter(l => l.status === 'PURCHASED');
  const invitedLeads = leads.filter(l => l.status === 'INVITED');
  const confirmedLeads = leads.filter(l => l.status === 'CONFIRMED');
  const totalRevenue = purchasedLeads.reduce((sum, lead) => sum + (lead.price_per_lead || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50/30">
      <Navbar user={user} />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12" data-testid="mentor-dashboard">
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold text-foreground mb-2">
            Mentor Dashboard
          </h1>
          <p className="text-muted-foreground">Manage your events and leads</p>
          
          {profile?.verification_status === 'PENDING' && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800">
                ⏳ Your mentor profile is pending verification. You can create events once approved.
              </p>
            </div>
          )}
          
          {profile?.verification_status === 'REJECTED' && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">
                ❌ Your mentor profile was rejected. Please contact support.
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-border shadow-sm rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Total Events</p>
                <p className="text-2xl font-heading font-bold">{events.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-border shadow-sm rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-accent-foreground" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Verified Leads</p>
                <p className="text-2xl font-heading font-bold">{verifiedLeads.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-border shadow-sm rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Purchased Leads</p>
                <p className="text-2xl font-heading font-bold">{purchasedLeads.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-border shadow-sm rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Total Spent</p>
                <p className="text-2xl font-heading font-bold">₹{totalRevenue}</p>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-white border border-border">
            <TabsTrigger value="profile" data-testid="tab-profile">Profile</TabsTrigger>
            <TabsTrigger value="events" data-testid="tab-events">Events</TabsTrigger>
            <TabsTrigger value="leads" data-testid="tab-leads">Leads</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="bg-white border border-border shadow-sm rounded-xl p-8">
              <h2 className="text-2xl font-heading font-bold mb-6">Mentor Profile</h2>
              
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                    placeholder="Tell users about yourself..."
                    rows={4}
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="expertise">Expertise (comma-separated)</Label>
                  <Input
                    id="expertise"
                    value={profileForm.expertise}
                    onChange={(e) => setProfileForm({ ...profileForm, expertise: e.target.value })}
                    placeholder="Web Development, Data Science, Marketing"
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="experience">Experience</Label>
                  <Textarea
                    id="experience"
                    value={profileForm.experience}
                    onChange={(e) => setProfileForm({ ...profileForm, experience: e.target.value })}
                    placeholder="Describe your professional experience..."
                    rows={4}
                    className="mt-2"
                  />
                </div>
                
                <Button type="submit" className="rounded-full bg-primary hover:bg-primary/90">
                  Update Profile
                </Button>
              </form>
            </div>
          </TabsContent>

          <TabsContent value="events">
            <div className="bg-white border border-border shadow-sm rounded-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-heading font-bold">My Events</h2>
                <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                  <DialogTrigger asChild>
                    <Button
                      className="rounded-full bg-primary hover:bg-primary/90"
                      disabled={profile?.verification_status !== 'APPROVED'}
                      data-testid="create-event-button"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Event
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create New Event</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateEvent} className="space-y-4">
                      <div>
                        <Label htmlFor="title">Event Title</Label>
                        <Input
                          id="title"
                          value={eventForm.title}
                          onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={eventForm.description}
                          onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                          required
                          rows={4}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="category">Category</Label>
                          <Input
                            id="category"
                            value={eventForm.category}
                            onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                            required
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="event_datetime">Date & Time</Label>
                          <Input
                            id="event_datetime"
                            type="datetime-local"
                            value={eventForm.event_datetime}
                            onChange={(e) => setEventForm({ ...eventForm, event_datetime: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="duration">Duration (min)</Label>
                          <Input
                            id="duration"
                            type="number"
                            value={eventForm.duration}
                            onChange={(e) => setEventForm({ ...eventForm, duration: parseInt(e.target.value) })}
                            required
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="available_slots">Slots</Label>
                          <Input
                            id="available_slots"
                            type="number"
                            value={eventForm.available_slots}
                            onChange={(e) => setEventForm({ ...eventForm, available_slots: parseInt(e.target.value) })}
                            required
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="price_per_lead">Price/Lead (₹)</Label>
                          <Input
                            id="price_per_lead"
                            type="number"
                            value={eventForm.price_per_lead}
                            onChange={(e) => setEventForm({ ...eventForm, price_per_lead: parseFloat(e.target.value) })}
                            required
                          />
                        </div>
                      </div>
                      
                      <Button type="submit" className="w-full rounded-full bg-primary hover:bg-primary/90">
                        Create Event
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              
              {events.length === 0 ? (
                <div className="text-center py-12 bg-muted rounded-xl">
                  <p className="text-muted-foreground">No events created yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {events.map((event) => (
                    <div
                      key={event.event_id}
                      className="border border-border rounded-lg p-6"
                      data-testid={`event-${event.event_id}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-heading font-bold mb-2">{event.title}</h3>
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            {event.description}
                          </p>
                          <div className="flex flex-wrap gap-4 text-sm">
                            <span className="text-muted-foreground">
                              📅 {new Date(event.event_datetime).toLocaleDateString()}
                            </span>
                            <span className="text-muted-foreground">
                              ⏱️ {event.duration} min
                            </span>
                            <span className="text-muted-foreground">
                              🎫 {event.available_slots} slots
                            </span>
                            <span className="text-muted-foreground">
                              💰 ₹{event.price_per_lead}/lead
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startEditEvent(event)}
                            data-testid={`edit-event-${event.event_id}`}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteEvent(event.event_id)}
                            className="text-red-600 hover:bg-red-50"
                            data-testid={`delete-event-${event.event_id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {editingEvent && (
              <Dialog open={!!editingEvent} onOpenChange={() => setEditingEvent(null)}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Edit Event</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleUpdateEvent} className="space-y-4">
                    <div>
                      <Label htmlFor="edit-title">Event Title</Label>
                      <Input
                        id="edit-title"
                        value={eventForm.title}
                        onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="edit-description">Description</Label>
                      <Textarea
                        id="edit-description"
                        value={eventForm.description}
                        onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                        required
                        rows={4}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="edit-category">Category</Label>
                        <Input
                          id="edit-category"
                          value={eventForm.category}
                          onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="edit-event_datetime">Date & Time</Label>
                        <Input
                          id="edit-event_datetime"
                          type="datetime-local"
                          value={eventForm.event_datetime}
                          onChange={(e) => setEventForm({ ...eventForm, event_datetime: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="edit-duration">Duration (min)</Label>
                        <Input
                          id="edit-duration"
                          type="number"
                          value={eventForm.duration}
                          onChange={(e) => setEventForm({ ...eventForm, duration: parseInt(e.target.value) })}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="edit-available_slots">Slots</Label>
                        <Input
                          id="edit-available_slots"
                          type="number"
                          value={eventForm.available_slots}
                          onChange={(e) => setEventForm({ ...eventForm, available_slots: parseInt(e.target.value) })}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="edit-price_per_lead">Price/Lead (₹)</Label>
                        <Input
                          id="edit-price_per_lead"
                          type="number"
                          value={eventForm.price_per_lead}
                          onChange={(e) => setEventForm({ ...eventForm, price_per_lead: parseFloat(e.target.value) })}
                          required
                        />
                      </div>
                    </div>
                    
                    <Button type="submit" className="w-full rounded-full bg-primary hover:bg-primary/90">
                      Update Event
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </TabsContent>

          <TabsContent value="leads">
            <div className="bg-white border border-border shadow-sm rounded-xl p-8">
              <h2 className="text-2xl font-heading font-bold mb-6">My Leads</h2>
              
              {leads.length === 0 ? (
                <div className="text-center py-12 bg-muted rounded-xl">
                  <p className="text-muted-foreground">No leads available yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {leads.map((lead) => (
                    <div
                      key={lead.lead_id}
                      className="border border-border rounded-lg p-6"
                      data-testid={`lead-${lead.lead_id}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-heading font-bold mb-2">{lead.event_title}</h3>
                          <div className="space-y-1 text-sm">
                            {lead.status === 'PURCHASED' ? (
                              <>
                                <p><strong>Name:</strong> {lead.name}</p>
                                <p><strong>Email:</strong> {lead.email}</p>
                                <p><strong>Phone:</strong> {lead.phone}</p>
                                {lead.message && <p><strong>Message:</strong> {lead.message}</p>}
                              </>
                            ) : (
                              <p className="text-muted-foreground flex items-center gap-2">
                                <EyeOff className="w-4 h-4" />
                                Contact details hidden until purchase
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              lead.status === 'PURCHASED'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {lead.status === 'PURCHASED' ? 'Purchased' : 'Verified'}
                          </span>
                          {lead.status === 'VERIFIED' && (
                            <Button
                              size="sm"
                              onClick={() => handlePurchaseLead(lead)}
                              className="rounded-full"
                              data-testid={`purchase-lead-${lead.lead_id}`}
                            >
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              Purchase (₹{lead.price_per_lead})
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default MentorDashboard;
