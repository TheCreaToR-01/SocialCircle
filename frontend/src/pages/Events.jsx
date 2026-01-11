import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Calendar, Clock, Users, MapPin, Search, Filter, ArrowRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// Category data
const CATEGORIES = [
  { name: 'All', emoji: '✨', color: 'bg-navy-100 text-navy-700' },
  { name: 'Culinary', emoji: '🍽️', color: 'bg-orange-100 text-orange-700', bgColor: 'from-orange-500 to-red-500' },
  { name: 'Entrepreneurship', emoji: '🚀', color: 'bg-purple-100 text-purple-700', bgColor: 'from-purple-500 to-pink-500' },
  { name: 'Art & Culture', emoji: '🎨', color: 'bg-pink-100 text-pink-700', bgColor: 'from-pink-500 to-rose-500' },
  { name: 'Professional Networking', emoji: '🤝', color: 'bg-blue-100 text-blue-700', bgColor: 'from-blue-500 to-indigo-500' },
  { name: 'Finance', emoji: '📈', color: 'bg-green-100 text-green-700', bgColor: 'from-green-500 to-teal-500' },
  { name: 'Tech', emoji: '💻', color: 'bg-cyan-100 text-cyan-700', bgColor: 'from-cyan-500 to-blue-500' },
  { name: 'Wellness', emoji: '🧘', color: 'bg-teal-100 text-teal-700', bgColor: 'from-teal-500 to-green-500' },
];

const EVENT_IMAGES = [
  'https://images.unsplash.com/photo-1670899460364-ebc917bac09a?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1758272133417-011aebb36018?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1715860738421-b30b98f8614f?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1714038918910-daa51af9fccd?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1646781652500-40015cee4917?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1588833662667-a6fb06a6f238?w=600&h=400&fit=crop',
];

