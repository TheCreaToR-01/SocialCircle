import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { ArrowRight, Sparkles, Users, Heart, Calendar, MapPin, Clock, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// Category data with emojis and colors
const CATEGORIES = [
  { name: 'Culinary', emoji: '🍽️', color: 'bg-orange-100 text-orange-700', bgColor: 'from-orange-500 to-red-500' },
  { name: 'Networking', emoji: '🤝', color: 'bg-blue-100 text-blue-700', bgColor: 'from-blue-500 to-indigo-500' },
  { name: 'Art & Culture', emoji: '🎨', color: 'bg-purple-100 text-purple-700', bgColor: 'from-purple-500 to-pink-500' },
  { name: 'Tech & Startups', emoji: '💡', color: 'bg-cyan-100 text-cyan-700', bgColor: 'from-cyan-500 to-blue-500' },
  { name: 'Wellness', emoji: '🧘', color: 'bg-green-100 text-green-700', bgColor: 'from-green-500 to-teal-500' },
  { name: 'Finance', emoji: '📈', color: 'bg-yellow-100 text-yellow-700', bgColor: 'from-yellow-500 to-orange-500' },
];

// Sample images for hero
const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1670899460364-ebc917bac09a?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1758272133417-011aebb36018?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1715860738421-b30b98f8614f?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1714038918910-daa51af9fccd?w=400&h=300&fit=crop',
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

  const getCategoryStyle = (category) => {
    const cat = CATEGORIES.find(c => c.name.toLowerCase().includes(category?.toLowerCase()) || category?.toLowerCase().includes(c.name.toLowerCase()));
    return cat || CATEGORIES[0];
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <Navbar />
      
      {/* Hero Section - Playful */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 text-6xl animate-float opacity-20">✨</div>
        <div className="absolute top-40 right-20 text-5xl animate-wiggle opacity-20">🎉</div>
        <div className="absolute bottom-20 left-1/4 text-4xl animate-bounce-soft opacity-20">💫</div>
        
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-coral-100 text-coral-600 rounded-full px-4 py-2 mb-6 text-sm font-semibold">
                <Sparkles className="w-4 h-4" />
                Now in Delhi NCR
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-navy-900 leading-tight mb-6">
                Where strangers
                <span className="block text-coral-500">become friends</span>
                <span className="text-4xl md:text-5xl">over dinner 👀</span>
              </h1>
              
              <p className="text-xl text-navy-600 mb-8 max-w-xl">
                Curated micro-events that bring interesting people together. 
                No awkward networking. Just real conversations and great food.
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <Link to="/events">
                  <Button size="lg" className="rounded-full bg-coral-500 hover:bg-coral-600 text-white px-8 py-6 text-lg font-bold shadow-playful hover:shadow-playful-lg transition-all btn-playful">
                    Find Your Table
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="lg" variant="outline" className="rounded-full border-2 border-navy-900 text-navy-900 hover:bg-navy-900 hover:text-white px-8 py-6 text-lg font-bold">
                    Become a Host
                  </Button>
                </Link>
              </div>
              
              {/* Stats */}
              <div className="flex gap-8 mt-10 justify-center lg:justify-start">
                <div className="text-center">
                  <p className="text-3xl font-extrabold text-navy-900">500+</p>
                  <p className="text-navy-500 text-sm">Happy Guests</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-extrabold text-navy-900">50+</p>
                  <p className="text-navy-500 text-sm">Events Hosted</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-extrabold text-navy-900">4.9</p>
                  <p className="text-navy-500 text-sm flex items-center justify-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> Rating
                  </p>
                </div>
              </div>
            </div>
            
            {/* Right - Image Collage */}
            <div className="relative hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-3xl overflow-hidden shadow-playful hover-lift h-48">
                    <img src={HERO_IMAGES[0]} alt="Dinner gathering" className="w-full h-full object-cover" />
                  </div>
                  <div className="rounded-3xl overflow-hidden shadow-playful hover-lift h-64">
                    <img src={HERO_IMAGES[1]} alt="Friends networking" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="rounded-3xl overflow-hidden shadow-playful hover-lift h-64">
                    <img src={HERO_IMAGES[2]} alt="Group dinner" className="w-full h-full object-cover" />
                  </div>
                  <div className="rounded-3xl overflow-hidden shadow-playful hover-lift h-48">
                    <img src={HERO_IMAGES[3]} alt="Social gathering" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
              
              {/* Floating card */}
              <div className="absolute -left-8 top-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-playful-lg p-4 animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-coral-100 rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-coral-500" />
                  </div>
                  <div>
                    <p className="font-bold text-navy-900">New friends made</p>
                    <p className="text-2xl font-extrabold text-coral-500">2,500+</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="py-16 bg-gradient-to-b from-white to-navy-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10">
            <div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-navy-900 mb-2">
                Upcoming experiences ✨
              </h2>
              <p className="text-xl text-navy-500">Find your next unforgettable dinner</p>
            </div>
            <Link to="/events" className="mt-4 md:mt-0">
              <Button variant="ghost" className="text-coral-500 hover:text-coral-600 font-bold text-lg">
                View all events <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-16 h-16 border-4 border-coral-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl shadow-playful">
              <span className="text-6xl mb-4 block">🍽️</span>
              <p className="text-xl text-navy-500">No events yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.slice(0, 6).map((event, index) => {
                const catStyle = getCategoryStyle(event.category);
                const eventDate = new Date(event.event_datetime);
                
                return (
                  <Link to={`/events/${event.event_id}`} key={event.event_id}>
                    <div className="bg-white rounded-3xl overflow-hidden shadow-playful card-playful group cursor-pointer">
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden">
                        <div className={`absolute inset-0 bg-gradient-to-br ${catStyle.bgColor} opacity-90`}></div>
                        <img 
                          src={HERO_IMAGES[index % HERO_IMAGES.length]} 
                          alt={event.title}
                          className="w-full h-full object-cover mix-blend-overlay"
                        />
                        <div className="absolute top-4 left-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-bold ${catStyle.color}`}>
                            {catStyle.emoji} {event.category}
                          </span>
                        </div>
                        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                          <span className="font-bold text-navy-900">₹{event.price_per_lead}</span>
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-navy-900 mb-2 group-hover:text-coral-500 transition-colors">
                          {event.title}
                        </h3>
                        <p className="text-navy-500 text-sm mb-4 line-clamp-2">{event.description}</p>
                        
                        <div className="flex flex-wrap gap-3 text-sm text-navy-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-coral-400" />
                            {eventDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-coral-400" />
                            {event.duration} min
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4 text-coral-400" />
                            {event.available_slots} spots
                          </span>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-navy-100 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-navy-100 rounded-full flex items-center justify-center">
                              <Users className="w-4 h-4 text-navy-600" />
                            </div>
                            <span className="text-sm text-navy-600">by {event.mentor_name}</span>
                          </div>
                          <ArrowRight className="w-5 h-5 text-coral-400 group-hover:translate-x-1 transition-transform" />
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
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-navy-900 mb-4">
              How it works 🎯
            </h2>
            <p className="text-xl text-navy-500 max-w-2xl mx-auto">
              Simple steps to your next great dinner experience
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                emoji: '🔍',
                title: 'Find Your Event',
                description: 'Browse curated dinners by category, host, or date. Each event is unique!',
                color: 'bg-coral-50 border-coral-200'
              },
              {
                step: '02',
                emoji: '📝',
                title: 'Apply & Get Selected',
                description: 'Tell us about yourself. Hosts curate the perfect guest mix for great conversations.',
                color: 'bg-blue-50 border-blue-200'
              },
              {
                step: '03',
                emoji: '🎉',
                title: 'Show Up & Connect',
                description: 'Arrive, meet amazing people, enjoy great food, and make lasting connections!',
                color: 'bg-green-50 border-green-200'
              }
            ].map((item, idx) => (
              <div key={idx} className={`${item.color} border-2 rounded-3xl p-8 text-center hover-lift`}>
                <span className="text-5xl mb-4 block">{item.emoji}</span>
                <div className="inline-block bg-navy-900 text-white text-sm font-bold px-3 py-1 rounded-full mb-4">
                  Step {item.step}
                </div>
                <h3 className="text-2xl font-bold text-navy-900 mb-3">{item.title}</h3>
                <p className="text-navy-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-navy-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h2 className="text-4xl font-extrabold text-navy-900 text-center mb-10">
            Pick your vibe 🌟
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((cat, idx) => (
              <Link to={`/events?category=${cat.name}`} key={idx}>
                <div className={`${cat.color} rounded-2xl p-6 text-center hover-lift cursor-pointer`}>
                  <span className="text-4xl mb-2 block">{cat.emoji}</span>
                  <p className="font-bold">{cat.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h2 className="text-4xl font-extrabold text-navy-900 text-center mb-4">
            What people say 💬
          </h2>
          <p className="text-xl text-navy-500 text-center mb-12">Real stories from real connections</p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "I walked in nervous, walked out with 5 new friends! The host made everyone feel so welcome.",
                name: "Priya S.",
                event: "Startup Founders Dinner",
                emoji: "😊"
              },
              {
                quote: "Best way to meet interesting people in Delhi. No small talk, just real conversations over amazing food.",
                name: "Rahul M.",
                event: "Art & Wine Evening",
                emoji: "🎨"
              },
              {
                quote: "As an introvert, I was skeptical. But the curated group made it so easy to connect. I'm hooked!",
                name: "Ananya K.",
                event: "Tech Leaders Brunch",
                emoji: "💡"
              }
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-navy-50 rounded-3xl p-8 hover-lift">
                <span className="text-4xl mb-4 block">{testimonial.emoji}</span>
                <p className="text-navy-700 text-lg mb-6 italic">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-coral-200 rounded-full flex items-center justify-center text-xl font-bold text-coral-700">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-navy-900">{testimonial.name}</p>
                    <p className="text-sm text-navy-500">{testimonial.event}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-navy-900 to-navy-800 relative overflow-hidden">
        <div className="absolute top-10 left-10 text-6xl opacity-10">🍽️</div>
        <div className="absolute bottom-10 right-10 text-6xl opacity-10">🎉</div>
        <div className="absolute top-1/2 left-1/4 text-4xl opacity-10 animate-float">✨</div>
        
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            Ready to meet your people? 🙌
          </h2>
          <p className="text-xl text-navy-200 mb-10">
            Join The Social Circle and turn strangers into friends, one dinner at a time.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/events">
              <Button size="lg" className="rounded-full bg-coral-500 hover:bg-coral-600 text-white px-10 py-6 text-lg font-bold shadow-glow">
                Explore Events
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="lg" variant="outline" className="rounded-full border-2 border-white text-white hover:bg-white hover:text-navy-900 px-10 py-6 text-lg font-bold">
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
