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
import { Calendar, Clock, Users, MapPin, ArrowLeft, ArrowRight, CheckCircle, Star, Share2 } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const EVENT_IMAGES = [
  'https://images.unsplash.com/photo-1670899460364-ebc917bac09a?w=1200&h=600&fit=crop',
  'https://images.unsplash.com/photo-1758272133417-011aebb36018?w=1200&h=600&fit=crop',
  'https://images.unsplash.com/photo-1715860738421-b30b98f8614f?w=1200&h=600&fit=crop',
  'https://images.unsplash.com/photo-1714038918910-daa51af9fccd?w=1200&h=600&fit=crop',
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
      toast.success('🎉 Application submitted! The host will review and get back to you.');
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
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex justify-center items-center py-40">
          <div className="w-16 h-16 border-4 border-coral-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!event) return null;

  const eventDate = new Date(event.event_datetime);
  const imageIndex = Math.abs(event.event_id?.charCodeAt(0) || 0) % EVENT_IMAGES.length;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-6">
        <Link to="/events" className="inline-flex items-center gap-2 text-navy-600 hover:text-coral-500 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Back to Events</span>
        </Link>
      </div>

      {/* Hero Image */}
      <section className="relative h-[400px] md:h-[500px] overflow-hidden">
        <img 
          src={EVENT_IMAGES[imageIndex]} 
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        
        {/* Category Badge */}
        <div className="absolute top-6 left-6 md:left-12">
          <span className="px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm font-bold text-navy-900">
            {event.category || 'Experience'}
          </span>
        </div>
        
        {/* Share Button */}
        <button className="absolute top-6 right-6 md:right-12 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors">
          <Share2 className="w-5 h-5 text-navy-900" />
        </button>
        
        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
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
                <h2 className="text-2xl font-bold text-navy-900 mb-4">About this experience</h2>
                <p className="text-lg text-navy-600 leading-relaxed">
                  {event.description}
                </p>
              </div>

              {/* What to Expect */}
              <div className="bg-navy-50 rounded-3xl p-8">
                <h3 className="text-xl font-bold text-navy-900 mb-6">What to expect 🎯</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { icon: '🍽️', text: 'Curated dining experience' },
                    { icon: '👥', text: 'Interesting, like-minded guests' },
                    { icon: '💬', text: 'Meaningful conversations' },
                    { icon: '🎉', text: 'New connections & friendships' },
                    { icon: '📸', text: 'Memorable moments' },
                    { icon: '✨', text: 'Unique experience' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <span className="text-2xl">{item.icon}</span>
                      <span className="text-navy-700">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Host Info */}
              <div className="border border-navy-200 rounded-3xl p-8">
                <h3 className="text-xl font-bold text-navy-900 mb-6">Meet your host</h3>
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-coral-400 to-coral-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                    {event.mentor_name?.[0] || 'H'}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-navy-900">{event.mentor_name}</h4>
                    <div className="flex items-center gap-1 text-yellow-500 mt-1">
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
              <div className="sticky top-8 bg-white border border-navy-200 rounded-3xl p-6 shadow-playful">
                <div className="text-center mb-6">
                  <span className="text-4xl font-extrabold text-navy-900">₹{event.price_per_lead}</span>
                  <span className="text-navy-500 text-lg"> / person</span>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between py-3 border-b border-navy-100">
                    <span className="flex items-center gap-2 text-navy-600">
                      <Calendar className="w-5 h-5 text-coral-400" />
                      Date
                    </span>
                    <span className="font-semibold text-navy-900">
                      {eventDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-navy-100">
                    <span className="flex items-center gap-2 text-navy-600">
                      <Clock className="w-5 h-5 text-coral-400" />
                      Duration
                    </span>
                    <span className="font-semibold text-navy-900">{event.duration} mins</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-navy-100">
                    <span className="flex items-center gap-2 text-navy-600">
                      <Users className="w-5 h-5 text-coral-400" />
                      Spots left
                    </span>
                    <span className="font-semibold text-coral-500">{event.available_slots} available</span>
                  </div>
                </div>

                <Button 
                  onClick={handleApply}
                  size="lg" 
                  className="w-full rounded-full bg-coral-500 hover:bg-coral-600 text-white py-6 text-lg font-bold shadow-glow btn-playful"
                >
                  Apply for this Event
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                
                <p className="text-center text-sm text-navy-500 mt-4">
                  Free to apply • Pay only if selected
                </p>

                {/* Trust Indicators */}
                <div className="mt-6 pt-6 border-t border-navy-100 space-y-3">
                  {[
                    'Verified host',
                    'Secure payment',
                    'Full refund if not selected'
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-navy-600">
                      <CheckCircle className="w-4 h-4 text-green-500" />
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
        <DialogContent className="max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Apply for this Event 🎉</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="bg-navy-50 rounded-2xl p-4 mb-6">
              <h4 className="font-bold text-navy-900">{event.title}</h4>
              <p className="text-sm text-navy-500">
                {eventDate.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
            </div>
            
            <div>
              <Label htmlFor="name" className="text-navy-900 font-semibold">Your Name *</Label>
              <Input
                id="name"
                value={applicationForm.name}
                onChange={(e) => setApplicationForm({ ...applicationForm, name: e.target.value })}
                placeholder="Enter your full name"
                className="mt-2 rounded-xl"
              />
            </div>
            
            <div>
              <Label htmlFor="email" className="text-navy-900 font-semibold">Email *</Label>
              <Input
                id="email"
                type="email"
                value={applicationForm.email}
                onChange={(e) => setApplicationForm({ ...applicationForm, email: e.target.value })}
                placeholder="Enter your email"
                className="mt-2 rounded-xl"
                disabled={!!user?.email}
              />
            </div>
            
            <div>
              <Label htmlFor="phone" className="text-navy-900 font-semibold">Phone Number *</Label>
              <Input
                id="phone"
                value={applicationForm.phone}
                onChange={(e) => setApplicationForm({ ...applicationForm, phone: e.target.value })}
                placeholder="Enter your phone number"
                className="mt-2 rounded-xl"
              />
            </div>
            
            <div>
              <Label htmlFor="message" className="text-navy-900 font-semibold">Why do you want to attend? (optional)</Label>
              <Textarea
                id="message"
                value={applicationForm.message}
                onChange={(e) => setApplicationForm({ ...applicationForm, message: e.target.value })}
                placeholder="Tell us a bit about yourself and why you're interested..."
                className="mt-2 rounded-xl"
                rows={3}
              />
            </div>
            
            <Button
              onClick={submitApplication}
              disabled={applying}
              className="w-full rounded-full bg-coral-500 hover:bg-coral-600 text-white py-6 text-lg font-bold mt-4"
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