function Events() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState('all');

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, selectedCategory, searchQuery, priceRange]);

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

  const filterEvents = () => {
    let filtered = [...events];
    
    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(event => 
        event.category?.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        selectedCategory.toLowerCase().includes(event.category?.toLowerCase())
      );
    }
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(event =>
        event.title?.toLowerCase().includes(query) ||
        event.description?.toLowerCase().includes(query) ||
        event.mentor_name?.toLowerCase().includes(query)
      );
    }
    
    // Price filter
    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(Number);
      filtered = filtered.filter(event => {
        const price = event.price_per_lead || 0;
        if (max) {
          return price >= min && price <= max;
        }
        return price >= min;
      });
    }
    
    setFilteredEvents(filtered);
  };

  const getCategoryStyle = (category) => {
    const cat = CATEGORIES.find(c => 
      c.name.toLowerCase().includes(category?.toLowerCase()) || 
      category?.toLowerCase().includes(c.name.toLowerCase())
    );
    return cat || CATEGORIES[1];
  };

  const clearFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setPriceRange('all');
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 py-16 relative overflow-hidden">
        <div className="absolute top-10 left-10 text-6xl opacity-10 animate-float">🍽️</div>
        <div className="absolute bottom-10 right-20 text-5xl opacity-10 animate-wiggle">🎉</div>
        <div className="absolute top-20 right-1/4 text-4xl opacity-10">✨</div>
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4">
            Find Your Perfect Dinner 🍽️
          </h1>
          <p className="text-xl text-navy-200 max-w-2xl mx-auto mb-8">
            Browse curated experiences, filter by your interests, and discover your next unforgettable evening.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search events, hosts, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-6 rounded-full text-lg border-0 shadow-playful-lg"
            />
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-navy-50 sticky top-0 z-20 border-b border-navy-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Category Pills */}
          <div className="flex flex-wrap gap-3 mb-4">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-4 py-2 rounded-full font-semibold transition-all ${
                  selectedCategory === cat.name
                    ? 'bg-navy-900 text-white shadow-playful'
                    : `${cat.color} hover:shadow-md`
                }`}
              >
                {cat.emoji} {cat.name}
              </button>
            ))}
          </div>
          
          {/* Additional Filters */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-navy-500" />
              <span className="text-sm text-navy-500">Price:</span>
            </div>
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="px-4 py-2 rounded-full border border-navy-200 text-sm focus:outline-none focus:ring-2 focus:ring-coral-500"
            >
              <option value="all">All Prices</option>
              <option value="0-1000">Under ₹1,000</option>
              <option value="1000-2500">₹1,000 - ₹2,500</option>
              <option value="2500-5000">₹2,500 - ₹5,000</option>
              <option value="5000-">₹5,000+</option>
            </select>
            
            {(selectedCategory !== 'All' || searchQuery || priceRange !== 'all') && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 px-3 py-2 text-sm text-coral-600 hover:bg-coral-50 rounded-full"
              >
                <X className="w-4 h-4" /> Clear filters
              </button>
            )}
            
            <div className="ml-auto text-sm text-navy-500">
              {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-16 h-16 border-4 border-coral-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-20">
              <span className="text-6xl mb-6 block">🔍</span>
              <h3 className="text-2xl font-bold text-navy-900 mb-2">No events found</h3>
              <p className="text-navy-500 mb-6">Try adjusting your filters or search query</p>
              <Button onClick={clearFilters} className="rounded-full bg-coral-500 hover:bg-coral-600">
                Clear all filters
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event, index) => {
                const catStyle = getCategoryStyle(event.category);
                const eventDate = new Date(event.event_datetime);
                
                return (
                  <Link to={`/events/${event.event_id}`} key={event.event_id}>
                    <div className="bg-white rounded-3xl overflow-hidden shadow-playful card-playful group cursor-pointer border border-navy-100">
                      {/* Image */}
                      <div className="relative h-52 overflow-hidden">
                        <img 
                          src={EVENT_IMAGES[index % EVENT_IMAGES.length]} 
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        
                        {/* Category Badge */}
                        <div className="absolute top-4 left-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-bold bg-white/90 backdrop-blur-sm ${catStyle.color}`}>
                            {catStyle.emoji} {event.category}
                          </span>
                        </div>
                        
                        {/* Price Badge */}
                        <div className="absolute bottom-4 left-4">
                          <span className="px-4 py-2 rounded-full bg-white font-bold text-navy-900 shadow-lg">
                            ₹{event.price_per_lead}
                          </span>
                        </div>
                        
                        {/* Slots */}
                        <div className="absolute bottom-4 right-4">
                          <span className="px-3 py-1 rounded-full bg-coral-500 text-white text-sm font-bold">
                            {event.available_slots} spots left
                          </span>
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-navy-900 mb-2 group-hover:text-coral-500 transition-colors line-clamp-1">
                          {event.title}
                        </h3>
                        <p className="text-navy-500 text-sm mb-4 line-clamp-2">{event.description}</p>
                        
                        <div className="space-y-2 text-sm text-navy-600 mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-coral-400" />
                            <span>{eventDate.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-coral-400" />
                            <span>{eventDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} • {event.duration} mins</span>
                          </div>
                        </div>
                        
                        <div className="pt-4 border-t border-navy-100 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-coral-400 to-coral-600 rounded-full flex items-center justify-center text-white font-bold">
                              {event.mentor_name?.[0] || 'H'}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-navy-900">{event.mentor_name}</p>
                              <p className="text-xs text-navy-500">Host</p>
                            </div>
                          </div>
                          <ArrowRight className="w-5 h-5 text-coral-400 group-hover:translate-x-2 transition-transform" />
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

      {/* CTA Section */}
      <section className="py-16 bg-navy-50">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-navy-900 mb-4">
            Want to host your own dinner? 🏠
          </h2>
          <p className="text-lg text-navy-600 mb-8">
            Share your expertise, meet interesting people, and build your community.
          </p>
          <Link to="/signup">
            <Button size="lg" className="rounded-full bg-coral-500 hover:bg-coral-600 text-white px-10 py-6 text-lg font-bold">
              Become a Host
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Events;
