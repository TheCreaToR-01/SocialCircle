import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Calendar, Clock, User, DollarSign, MapPin } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function EventDetail() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvent();
    checkAuth();
  }, [eventId]);

  const checkAuth = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/auth/me`, { withCredentials: true });
      setUser(response.data);
      setBooking({
        ...booking,
        name: response.data.name,
        email: response.data.email,
      });
    } catch (error) {
      console.log('Not authenticated');
    }
  };

  const fetchEvent = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/events/${eventId}`);
      setEvent(response.data);
    } catch (error) {
      console.error('Error fetching event:', error);
      toast.error('Event not found');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to book this event');
      navigate('/login');
      return;
    }

    if (user.role !== 'USER') {
      toast.error('Only users can book events');
      return;
    }

    setSubmitting(true);

    try {
      await axios.post(
        `${BACKEND_URL}/api/events/${eventId}/book`,
        booking,
        { withCredentials: true }
      );
      toast.success('Booking successful! Check your dashboard.');
      navigate('/user/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar user={user} />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (!event) {
    return null;
  }

  const eventDate = new Date(event.event_datetime);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50/30">
      <Navbar user={user} />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white border border-border shadow-sm rounded-xl p-8" data-testid="event-detail">
              <div className="inline-block bg-accent/20 text-accent-foreground text-sm px-3 py-1 rounded-full mb-4">
                {event.category}
              </div>
              
              <h1 className="text-4xl font-heading font-bold text-foreground mb-6">
                {event.title}
              </h1>
              
              <div className="grid grid-cols-2 gap-4 mb-8 p-6 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Date</p>
                    <p className="font-medium">{eventDate.toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Duration</p>
                    <p className="font-medium">{event.duration} minutes</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Mentor</p>
                    <p className="font-medium">{event.mentor_name}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Price per Lead</p>
                    <p className="font-medium">₹{event.price_per_lead}</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-8">
                <h2 className="text-2xl font-heading font-bold mb-4">About This Event</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {event.description}
                </p>
              </div>
              
              {event.mentor_bio && (
                <div className="mb-8">
                  <h2 className="text-2xl font-heading font-bold mb-4">About the Mentor</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {event.mentor_bio}
                  </p>
                  {event.mentor_expertise && event.mentor_expertise.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {event.mentor_expertise.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-primary/10 text-primary text-xs px-3 py-1 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white border border-border shadow-sm rounded-xl p-6 sticky top-6">
              <h3 className="text-xl font-heading font-bold mb-4">Book This Event</h3>
              
              <div className="mb-4 p-4 bg-accent/10 border border-accent/30 rounded-lg">
                <p className="text-sm text-accent-foreground">
                  <strong>{event.available_slots}</strong> slots remaining
                </p>
              </div>
              
              <form onSubmit={handleBooking} className="space-y-4" data-testid="booking-form">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={booking.name}
                    onChange={(e) => setBooking({ ...booking, name: e.target.value })}
                    required
                    data-testid="booking-name"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={booking.email}
                    onChange={(e) => setBooking({ ...booking, email: e.target.value })}
                    required
                    data-testid="booking-email"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={booking.phone}
                    onChange={(e) => setBooking({ ...booking, phone: e.target.value })}
                    required
                    placeholder="+91 1234567890"
                    data-testid="booking-phone"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="message">Message (Optional)</Label>
                  <Textarea
                    id="message"
                    value={booking.message}
                    onChange={(e) => setBooking({ ...booking, message: e.target.value })}
                    placeholder="Tell the mentor about your goals..."
                    rows={4}
                    data-testid="booking-message"
                    className="mt-1"
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full rounded-full bg-primary hover:bg-primary/90 py-6"
                  disabled={submitting || event.available_slots === 0}
                  data-testid="submit-booking"
                >
                  {submitting ? 'Booking...' : event.available_slots === 0 ? 'No Slots Available' : 'Book Now'}
                </Button>
              </form>
              
              <p className="text-xs text-muted-foreground mt-4 text-center">
                Your details will be verified before being shared with the mentor
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetail;
