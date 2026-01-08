import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Calendar, Clock, CheckCircle, XCircle, Loader, Ticket, CreditCard, Mail, PartyPopper } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function UserDashboard() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
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
        if (response.data.role !== 'USER') {
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
      const [bookingsRes, invitationsRes, ticketsRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/user/bookings`, { withCredentials: true }),
        axios.get(`${BACKEND_URL}/api/user/invitations`, { withCredentials: true }),
        axios.get(`${BACKEND_URL}/api/user/tickets`, { withCredentials: true }),
      ]);
      setBookings(bookingsRes.data);
      setInvitations(invitationsRes.data);
      setTickets(ticketsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayForTicket = async (invitation) => {
    try {
      const orderResponse = await axios.post(
        `${BACKEND_URL}/api/user/invitations/${invitation.invitation_id}/pay`,
        {},
        { withCredentials: true }
      );

      // DEMO PAYMENT GATEWAY
      const demoCode = orderResponse.data.demo_payment_code;
      const paymentId = orderResponse.data.payment_id;
      const amount = orderResponse.data.amount;
      
      const enteredCode = window.prompt(
        `🎫 Ticket Payment\n\nEvent: ${invitation.event_title}\nAmount: ₹${amount}\n\nYour payment code is: ${demoCode}\n\nEnter the code above to complete payment:`,
        ''
      );
      
      if (enteredCode === demoCode) {
        try {
          await axios.post(
            `${BACKEND_URL}/api/user/ticket-payment-verify`,
            {
              demo_payment_code: enteredCode,
              payment_id: paymentId
            },
            { withCredentials: true }
          );
          toast.success('🎉 Ticket purchased successfully! Check your email for confirmation.');
          fetchData();
        } catch (error) {
          toast.error('Payment verification failed');
        }
      } else if (enteredCode !== null) {
        toast.error('Invalid payment code. Please try again.');
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to initiate payment');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'VERIFIED':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'PURCHASED':
      case 'INVITED':
        return <Mail className="w-5 h-5 text-purple-600" />;
      case 'CONFIRMED':
        return <Ticket className="w-5 h-5 text-green-600" />;
      case 'REJECTED':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Loader className="w-5 h-5 text-yellow-600 animate-spin" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'VERIFIED':
        return 'Verified';
      case 'PURCHASED':
        return 'Under Review';
      case 'INVITED':
        return 'Invited! Pay Now';
      case 'CONFIRMED':
        return 'Ticket Confirmed';
      case 'REJECTED':
        return 'Rejected';
      default:
        return 'Pending Review';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const pendingInvitations = invitations.filter(i => i.status === 'PENDING');

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50/30">
      <Navbar user={user} />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12" data-testid="user-dashboard">
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold text-foreground mb-2">
            Welcome back, {user.name}!
          </h1>
          <p className="text-muted-foreground">Manage your applications, invitations, and tickets</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-border shadow-sm rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Applications</p>
                <p className="text-xl font-heading font-bold">{bookings.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-border shadow-sm rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Invitations</p>
                <p className="text-xl font-heading font-bold">{pendingInvitations.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-border shadow-sm rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Ticket className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Tickets</p>
                <p className="text-xl font-heading font-bold">{tickets.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-border shadow-sm rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <PartyPopper className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Events Attended</p>
                <p className="text-xl font-heading font-bold">{tickets.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Invitations Alert */}
        {pendingInvitations.length > 0 && (
          <div className="mb-8 p-4 bg-purple-50 border border-purple-200 rounded-xl">
            <div className="flex items-center gap-3">
              <Mail className="w-6 h-6 text-purple-600" />
              <div>
                <p className="font-medium text-purple-800">
                  🎉 You have {pendingInvitations.length} pending invitation{pendingInvitations.length > 1 ? 's' : ''}!
                </p>
                <p className="text-sm text-purple-600">
                  Pay for your tickets to confirm your spot at the events.
                </p>
              </div>
            </div>
          </div>
        )}

        <Tabs defaultValue={pendingInvitations.length > 0 ? "invitations" : "bookings"} className="space-y-6">
          <TabsList className="bg-white border border-border">
            <TabsTrigger value="bookings" data-testid="tab-bookings">My Applications</TabsTrigger>
            <TabsTrigger value="invitations" data-testid="tab-invitations" className="relative">
              Invitations
              {pendingInvitations.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-purple-600 text-white text-xs rounded-full flex items-center justify-center">
                  {pendingInvitations.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="tickets" data-testid="tab-tickets">My Tickets</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            <div className="bg-white border border-border shadow-sm rounded-xl p-6">
              <h2 className="text-2xl font-heading font-bold mb-6">My Applications</h2>
              
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-12 bg-muted rounded-xl">
                  <p className="text-muted-foreground">You haven't applied to any events yet.</p>
                  <button
                    onClick={() => navigate('/')}
                    className="mt-4 text-primary font-medium hover:underline"
                  >
                    Browse Events
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div
                      key={booking.lead_id}
                      className="border border-border rounded-lg p-6 hover:border-primary/30 transition-colors"
                      data-testid={`booking-${booking.lead_id}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-heading font-bold text-foreground mb-2">
                            {booking.event_title}
                          </h3>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>
                                Applied on {new Date(booking.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-full">
                          {getStatusIcon(booking.status)}
                          <span className="text-sm font-medium">{getStatusText(booking.status)}</span>
                        </div>
                      </div>
                      
                      {booking.status === 'PURCHASED' && (
                        <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                          <p className="text-sm text-primary font-medium">
                            ✓ The host has reviewed your application. Check your invitations!
                          </p>
                        </div>
                      )}
                      
                      {booking.status === 'CONFIRMED' && (
                        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-sm text-green-700 font-medium">
                            🎉 Your ticket is confirmed! See you at the event.
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="invitations">
            <div className="bg-white border border-border shadow-sm rounded-xl p-6">
              <h2 className="text-2xl font-heading font-bold mb-6">Event Invitations</h2>
              
              {invitations.length === 0 ? (
                <div className="text-center py-12 bg-muted rounded-xl">
                  <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No invitations yet.</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    When a host selects you for their event, you&apos;ll see the invitation here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {invitations.map((invitation) => (
                    <div
                      key={invitation.invitation_id}
                      className={`border rounded-lg p-6 ${
                        invitation.status === 'PENDING' 
                          ? 'border-purple-300 bg-purple-50/50' 
                          : 'border-border'
                      }`}
                      data-testid={`invitation-${invitation.invitation_id}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {invitation.status === 'PENDING' && (
                              <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full">
                                NEW
                              </span>
                            )}
                            <h3 className="text-lg font-heading font-bold text-foreground">
                              {invitation.event_title}
                            </h3>
                          </div>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <p><strong>Host:</strong> {invitation.host_name}</p>
                            {invitation.event_datetime && (
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(invitation.event_datetime).toLocaleDateString()} at {new Date(invitation.event_datetime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                              </div>
                            )}
                            {invitation.event_duration && (
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>{invitation.event_duration} minutes</span>
                              </div>
                            )}
                            <p className="text-lg font-bold text-foreground mt-2">
                              Ticket Price: ₹{invitation.ticket_price}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {invitation.status === 'PENDING' ? (
                            <Button
                              onClick={() => handlePayForTicket(invitation)}
                              className="rounded-full bg-purple-600 hover:bg-purple-700"
                              data-testid={`pay-ticket-${invitation.invitation_id}`}
                            >
                              <CreditCard className="w-4 h-4 mr-2" />
                              Pay ₹{invitation.ticket_price}
                            </Button>
                          ) : (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              ✓ Paid
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {invitation.event_description && (
                        <div className="mt-4 p-4 bg-muted rounded-lg">
                          <p className="text-sm text-muted-foreground">{invitation.event_description}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="tickets">
            <div className="bg-white border border-border shadow-sm rounded-xl p-6">
              <h2 className="text-2xl font-heading font-bold mb-6">My Tickets</h2>
              
              {tickets.length === 0 ? (
                <div className="text-center py-12 bg-muted rounded-xl">
                  <Ticket className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No tickets yet.</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Once you pay for an event invitation, your ticket will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tickets.map((ticket) => (
                    <div
                      key={ticket.ticket_id}
                      className="border border-green-300 bg-green-50/30 rounded-lg p-6"
                      data-testid={`ticket-${ticket.ticket_id}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Ticket className="w-5 h-5 text-green-600" />
                            <h3 className="text-lg font-heading font-bold text-foreground">
                              {ticket.event_title}
                            </h3>
                          </div>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <p><strong>Host:</strong> {ticket.host_name}</p>
                            <p><strong>Ticket ID:</strong> {ticket.ticket_id}</p>
                            {ticket.event_datetime && (
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(ticket.event_datetime).toLocaleDateString()} at {new Date(ticket.event_datetime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                              </div>
                            )}
                            {ticket.event_duration && (
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>{ticket.event_duration} minutes</span>
                              </div>
                            )}
                            <p className="font-medium text-green-700 mt-2">
                              Amount Paid: ₹{ticket.ticket_price}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Confirmed
                          </span>
                        </div>
                      </div>
                      
                      {ticket.event_description && (
                        <div className="mt-4 p-4 bg-white rounded-lg border border-green-200">
                          <p className="text-sm text-muted-foreground">{ticket.event_description}</p>
                        </div>
                      )}
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

export default UserDashboard;
