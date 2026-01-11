import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Heart, Instagram, Twitter, Linkedin } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-navy-900 text-white py-16 mt-auto relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 right-10 text-6xl opacity-5">🍽️</div>
      <div className="absolute bottom-10 left-10 text-5xl opacity-5">✨</div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-coral-400 to-coral-600 rounded-2xl flex items-center justify-center shadow-glow">
                <span className="text-2xl">🍽️</span>
              </div>
              <div>
                <h3 className="text-2xl font-extrabold">The Social Circle</h3>
                <p className="text-sm text-navy-300">Where strangers become friends</p>
              </div>
            </div>
            <p className="text-navy-300 mt-4 max-w-md leading-relaxed">
              We&apos;re on a mission to bring back real human connections in a world of screens. 
              One curated dinner at a time. 🙌
            </p>
            
            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" 
                className="w-10 h-10 bg-white/10 hover:bg-coral-500 rounded-full flex items-center justify-center transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-coral-500 rounded-full flex items-center justify-center transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-coral-500 rounded-full flex items-center justify-center transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">Explore</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/events" className="text-navy-300 hover:text-coral-400 transition-colors flex items-center gap-2">
                  <span>🎉</span> Browse Events
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-navy-300 hover:text-coral-400 transition-colors flex items-center gap-2">
                  <span>🏠</span> Become a Host
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-navy-300 hover:text-coral-400 transition-colors flex items-center gap-2">
                  <span>👤</span> Log In
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-navy-300 hover:text-coral-400 transition-colors flex items-center gap-2">
                  <span>💬</span> Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Legal & Contact */}
          <div>
            <h4 className="font-bold text-lg mb-4">Legal</h4>
            <ul className="space-y-3 mb-6">
              <li>
                <Link to="/privacy-policy" className="text-navy-300 hover:text-coral-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-conditions" className="text-navy-300 hover:text-coral-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="text-navy-300 hover:text-coral-400 transition-colors">
                  Refund Policy
                </Link>
              </li>
            </ul>
            
            <h4 className="font-bold text-lg mb-3 mt-6">Contact</h4>
            <div className="space-y-2 text-sm text-navy-300">
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-coral-400" />
                hello@thesocialcircle.in
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-coral-400" />
                Delhi NCR, India
              </p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-navy-400 flex items-center gap-2">
              Made with <Heart className="w-4 h-4 text-coral-500 fill-coral-500" /> in India
            </p>
            <p className="text-sm text-navy-400">
              © 2025 The Social Circle. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
