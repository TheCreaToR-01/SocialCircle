import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { LogOut, Menu, X, Utensils } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function Navbar({ user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.post(`${BACKEND_URL}/api/auth/logout`, {}, { withCredentials: true });
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-cream-50/95 backdrop-blur-md sticky top-0 z-50 border-b border-cream-200">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3" data-testid="navbar-logo">
          <div className="w-11 h-11 bg-navy-900 rounded-xl flex items-center justify-center shadow-soft">
            <Utensils className="w-5 h-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <span className="text-lg font-heading text-navy-900">The Social Circle</span>
            <p className="text-xs text-navy-500">Curated Dinners</p>
          </div>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link 
            to="/events" 
            className={`font-medium transition-colors ${isActive('/events') ? 'text-navy-900' : 'text-navy-600 hover:text-navy-900'}`}
          >
            Explore Events
          </Link>
          
          {user ? (
            <>
              <Link 
                to={user.role === 'MENTOR' ? '/mentor/dashboard' : user.role === 'ADMIN' ? '/admin/dashboard' : '/user/dashboard'}
                className={`font-medium transition-colors ${location.pathname.includes('dashboard') ? 'text-navy-900' : 'text-navy-600 hover:text-navy-900'}`}
              >
                Dashboard
              </Link>
              <div className="flex items-center gap-3 pl-6 border-l border-cream-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-pastel-blue rounded-xl flex items-center justify-center text-navy-700 font-medium">
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-sm font-medium text-navy-900">{user.name}</p>
                    <p className="text-xs text-navy-500">
                      {user.role === 'MENTOR' ? 'Host' : user.role === 'USER' ? 'Guest' : 'Admin'}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className="rounded-xl text-navy-500 hover:text-navy-700 hover:bg-cream-100"
                  data-testid="logout-button"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" className="rounded-xl font-medium text-navy-600 hover:text-navy-900 hover:bg-cream-100" data-testid="login-button">
                  Log In
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="rounded-xl bg-navy-900 hover:bg-navy-800 font-medium px-6 shadow-soft" data-testid="signup-button">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 text-navy-700"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-cream-50 border-t border-cream-200 px-6 py-4 space-y-4">
          <Link 
            to="/events" 
            className="block font-medium text-navy-700 hover:text-navy-900 py-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            Explore Events
          </Link>
          {user ? (
            <>
              <Link 
                to={user.role === 'MENTOR' ? '/mentor/dashboard' : user.role === 'ADMIN' ? '/admin/dashboard' : '/user/dashboard'}
                className="block font-medium text-navy-700 hover:text-navy-900 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <div className="pt-4 border-t border-cream-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-pastel-blue rounded-xl flex items-center justify-center text-navy-700 font-medium">
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-navy-900">{user.name}</p>
                    <p className="text-xs text-navy-500">
                      {user.role === 'MENTOR' ? 'Host' : user.role === 'USER' ? 'Guest' : 'Admin'}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="rounded-xl"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Log Out
                </Button>
              </div>
            </>
          ) : (
            <div className="pt-4 border-t border-cream-200 space-y-3">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full rounded-xl font-medium">
                  Log In
                </Button>
              </Link>
              <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full rounded-xl bg-navy-900 hover:bg-navy-800 font-medium">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
