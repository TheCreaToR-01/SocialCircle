import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Calendar, Clock, Users, Search, Filter, ArrowRight, X, Utensils, Palette, Briefcase, TrendingUp, Leaf, Sparkles, Coffee } from 'lucide-react';
import { Link } from 'react-router-dom';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// Category data
const CATEGORIES = [
  { name: 'All', icon: Sparkles, color: 'bg-navy-100 text-navy-700' },
  { name: 'Culinary', icon: Utensils, color: 'bg-pastel-peach text-navy-700' },
  { name: 'Entrepreneurship', icon: Briefcase, color: 'bg-cream-200 text-navy-700' },
  { name: 'Art & Culture', icon: Palette, color: 'bg-pastel-blue text-navy-700' },
  { name: 'Professional Networking', icon: Users, color: 'bg-cream-300 text-navy-700' },
  { name: 'Finance', icon: TrendingUp, color: 'bg-pastel-sage text-navy-700' },
  { name: 'Tech', icon: Coffee, color: 'bg-pastel-blueLight text-navy-700' },
  { name: 'Wellness', icon: Leaf, color: 'bg-pastel-peach text-navy-700' },
];

const EVENT_IMAGES = [
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=600&h=400&fit=crop',
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
    
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(event => 
        event.category?.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        selectedCategory.toLowerCase().includes(event.category?.toLowerCase())
      );
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(event =>
        event.title?.toLowerCase().includes(query) ||
        event.description?.toLowerCase().includes(query) ||
        event.mentor_name?.toLowerCase().includes(query)
      );
    }
    
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

  const getCategoryIcon = (category) => {
    const cat = CATEGORIES.find(c => 
      c.name.toLowerCase().includes(category?.toLowerCase()) || 
      category?.toLowerCase().includes(c.name.toLowerCase())
    );
    return cat?.icon || Utensils;
  };

  const clearFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setPriceRange('all');
  };

  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />
      
      {/* Hero Banner */}
      <section className="bg-navy-900 py-16 relative overflow-hidden">
        {/* Decorative shapes */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-pastel-blue/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-cream-300/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-heading text-white mb-4">
            Find Your Perfect Dinner
          </h1>
          <p className="text-lg text-navy-200 max-w-2xl mx-auto mb-8">
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
              className="w-full pl-12 pr-4 py-6 rounded-xl text-base border-0 shadow-soft-lg bg-white"
            />
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-6 bg-white sticky top-0 z-20 border-b border-cream-200 shadow-soft">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 mb-4">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                    selectedCategory === cat.name
                      ? 'bg-navy-900 text-white shadow-soft'
                      : `${cat.color} hover:shadow-soft`
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {cat.name}
                </button>
              );
            })}
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
              className="px-4 py-2 rounded-xl border border-cream-300 text-sm focus:outline-none focus:ring-2 focus:ring-navy-200 bg-cream-50"
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
                className="flex items-center gap-1 px-3 py-2 text-sm text-navy-600 hover:bg-cream-100 rounded-xl transition-colors"
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
              <div className="w-12 h-12 border-3 border-navy-200 border-t-navy-600 rounded-full animate-spin"></div>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-20">
              <Search className="w-16 h-16 text-navy-300 mx-auto mb-6" />
              <h3 className="text-2xl font-heading text-navy-900 mb-2">No events found</h3>
              <p className="text-navy-500 mb-6">Try adjusting your filters or search query</p>
              <Button onClick={clearFilters} className="rounded-xl bg-navy-900 hover:bg-navy-800">
                Clear all filters
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event, index) => {
                const CategoryIcon = getCategoryIcon(event.category);
                const eventDate = new Date(event.event_datetime);
                
                return (
                  <Link to={`/events/${event.event_id}`} key={event.event_id}>
                    <div className="bg-white rounded-2xl overflow-hidden shadow-soft card-elegant group cursor-pointer border border-cream-200">
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
                          <span className="px-4 py-2 rounded-lg bg-white font-medium text-navy-900 shadow-soft">
                            ₹{event.price_per_lead}
                          </span>
                        </div>
                        
                        {/* Slots */}
                        <div className="absolute bottom-4 right-4">
                          <span className="px-3 py-1.5 rounded-lg bg-navy-900 text-white text-sm font-medium">
                            {event.available_slots} spots left
                          </span>
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="p-6">
                        <h3 className="text-xl font-heading text-navy-900 mb-2 group-hover:text-navy-600 transition-colors line-clamp-1">
                          {event.title}
                        </h3>
                        <p className="text-navy-500 text-sm mb-4 line-clamp-2">{event.description}</p>
                        
                        <div className="space-y-2 text-sm text-navy-600 mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-accent" />
                            <span>{eventDate.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-accent" />
                            <span>{eventDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} • {event.duration} mins</span>
                          </div>
                        </div>
                        
                        <div className="pt-4 border-t border-cream-200 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-pastel-blue rounded-xl flex items-center justify-center text-navy-700 font-medium">
                              {event.mentor_name?.[0] || 'H'}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-navy-900">{event.mentor_name}</p>
                              <p className="text-xs text-navy-500">Host</p>
                            </div>
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

      {/* CTA Section */}
      <section className="py-16 bg-cream-100">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <h2 className="text-3xl md:text-4xl font-heading text-navy-900 mb-4">
            Want to host your own dinner?
          </h2>
          <p className="text-lg text-navy-600 mb-8">
            Share your expertise, meet interesting people, and build your community.
          </p>
          <Link to="/signup">
            <Button size="lg" className="rounded-xl bg-navy-900 hover:bg-navy-800 text-white px-10 py-6 text-base font-medium shadow-soft-lg">
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
