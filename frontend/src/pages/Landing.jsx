import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { ArrowRight, Users, Heart, Calendar, Clock, Star, Utensils, MessageCircle, Sparkles, Wine, Coffee, Palette, Briefcase, TrendingUp, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// Category data with icons
const CATEGORIES = [
  { name: 'Culinary', icon: Utensils, color: 'bg-pastel-peach text-navy-800' },
  { name: 'Networking', icon: Users, color: 'bg-pastel-blue text-navy-800' },
  { name: 'Art & Culture', icon: Palette, color: 'bg-cream-300 text-navy-800' },
  { name: 'Tech & Startups', icon: Sparkles, color: 'bg-pastel-blueLight text-navy-800' },
  { name: 'Wellness', icon: Leaf, color: 'bg-pastel-sage text-navy-800' },
  { name: 'Finance', icon: TrendingUp, color: 'bg-cream-200 text-navy-800' },
];

const EVENT_IMAGES = [
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=600&h=400&fit=crop',
];

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

  const getCategoryIcon = (category) => {
    const cat = CATEGORIES.find(c => c.name.toLowerCase().includes(category?.toLowerCase()) || category?.toLowerCase().includes(c.name.toLowerCase()));
    return cat?.icon || Utensils;
  };

  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        {/* Decorative shapes */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-pastel-blue rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-cream-300 rounded-full opacity-40 blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-pastel-blue/50 text-navy-700 rounded-full px-4 py-2 mb-6 text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                Now hosting in Delhi NCR
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading text-navy-900 leading-tight mb-6">
                Where strangers
                <span className="block text-navy-600 italic">become friends</span>
                <span className="text-4xl md:text-5xl">over dinner</span>
              </h1>
              
              <p className="text-lg text-navy-600 mb-8 max-w-xl leading-relaxed">
                Curated micro-events that bring interesting people together. 
                No awkward networking. Just real conversations and great food.
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <Link to="/events">
                  <Button size="lg" className="rounded-xl bg-navy-900 hover:bg-navy-800 text-white px-8 py-6 text-base font-medium shadow-soft-lg btn-soft">
                    Find Your Table
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="lg" variant="outline" className="rounded-xl border-2 border-navy-300 text-navy-700 hover:bg-navy-50 px-8 py-6 text-base font-medium">
                    Become a Host
                  </Button>
                </Link>
              </div>
              
              {/* Stats */}
              <div className="flex gap-10 mt-12 justify-center lg:justify-start">
                <div>
                  <p className="text-3xl font-heading text-navy-900">500+</p>
                  <p className="text-navy-500 text-sm">Happy Guests</p>
                </div>
                <div>
                  <p className="text-3xl font-heading text-navy-900">50+</p>
                  <p className="text-navy-500 text-sm">Events Hosted</p>
                </div>
                <div className="flex items-center gap-1">
                  <p className="text-3xl font-heading text-navy-900">4.9</p>
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                </div>
              </div>
            </div>
            
            {/* Right - Image Grid */}
            <div className="relative hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-2xl overflow-hidden shadow-soft-lg hover-lift h-48">
                    <img src={EVENT_IMAGES[0]} alt="Dinner gathering" className="w-full h-full object-cover" />
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-soft-lg hover-lift h-64 bg-pastel-blue/30 flex items-center justify-center">
                    <div className="text-center p-6">
                      <Wine className="w-12 h-12 text-navy-600 mx-auto mb-3" />
                      <p className="font-heading text-xl text-navy-800">Curated Experiences</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="rounded-2xl overflow-hidden shadow-soft-lg hover-lift h-64">
                    <img src={EVENT_IMAGES[1]} alt="Friends networking" className="w-full h-full object-cover" />
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-soft-lg hover-lift h-48 bg-cream-200 flex items-center justify-center">
                    <div className="text-center p-6">
                      <Heart className="w-12 h-12 text-navy-600 mx-auto mb-3" />
                      <p className="font-heading text-xl text-navy-800">Real Connections</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating card */}
              <div className="absolute -left-6 top-1/2 -translate-y-1/2 bg-white rounded-xl shadow-soft-xl p-5 animate-float">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-pastel-sage rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-navy-700" />
                  </div>
                  <div>
                    <p className="font-medium text-navy-800">New friends made</p>
                    <p className="text-2xl font-heading text-navy-900">2,500+</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-heading text-navy-900 mb-3">
                Upcoming Experiences
              </h2>
              <p className="text-lg text-navy-500">Find your next unforgettable dinner</p>
            </div>
            <Link to="/events" className="mt-4 md:mt-0">
              <Button variant="ghost" className="text-navy-600 hover:text-navy-800 font-medium text-base">
                View all events <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-12 h-12 border-3 border-navy-200 border-t-navy-600 rounded-full animate-spin"></div>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-20 bg-cream-100 rounded-2xl">
              <Utensils className="w-16 h-16 text-navy-300 mx-auto mb-4" />
              <p className="text-xl text-navy-500">No events yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.slice(0, 6).map((event, index) => {
                const CategoryIcon = getCategoryIcon(event.category);
                const eventDate = new Date(event.event_datetime);
                
                return (
                  <Link to={`/events/${event.event_id}`} key={event.event_id}>
                    <div className="bg-cream-50 rounded-2xl overflow-hidden shadow-soft card-elegant group cursor-pointer border border-cream-200">
                      {/* Image */}
                      <div className="relative h-52 overflow-hidden">
                        <img 
                          src={EVENT_IMAGES[index % EVENT_IMAGES.length]} 
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 to-transparent"></div>
                        
                        {/* Category Badge */}
                        <div className="absolute top-4 left-4">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-white/90 backdrop-blur-sm text-navy-700">
                            <CategoryIcon className="w-4 h-4" />
                            {event.category}
                          </span>
                        </div>
                        
                        {/* Price Badge */}
                        <div className="absolute bottom-4 left-4">
                          <span className="px-4 py-2 rounded-lg bg-white font-medium text-navy-900">
                            ₹{event.price_per_lead}
                          </span>
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="p-6">
                        <h3 className="text-xl font-heading text-navy-900 mb-2 group-hover:text-navy-600 transition-colors">
                          {event.title}
                        </h3>
                        <p className="text-navy-500 text-sm mb-4 line-clamp-2">{event.description}</p>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-navy-600">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-accent" />
                            {eventDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-accent" />
                            {event.duration} min
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Users className="w-4 h-4 text-accent" />
                            {event.available_slots} spots
                          </span>
                        </div>
                        
                        <div className="mt-5 pt-5 border-t border-cream-200 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-9 h-9 bg-pastel-blue rounded-lg flex items-center justify-center text-navy-700 font-medium">
                              {event.mentor_name?.[0] || 'H'}
                            </div>
                            <span className="text-sm text-navy-600">{event.mentor_name}</span>
                          </div>
                          <ArrowRight className="w-5 h-5 text-navy-400 group-hover:text-navy-600 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-cream-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading text-navy-900 mb-4">
              How it works
            </h2>
            <p className="text-lg text-navy-500 max-w-2xl mx-auto">
              Simple steps to your next great dinner experience
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: Sparkles,
                title: 'Find Your Event',
                description: 'Browse curated dinners by category, host, or date. Each event is unique and carefully designed.',
                color: 'bg-pastel-blue'
              },
              {
                step: '02',
                icon: MessageCircle,
                title: 'Apply & Get Selected',
                description: 'Tell us about yourself. Hosts curate the perfect guest mix for meaningful conversations.',
                color: 'bg-cream-200'
              },
              {
                step: '03',
                icon: Heart,
                title: 'Connect & Enjoy',
                description: 'Arrive, meet amazing people, enjoy great food, and build lasting connections.',
                color: 'bg-pastel-sage'
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-8 shadow-soft hover-lift text-center">
                <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                  <item.icon className="w-8 h-8 text-navy-700" />
                </div>
                <div className="inline-block bg-navy-900 text-white text-xs font-medium px-3 py-1 rounded-full mb-4">
                  Step {item.step}
                </div>
                <h3 className="text-2xl font-heading text-navy-900 mb-3">{item.title}</h3>
                <p className="text-navy-500 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h2 className="text-4xl font-heading text-navy-900 text-center mb-12">
            Explore by Interest
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((cat, idx) => (
              <Link to={`/events?category=${cat.name}`} key={idx}>
                <div className={`${cat.color} rounded-2xl p-6 text-center hover-lift cursor-pointer transition-all`}>
                  <cat.icon className="w-8 h-8 mx-auto mb-3" />
                  <p className="font-medium text-sm">{cat.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-cream-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h2 className="text-4xl font-heading text-navy-900 text-center mb-4">
            What people say
          </h2>
          <p className="text-lg text-navy-500 text-center mb-12">Real stories from real connections</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "I walked in nervous, walked out with 5 new friends! The host made everyone feel so welcome.",
                name: "Priya S.",
                event: "Startup Founders Dinner",
                icon: Users
              },
              {
                quote: "Best way to meet interesting people in Delhi. No small talk, just real conversations over amazing food.",
                name: "Rahul M.",
                event: "Art & Wine Evening",
                icon: Wine
              },
              {
                quote: "As an introvert, I was skeptical. But the curated group made it so easy to connect. I'm hooked!",
                name: "Ananya K.",
                event: "Tech Leaders Brunch",
                icon: Coffee
              }
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-8 shadow-soft hover-lift">
                <div className="w-12 h-12 bg-pastel-blue rounded-xl flex items-center justify-center mb-6">
                  <testimonial.icon className="w-6 h-6 text-navy-700" />
                </div>
                <p className="text-navy-700 text-lg mb-6 italic leading-relaxed">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-cream-200 rounded-xl flex items-center justify-center text-lg font-heading text-navy-700">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <p className="font-medium text-navy-900">{testimonial.name}</p>
                    <p className="text-sm text-navy-500">{testimonial.event}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-navy-900 relative overflow-hidden">
        {/* Decorative shapes */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-pastel-blue/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-cream-300/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-heading text-white mb-6">
            Ready to meet your people?
          </h2>
          <p className="text-xl text-navy-200 mb-10 leading-relaxed">
            Join The Social Circle and turn strangers into friends, one dinner at a time.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/events">
              <Button size="lg" className="rounded-xl bg-white text-navy-900 hover:bg-cream-100 px-10 py-6 text-base font-medium shadow-soft-lg">
                Explore Events
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="lg" variant="outline" className="rounded-xl border-2 border-white/30 text-white hover:bg-white/10 px-10 py-6 text-base font-medium">
                Host a Dinner
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Landing;
