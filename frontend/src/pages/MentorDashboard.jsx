import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Calendar, DollarSign, TrendingUp, Users, Plus, ShoppingCart, Eye, EyeOff, Send, CheckCircle, Ticket, XCircle, Clock, ArrowRight, Utensils, Palette, Briefcase, Leaf, Coffee } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const CATEGORIES = [
  { name: 'Culinary', icon: Utensils },
  { name: 'Entrepreneurship', icon: Briefcase },
  { name: 'Art & Culture', icon: Palette },
  { name: 'Professional Networking', icon: Users },
  { name: 'Finance', icon: TrendingUp },
  { name: 'Tech', icon: Coffee },
  { name: 'Wellness', icon: Leaf },
];

function MentorDashboard() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [events, setEvents] = useState([]);
  const [leads, setLeads] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [projectedRevenue, setProjectedRevenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showProjectedRevenueDialog, setShowProjectedRevenueDialog] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [ticketPrice, setTicketPrice] = useState('');
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    category: 'Culinary',
    event_datetime: '',
    duration: 120,
    available_slots: 8,
    price_per_lead: 2500,
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
      const [profileRes, eventsRes, leadsRes, invitationsRes, projectedRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/mentor/profile`, { withCredentials: true }),
        axios.get(`${BACKEND_URL}/api/mentor/events`, { withCredentials: true }),
        axios.get(`${BACKEND_URL}/api/mentor/leads`, { withCredentials: true }),
        axios.get(`${BACKEND_URL}/api/mentor/invitations`, { withCredentials: true }),
        axios.get(`${BACKEND_URL}/api/mentor/leads/projected-revenue`, { withCredentials: true }).catch(() => ({ data: null })),
      ]);
      
      setProfile(profileRes.data);
      setEvents(eventsRes.data);
      setLeads(leadsRes.data);
      setInvitations(invitationsRes.data);
      setProjectedRevenue(projectedRes.data);
      
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

  const handleCreateEvent = async () => {
    try {
      await axios.post(
        `${BACKEND_URL}/api/mentor/events`,
        eventForm,
        { withCredentials: true }
      );
      toast.success('Event created successfully!');
      setShowCreateDialog(false);
      setEventForm({
        title: '',
        description: '',
        category: 'Culinary',
        event_datetime: '',
        duration: 120,
        available_slots: 8,
        price_per_lead: 2500,
      });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create event');
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await axios.put(
        `${BACKEND_URL}/api/mentor/profile`,
        {
          ...profileForm,
          expertise: profileForm.expertise.split(',').map(e => e.trim()).filter(e => e),
        },
        { withCredentials: true }
      );
      toast.success('Profile updated!');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to update profile');
    }
  };

  const handlePurchaseLead = async (lead) => {
    try {
      const orderResponse = await axios.post(
        `${BACKEND_URL}/api/mentor/leads/${lead.lead_id}/purchase`,
        {},
        { withCredentials: true }
      );

      const demoCode = orderResponse.data.demo_payment_code;
      const paymentId = orderResponse.data.payment_id;
      const amount = orderResponse.data.amount;
      
      const enteredCode = window.prompt(
        `Purchase Lead\n\nLead: ${lead.name}\nEvent: ${lead.event_title}\nAmount: ₹${amount}\n\nYour payment code is: ${demoCode}\n\nEnter the code to complete purchase:`,
        ''
      );
      
      if (enteredCode === demoCode) {
        try {
          await axios.post(
            `${BACKEND_URL}/api/mentor/payment-verify`,
            { demo_payment_code: enteredCode, payment_id: paymentId },
            { withCredentials: true }
          );
          toast.success('Lead purchased! You can now Invite or Pass.');
          fetchData();
        } catch (error) {
          toast.error('Payment verification failed');
        }
      } else if (enteredCode !== null) {
        toast.error('Invalid payment code. Please try again.');
      }
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
      toast.success('Invitation sent! Guest will receive an email.');
      setShowInviteDialog(false);
      setSelectedLead(null);
      setTicketPrice('');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to invite guest');
    }
  };

  const handlePassGuest = async (lead) => {
    if (!window.confirm(`Are you sure you want to pass on ${lead.name}? They will receive an email notification.`)) {
      return;
    }

    try {
      await axios.post(
        `${BACKEND_URL}/api/mentor/leads/${lead.lead_id}/pass`,
        {},
        { withCredentials: true }
      );
      toast.success('Guest notified.');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to pass guest');
    }
  };

  const openInviteDialog = (lead) => {
    setSelectedLead(lead);
    setTicketPrice(lead.price_per_lead?.toString() || '2500');
    setShowInviteDialog(true);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="w-12 h-12 border-3 border-navy-200 border-t-navy-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const verifiedLeads = leads.filter(l => l.status === 'VERIFIED');
  const purchasedLeads = leads.filter(l => l.status === 'PURCHASED');
  const invitedLeads = leads.filter(l => l.status === 'INVITED');
  const confirmedLeads = leads.filter(l => l.status === 'CONFIRMED');
  const totalSpent = purchasedLeads.reduce((sum, lead) => sum + (lead.price_per_lead || 0), 0) + 
                     invitedLeads.reduce((sum, lead) => sum + (lead.price_per_lead || 0), 0) +
                     confirmedLeads.reduce((sum, lead) => sum + (lead.price_per_lead || 0), 0);

  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar user={user} />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8" data-testid="mentor-dashboard">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-14 h-14 bg-pastel-blue rounded-xl flex items-center justify-center text-navy-700 text-xl font-heading">
              {user.name?.[0]?.toUpperCase() || 'H'}
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-heading text-navy-900">
                Welcome back, {user.name}
              </h1>
              <p className="text-navy-500">Manage your events and connect with guests</p>
            </div>
          </div>
          
          {profile?.verification_status === 'PENDING' && (
            <div className="mt-4 p-4 bg-cream-200 border border-cream-300 rounded-xl">
              <p className="text-navy-700">Your host profile is pending verification. You can create events once approved.</p>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-soft hover-lift">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-pastel-blue rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-navy-700" />
              </div>
              <div>
                <p className="text-navy-500 text-xs">Events</p>
                <p className="text-xl font-heading text-navy-900">{events.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-soft hover-lift cursor-pointer" onClick={() => setShowProjectedRevenueDialog(true)}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-pastel-sage rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-navy-700" />
              </div>
              <div>
                <p className="text-navy-500 text-xs">Verified</p>
                <p className="text-xl font-heading text-navy-900">{verifiedLeads.length}</p>
              </div>
            </div>
            {projectedRevenue && projectedRevenue.total_leads > 0 && (
              <p className="text-xs text-navy-500 mt-2">
                ₹{projectedRevenue.total_potential_revenue} potential
              </p>
            )}
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-soft hover-lift">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-cream-200 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-navy-700" />
              </div>
              <div>
                <p className="text-navy-500 text-xs">Purchased</p>
                <p className="text-xl font-heading text-navy-900">{purchasedLeads.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-soft hover-lift">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-pastel-peach rounded-lg flex items-center justify-center">
                <Send className="w-5 h-5 text-navy-700" />
              </div>
              <div>
                <p className="text-navy-500 text-xs">Invited</p>
                <p className="text-xl font-heading text-navy-900">{invitedLeads.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-soft hover-lift">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-pastel-sage rounded-lg flex items-center justify-center">
                <Ticket className="w-5 h-5 text-navy-700" />
              </div>
              <div>
                <p className="text-navy-500 text-xs">Confirmed</p>
                <p className="text-xl font-heading text-navy-900">{confirmedLeads.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-soft hover-lift">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-cream-300 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-navy-700" />
              </div>
              <div>
                <p className="text-navy-500 text-xs">Spent</p>
                <p className="text-xl font-heading text-navy-900">₹{totalSpent}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="leads" className="space-y-6">
          <TabsList className="bg-white rounded-xl p-1 shadow-soft border border-cream-200">
            <TabsTrigger value="leads" className="rounded-lg font-medium data-[state=active]:bg-navy-900 data-[state=active]:text-white" data-testid="tab-leads">
              Leads
            </TabsTrigger>
            <TabsTrigger value="events" className="rounded-lg font-medium data-[state=active]:bg-navy-900 data-[state=active]:text-white" data-testid="tab-events">
              Events
            </TabsTrigger>
            <TabsTrigger value="invitations" className="rounded-lg font-medium data-[state=active]:bg-navy-900 data-[state=active]:text-white" data-testid="tab-invitations">
              Invitations
            </TabsTrigger>
            <TabsTrigger value="profile" className="rounded-lg font-medium data-[state=active]:bg-navy-900 data-[state=active]:text-white" data-testid="tab-profile">
              Profile
            </TabsTrigger>
          </TabsList>

          {/* Leads Tab */}
          <TabsContent value="leads">
            <div className="bg-white rounded-2xl p-8 shadow-soft">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-heading text-navy-900">My Leads</h2>
                {verifiedLeads.length > 0 && (
                  <Button 
                    onClick={() => setShowProjectedRevenueDialog(true)}
                    variant="outline"
                    className="rounded-xl border-navy-200 text-navy-600 hover:bg-cream-50"
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    View Revenue
                  </Button>
                )}
              </div>
              
              {leads.length === 0 ? (
                <div className="text-center py-16 bg-cream-100 rounded-xl">
                  <Users className="w-12 h-12 text-navy-300 mx-auto mb-4" />
                  <p className="text-navy-600 text-lg">No leads yet</p>
                  <p className="text-navy-400 mt-2">When guests apply to your events, they&apos;ll appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {leads.map((lead) => (
                    <div
                      key={lead.lead_id}
                      className={`rounded-xl p-6 border transition-all ${
                        lead.status === 'PURCHASED' 
                          ? 'border-pastel-blue bg-pastel-blueLight/30' 
                          : lead.status === 'CONFIRMED'
                          ? 'border-pastel-sage bg-pastel-sage/30'
                          : lead.status === 'PASSED'
                          ? 'border-cream-200 bg-cream-100 opacity-60'
                          : 'border-cream-200 bg-white'
                      }`}
                      data-testid={`lead-${lead.lead_id}`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-medium text-navy-900">{lead.event_title}</h3>
                            <span
                              className={`px-3 py-1 rounded-lg text-xs font-medium ${
                                lead.status === 'CONFIRMED'
                                  ? 'bg-pastel-sage text-navy-700'
                                  : lead.status === 'INVITED'
                                  ? 'bg-pastel-peach text-navy-700'
                                  : lead.status === 'PURCHASED'
                                  ? 'bg-pastel-blue text-navy-700'
                                  : lead.status === 'PASSED'
                                  ? 'bg-cream-200 text-navy-500'
                                  : 'bg-cream-200 text-navy-700'
                              }`}
                            >
                              {lead.status === 'CONFIRMED' ? 'Confirmed' : 
                               lead.status === 'INVITED' ? 'Invited' :
                               lead.status === 'PURCHASED' ? 'Purchased' : 
                               lead.status === 'PASSED' ? 'Passed' : 
                               'Verified'}
                            </span>
                          </div>
                          
                          <div className="space-y-1 text-sm">
                            {['PURCHASED', 'INVITED', 'CONFIRMED', 'PASSED'].includes(lead.status) ? (
                              <div className="grid md:grid-cols-3 gap-2 text-navy-600">
                                <p><span className="text-navy-400">Name:</span> {lead.name}</p>
                                <p><span className="text-navy-400">Email:</span> {lead.email}</p>
                                <p><span className="text-navy-400">Phone:</span> {lead.phone}</p>
                              </div>
                            ) : (
                              <p className="text-navy-400 flex items-center gap-2">
                                <EyeOff className="w-4 h-4" />
                                Contact details hidden until purchase
                              </p>
                            )}
                            {lead.message && lead.status !== 'VERIFIED' && (
                              <p className="mt-2 p-3 bg-cream-100 rounded-lg text-navy-600 text-sm">
                                {lead.message}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {lead.status === 'VERIFIED' && (
                            <Button
                              onClick={() => handlePurchaseLead(lead)}
                              className="rounded-xl bg-navy-900 hover:bg-navy-800"
                              data-testid={`purchase-lead-${lead.lead_id}`}
                            >
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              Purchase ₹{lead.price_per_lead}
                            </Button>
                          )}
                          {lead.status === 'PURCHASED' && (
                            <>
                              <Button
                                onClick={() => openInviteDialog(lead)}
                                className="rounded-xl bg-navy-900 hover:bg-navy-800"
                                data-testid={`invite-lead-${lead.lead_id}`}
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Invite
                              </Button>
                              <Button
                                onClick={() => handlePassGuest(lead)}
                                variant="outline"
                                className="rounded-xl border-navy-200 text-navy-600 hover:bg-cream-50"
                                data-testid={`pass-lead-${lead.lead_id}`}
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Pass
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events">
            <div className="bg-white rounded-2xl p-8 shadow-soft">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-heading text-navy-900">My Events</h2>
                {profile?.verification_status === 'APPROVED' && (
                  <Button 
                    onClick={() => setShowCreateDialog(true)} 
                    className="rounded-xl bg-navy-900 hover:bg-navy-800"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Event
                  </Button>
                )}
              </div>
              
              {events.length === 0 ? (
                <div className="text-center py-16 bg-cream-100 rounded-xl">
                  <Calendar className="w-12 h-12 text-navy-300 mx-auto mb-4" />
                  <p className="text-navy-600 text-lg">No events yet</p>
                  <p className="text-navy-400 mt-2">Create your first dinner experience!</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {events.map((event) => {
                    const CategoryIcon = CATEGORIES.find(c => c.name === event.category)?.icon || Utensils;
                    return (
                      <div key={event.event_id} className="border border-cream-200 rounded-xl p-6 hover-lift">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-pastel-blue rounded-lg flex items-center justify-center">
                              <CategoryIcon className="w-5 h-5 text-navy-700" />
                            </div>
                            <span className="text-sm text-navy-500">{event.category}</span>
                          </div>
                          <span className="text-lg font-heading text-navy-900">₹{event.price_per_lead}</span>
                        </div>
                        <h3 className="text-xl font-heading text-navy-900 mb-2">{event.title}</h3>
                        <p className="text-navy-500 text-sm mb-4 line-clamp-2">{event.description}</p>
                        <div className="flex items-center gap-4 text-sm text-navy-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(event.event_datetime).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {event.available_slots} spots
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Invitations Tab */}
          <TabsContent value="invitations">
            <div className="bg-white rounded-2xl p-8 shadow-soft">
              <h2 className="text-2xl font-heading text-navy-900 mb-6">Sent Invitations</h2>
              
              {invitations.length === 0 ? (
                <div className="text-center py-16 bg-cream-100 rounded-xl">
                  <Send className="w-12 h-12 text-navy-300 mx-auto mb-4" />
                  <p className="text-navy-600 text-lg">No invitations sent yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {invitations.map((invitation) => (
                    <div
                      key={invitation.invitation_id}
                      className="border border-cream-200 rounded-xl p-6"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-navy-900">{invitation.event_title}</h3>
                          <p className="text-sm text-navy-500 mt-1">
                            {invitation.guest_name} • {invitation.guest_email}
                          </p>
                          <p className="text-sm text-navy-500">
                            Ticket: ₹{invitation.ticket_price} • {new Date(invitation.invited_at).toLocaleDateString()}
                          </p>
                        </div>
                        <span
                          className={`px-4 py-2 rounded-lg text-sm font-medium ${
                            invitation.status === 'PAID'
                              ? 'bg-pastel-sage text-navy-700'
                              : 'bg-cream-200 text-navy-600'
                          }`}
                        >
                          {invitation.status === 'PAID' ? 'Paid' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="bg-white rounded-2xl p-8 shadow-soft">
              <h2 className="text-2xl font-heading text-navy-900 mb-6">Host Profile</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-navy-700 font-medium">Bio</Label>
                  <Textarea
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                    placeholder="Tell guests about yourself..."
                    className="mt-2 rounded-xl"
                    rows={4}
                  />
                </div>
                <div>
                  <Label className="text-navy-700 font-medium">Expertise (comma-separated)</Label>
                  <Input
                    value={profileForm.expertise}
                    onChange={(e) => setProfileForm({ ...profileForm, expertise: e.target.value })}
                    placeholder="e.g., Culinary Arts, Wine Pairing"
                    className="mt-2 rounded-xl"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label className="text-navy-700 font-medium">Experience</Label>
                  <Textarea
                    value={profileForm.experience}
                    onChange={(e) => setProfileForm({ ...profileForm, experience: e.target.value })}
                    placeholder="Share your background..."
                    className="mt-2 rounded-xl"
                    rows={3}
                  />
                </div>
              </div>
              <Button onClick={handleUpdateProfile} className="mt-6 rounded-xl bg-navy-900 hover:bg-navy-800">
                Save Profile
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Dialogs */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="max-w-lg rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-heading">Create New Event</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label className="font-medium">Event Title</Label>
                <Input
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  placeholder="e.g., Farm-to-Table Dinner"
                  className="mt-2 rounded-xl"
                />
              </div>
              <div>
                <Label className="font-medium">Category</Label>
                <select
                  value={eventForm.category}
                  onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                  className="w-full mt-2 p-3 rounded-xl border border-cream-200 bg-cream-50"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.name} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="font-medium">Description</Label>
                <Textarea
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  placeholder="Describe your event..."
                  className="mt-2 rounded-xl"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium">Date & Time</Label>
                  <Input
                    type="datetime-local"
                    value={eventForm.event_datetime}
                    onChange={(e) => setEventForm({ ...eventForm, event_datetime: e.target.value })}
                    className="mt-2 rounded-xl"
                  />
                </div>
                <div>
                  <Label className="font-medium">Duration (mins)</Label>
                  <Input
                    type="number"
                    value={eventForm.duration}
                    onChange={(e) => setEventForm({ ...eventForm, duration: parseInt(e.target.value) })}
                    className="mt-2 rounded-xl"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium">Available Spots</Label>
                  <Input
                    type="number"
                    value={eventForm.available_slots}
                    onChange={(e) => setEventForm({ ...eventForm, available_slots: parseInt(e.target.value) })}
                    className="mt-2 rounded-xl"
                  />
                </div>
                <div>
                  <Label className="font-medium">Ticket Price (₹)</Label>
                  <Input
                    type="number"
                    value={eventForm.price_per_lead}
                    onChange={(e) => setEventForm({ ...eventForm, price_per_lead: parseInt(e.target.value) })}
                    className="mt-2 rounded-xl"
                  />
                </div>
              </div>
              <Button onClick={handleCreateEvent} className="w-full rounded-xl bg-navy-900 hover:bg-navy-800 mt-4">
                Create Event
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
          <DialogContent className="max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-heading">Invite Guest</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              {selectedLead && (
                <>
                  <div className="p-4 bg-cream-100 rounded-xl">
                    <p className="font-medium text-navy-900">{selectedLead.name}</p>
                    <p className="text-sm text-navy-500">{selectedLead.email}</p>
                    <p className="text-sm text-navy-500 mt-2">Event: {selectedLead.event_title}</p>
                  </div>
                  <div>
                    <Label className="font-medium">Ticket Price (₹)</Label>
                    <Input
                      type="number"
                      value={ticketPrice}
                      onChange={(e) => setTicketPrice(e.target.value)}
                      className="mt-2 rounded-xl"
                    />
                    <p className="text-xs text-navy-400 mt-2">
                      The guest will receive an email to pay this amount.
                    </p>
                  </div>
                  <Button 
                    onClick={handleInviteGuest} 
                    className="w-full rounded-xl bg-navy-900 hover:bg-navy-800"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Invitation
                  </Button>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showProjectedRevenueDialog} onOpenChange={setShowProjectedRevenueDialog}>
          <DialogContent className="max-w-lg rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-heading flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-navy-600" />
                Projected Revenue
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              {projectedRevenue && projectedRevenue.projected_data?.length > 0 ? (
                <>
                  <div className="space-y-4 mb-6">
                    {projectedRevenue.projected_data.map((item) => (
                      <div key={item.event_id} className="p-4 bg-cream-100 rounded-xl">
                        <h4 className="font-medium text-navy-900">{item.event_title}</h4>
                        <div className="grid grid-cols-3 gap-4 mt-2 text-sm">
                          <div>
                            <p className="text-navy-400">Leads</p>
                            <p className="font-medium text-navy-900">{item.lead_count}</p>
                          </div>
                          <div>
                            <p className="text-navy-400">Price/Lead</p>
                            <p className="font-medium text-navy-900">₹{item.price_per_lead}</p>
                          </div>
                          <div>
                            <p className="text-navy-400">Potential</p>
                            <p className="font-medium text-navy-900">₹{item.potential_revenue}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-6 bg-navy-900 rounded-xl text-white">
                    <p className="text-sm text-navy-300">Total Projected Revenue</p>
                    <p className="text-3xl font-heading">₹{projectedRevenue.total_potential_revenue}</p>
                    <p className="text-sm mt-2 text-navy-300">from {projectedRevenue.total_leads} verified leads</p>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <TrendingUp className="w-12 h-12 text-navy-300 mx-auto mb-4" />
                  <p className="text-navy-600">No verified leads yet</p>
                  <p className="text-navy-400 text-sm mt-2">Revenue projections will appear here</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default MentorDashboard;
