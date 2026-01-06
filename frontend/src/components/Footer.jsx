import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-primary text-white py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo.png" alt="LeadBridge Logo" className="h-10 w-10" />
              <h3 className="text-2xl font-heading font-bold">LeadBridge</h3>
            </div>
            <p className="text-sm opacity-90">
              Connecting mentors with learners through verified lead acquisition.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="opacity-90 hover:opacity-100 hover:underline transition-opacity">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/signup" className="opacity-90 hover:opacity-100 hover:underline transition-opacity">
                  Become a Mentor
                </Link>
              </li>
              <li>
                <Link to="/login" className="opacity-90 hover:opacity-100 hover:underline transition-opacity">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/contact" className="opacity-90 hover:opacity-100 hover:underline transition-opacity">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h4 className="font-heading font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacy-policy" className="opacity-90 hover:opacity-100 hover:underline transition-opacity">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-conditions" className="opacity-90 hover:opacity-100 hover:underline transition-opacity">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="opacity-90 hover:opacity-100 hover:underline transition-opacity">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="font-heading font-bold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 opacity-90">
                <Mail className="w-4 h-4" />
                <span>support@leadbridge.com</span>
              </li>
              <li className="flex items-center gap-2 opacity-90">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2 opacity-90">
                <MapPin className="w-4 h-4" />
                <span>New York, NY 10001</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm opacity-90">
              © 2025 LeadBridge. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm opacity-90">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 transition-opacity">
                Twitter
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 transition-opacity">
                LinkedIn
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 transition-opacity">
                Facebook
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
