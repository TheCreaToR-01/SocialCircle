import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Calendar, Clock, Users, ArrowLeft, ArrowRight, CheckCircle, Star, Share2, Utensils, Heart, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const EVENT_IMAGES = [
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=600&fit=crop',
  'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1200&h=600&fit=crop',
  'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=1200&h=600&fit=crop',
  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&h=600&fit=crop',
];

function EventDetail() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applicationForm, setApplicationForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  useEffect(() => {
    fetchEvent();
    checkAuth();
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/events/${eventId}`);
      setEvent(response.data);
    } catch (error) {
      console.error('Error fetching event:', error);
      toast.error('Event not found');
      navigate('/events');
    } finally {
      setLoading(false);
    }
  };

  const checkAuth = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/auth/me`, { withCredentials: true });
      setUser(response.data);
      setApplicationForm(prev => ({
        ...prev,
        name: response.data.name || '',
        email: response.data.email || ''
      }));
    } catch (error) {
      // Not logged in
    }
  };

  const handleApply = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/events/${eventId}` } });
      return;
    }
    setShowApplyDialog(true);
  };

  const submitApplication = async () => {
    if (!applicationForm.name || !applicationForm.email || !applicationForm.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    setApplying(true);
    try {
      await axios.post(
        `${BACKEND_URL}/api/bookings`,
        {
          event_id: eventId,
          ...applicationForm
        },
        { withCredentials: true }
      );
      toast.success('Application submitted! The host will review and get back to you.');
      setShowApplyDialog(false);
      navigate('/user/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50">
        <Navbar />
        <div className="flex justify-center items-center py-40">
          <div className="w-12 h-12 border-3 border-navy-200 border-t-navy-600 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!event) return null;

  const eventDate = new Date(event.event_datetime);
  const imageIndex = Math.abs(event.event_id?.charCodeAt(0) || 0) % EVENT_IMAGES.length;

  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />
      
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-6">
        <Link to="/events" className="inline-flex items-center gap-2 text-navy-600 hover:text-navy-900 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Events</span>
        </Link>
      </div>

      {/* Hero Image */}
      <section className="relative h-[400px] md:h-[480px] overflow-hidden mx-6 md:mx-12 rounded-2xl">
        <img 
          src={EVENT_IMAGES[imageIndex]} 
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/70 via-navy-900/30 to-transparent"></div>
        
        {/* Category Badge */}
        <div className="absolute top-6 left-6">
          <span className="px-4 py-2 rounded-xl bg-white/90 backdrop-blur-sm font-medium text-navy-900">
            {event.category || 'Experience'}
          </span>
        </div>
        
        {/* Share Button */}
        <button className="absolute top-6 right-6 w-11 h-11 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white transition-colors">
          <Share2 className="w-5 h-5 text-navy-900" />
        </button>
        
        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <h1 className="text-3xl md:text-5xl font-heading text-white mb-4">
            {event.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-white/90">
            <span className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {eventDate.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              {eventDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <div>
                <h2 className="text-2xl font-heading text-navy-900 mb-4">About this experience</h2>
                <p className="text-lg text-navy-600 leading-relaxed">
                  {event.description}
                </p>
              </div>

              {/* What to Expect */}
              <div className="bg-cream-100 rounded-2xl p-8">
                <h3 className="text-xl font-heading text-navy-900 mb-6">What to expect</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { icon: Utensils, text: 'Curated dining experience' },
                    { icon: Users, text: 'Interesting, like-minded guests' },
                    { icon: MessageCircle, text: 'Meaningful conversations' },
                    { icon: Heart, text: 'New connections & friendships' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                        <item.icon className="w-5 h-5 text-navy-600" />
                      </div>
                      <span className="text-navy-700">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Host Info */}
              <div className="border border-cream-200 rounded-2xl p-8">
                <h3 className="text-xl font-heading text-navy-900 mb-6">Meet your host</h3>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-pastel-blue rounded-xl flex items-center justify-center text-navy-700 text-2xl font-heading">
                    {event.mentor_name?.[0] || 'H'}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-heading text-navy-900">{event.mentor_name}</h4>
                    <div className="flex items-center gap-1 text-amber-500 mt-1">
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-navy-500 text-sm ml-2">Verified Host</span>
                    </div>
                    <p className="text-navy-600 mt-3">
                      An experienced host who creates memorable dining experiences and meaningful connections.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar - Booking Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white border border-cream-200 rounded-2xl p-6 shadow-soft">
                <div className="text-center mb-6">
                  <span className="text-4xl font-heading text-navy-900">₹{event.price_per_lead}</span>
                  <span className="text-navy-500 text-lg"> / person</span>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between py-3 border-b border-cream-200">
                    <span className="flex items-center gap-2 text-navy-600">
                      <Calendar className="w-5 h-5 text-accent" />
                      Date
                    </span>
                    <span className="font-medium text-navy-900">
                      {eventDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-cream-200">
                    <span className="flex items-center gap-2 text-navy-600">
                      <Clock className="w-5 h-5 text-accent" />
                      Duration
                    </span>
                    <span className="font-medium text-navy-900">{event.duration} mins</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-cream-200">
                    <span className="flex items-center gap-2 text-navy-600">
                      <Users className="w-5 h-5 text-accent" />
                      Spots left
                    </span>
                    <span className="font-medium text-navy-900">{event.available_slots} available</span>
                  </div>
                </div>

                <Button 
                  onClick={handleApply}
                  size="lg" 
                  className="w-full rounded-xl bg-navy-900 hover:bg-navy-800 text-white py-6 text-base font-medium shadow-soft btn-soft"
                >
                  Apply for this Event
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                
                <p className="text-center text-sm text-navy-500 mt-4">
                  Free to apply • Pay only if selected
                </p>

                {/* Trust Indicators */}
                <div className="mt-6 pt-6 border-t border-cream-200 space-y-3">
                  {[
                    'Verified host',
                    'Secure payment',
                    'Full refund if not selected'
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-navy-600">
                      <CheckCircle className="w-4 h-4 text-pastel-blueDark" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Dialog */}
      <Dialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-heading text-center">Apply for this Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="bg-cream-100 rounded-xl p-4 mb-6">
              <h4 className="font-medium text-navy-900">{event.title}</h4>
              <p className="text-sm text-navy-500">
                {eventDate.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
            </div>
            
            <div>
              <Label className="text-navy-900 font-medium">Your Name *</Label>
              <Input
                value={applicationForm.name}
                onChange={(e) => setApplicationForm({ ...applicationForm, name: e.target.value })}
                placeholder="Enter your full name"
                className="mt-2 rounded-xl"
              />
            </div>
            
            <div>
              <Label className="text-navy-900 font-medium">Email *</Label>
              <Input
                type="email"
                value={applicationForm.email}
                onChange={(e) => setApplicationForm({ ...applicationForm, email: e.target.value })}
                placeholder="Enter your email"
                className="mt-2 rounded-xl"
                disabled={!!user?.email}
              />
            </div>
            
            <div>
              <Label className="text-navy-900 font-medium">Phone Number *</Label>
              <Input
                value={applicationForm.phone}
                onChange={(e) => setApplicationForm({ ...applicationForm, phone: e.target.value })}
                placeholder="Enter your phone number"
                className="mt-2 rounded-xl"
              />
            </div>
            
            <div>
              <Label className="text-navy-900 font-medium">Why do you want to attend? (optional)</Label>
              <Textarea
                value={applicationForm.message}
                onChange={(e) => setApplicationForm({ ...applicationForm, message: e.target.value })}
                placeholder="Tell us a bit about yourself..."
                className="mt-2 rounded-xl"
                rows={3}
              />
            </div>
            
            <Button
              onClick={submitApplication}
              disabled={applying}
              className="w-full rounded-xl bg-navy-900 hover:bg-navy-800 text-white py-6 text-base font-medium mt-4"
            >
              {applying ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </span>
              ) : (
                <>Submit Application</>
              )}
            </Button>
            
            <p className="text-center text-xs text-navy-400">
              By applying, you agree to our terms. You&apos;ll only pay if selected by the host.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}

export default EventDetail;
