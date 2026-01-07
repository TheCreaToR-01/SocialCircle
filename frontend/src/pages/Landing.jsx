import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EventCard from '../components/EventCard';
import { Button } from '../components/ui/button';
import { ArrowRight, Users, Shield, Sparkles, CheckCircle } from 'lucide-react';
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
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-navy-700 text-white py-24" data-testid="hero-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-2 mb-8">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">LAUNCHING IN DELHI NCR</span>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold tracking-tight mb-6">
              Real Connections.
              <span className="block text-accent"> Curated Dinners.</span>
            </h1>
            
            {/* Description */}
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              The Social Circle is an exclusive platform connecting interesting people through intimate, hosted micro-events. No random mixers, just meaningful conversations.
            </p>
            
            {/* Stats */}
            <div className="flex items-center justify-center gap-2 mb-10">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-white/20 border-2 border-white flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                ))}
              </div>
              <span className="text-sm font-medium">+120 Professionals Joined</span>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="#events">
                <Button size="lg" className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90 px-8 py-6 text-lg font-medium transition-all hover:scale-105" data-testid="browse-experiences-button">
                  Browse Experiences
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="lg" variant="outline" className="rounded-full border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-6 text-lg" data-testid="become-host-button">
                  Become a Host
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-primary mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join meaningful conversations in three simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white border border-border rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">1</span>
                </div>
              </div>
              <h3 className="text-xl font-heading font-bold mb-3">Create Profile</h3>
              <p className="text-muted-foreground">
                Tell us about your profession, interests, and what you bring to the table.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="bg-white border border-border rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">2</span>
                </div>
              </div>
              <h3 className="text-xl font-heading font-bold mb-3">Apply to Dinners</h3>
              <p className="text-muted-foreground">
                Browse curated dinners hosted by industry experts and fascinating locals.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="bg-white border border-border rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">3</span>
                </div>
              </div>
              <h3 className="text-xl font-heading font-bold mb-3">Get Invited</h3>
              <p className="text-muted-foreground">
                Hosts review applications to curate the perfect group. Pay only when accepted.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Safety */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="bg-gradient-to-br from-primary to-navy-700 rounded-3xl p-12 text-white">
            <div className="max-w-3xl mx-auto text-center">
              <Shield className="w-16 h-16 mx-auto mb-6 opacity-90" />
              <h2 className="text-3xl font-heading font-bold mb-4">Premium & Safe Community</h2>
              <p className="text-lg text-blue-100 mb-8">
                We differentiate massively by focusing on Trust & Safety through profile verification, host training, and a dual rating system.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Profile Verification</h4>
                    <p className="text-sm text-blue-100">Every member is verified for authenticity</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Host Training</h4>
                    <p className="text-sm text-blue-100">Hosts are trained to create great experiences</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Dual Rating System</h4>
                    <p className="text-sm text-blue-100">Mutual reviews maintain community standards</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Experiences */}
      <section id="events" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold text-primary mb-4">Featured Experiences</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover curated dinners and networking events in Delhi NCR
            </p>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12 bg-muted rounded-xl">
              <p className="text-muted-foreground text-lg">No experiences available at the moment. Check back soon!</p>
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

      {/* CTA Section */}
      <section className="py-20 bg-secondary">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <h2 className="text-4xl font-heading font-bold text-primary mb-6">
            Ready to Host Your Own Experience?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Create meaningful connections, monetize your expertise, and build your community.
          </p>
          <Link to="/signup">
            <Button size="lg" className="rounded-full bg-primary hover:bg-primary/90 px-10 py-6 text-lg">
              Apply to Host
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}

export default Landing;
