import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EventCard from '../components/EventCard';
import { Button } from '../components/ui/button';
import { ArrowRight, TrendingUp, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function Landing() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/events`);
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <section className="bg-gradient-to-br from-primary to-navy-700 text-white py-20" data-testid="hero-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold tracking-tight mb-6">
                Connect with Expert Mentors.
                <span className="block text-accent"> Get Quality Leads.</span>
              </h1>
              <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl">
                A two-sided marketplace where mentors meet learners. Book sessions as a user, or grow your business as a mentor with verified leads.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/signup">
                  <Button size="lg" className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90 px-8 py-6 text-lg font-medium transition-all hover:scale-105" data-testid="get-started-button">
                    Get Started
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="#events">
                  <Button size="lg" variant="outline" className="rounded-full border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-6 text-lg" data-testid="browse-events-button">
                    Browse Events
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:col-span-5">
              <img
                src="https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Professional mentor working"
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-secondary" data-testid="features-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-border rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-heading font-bold mb-2">Quality Leads</h3>
              <p className="text-muted-foreground">
                Verified user bookings ensure high-quality leads for mentors.
              </p>
            </div>
            <div className="bg-white border border-border rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-heading font-bold mb-2">Secure Payments</h3>
              <p className="text-muted-foreground">
                Razorpay-powered secure payment processing for all transactions.
              </p>
            </div>
            <div className="bg-white border border-border rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-heading font-bold mb-2">Easy Booking</h3>
              <p className="text-muted-foreground">
                Simple and intuitive event booking process for users.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="events" className="py-20" data-testid="events-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold mb-4">Upcoming Events</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Browse and book sessions with verified mentors across various domains.
            </p>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12 bg-muted rounded-xl">
              <p className="text-muted-foreground text-lg">No events available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <EventCard key={event.event_id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className="bg-emerald-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <p className="text-emerald-200">&copy; 2025 LeadBridge. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
