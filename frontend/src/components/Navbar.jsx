import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { LogOut, User, Menu, X } from 'lucide-react';
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
    <nav className="bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-navy-100">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3" data-testid="navbar-logo">
          <div className="w-12 h-12 bg-gradient-to-br from-navy-900 to-navy-700 rounded-2xl flex items-center justify-center shadow-playful">
            <span className="text-white text-2xl">🍽️</span>
          </div>
          <div className="hidden sm:block">
            <span className="text-xl font-extrabold text-navy-900">The Social Circle</span>
            <p className="text-xs text-navy-500">Where strangers become friends</p>
          </div>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link 
            to="/events" 
            className={`font-semibold transition-colors ${isActive('/events') ? 'text-coral-500' : 'text-navy-700 hover:text-coral-500'}`}
          >
            Explore Events
          </Link>
          
          {user ? (
            <>
              <Link 
                to={user.role === 'MENTOR' ? '/mentor/dashboard' : user.role === 'ADMIN' ? '/admin/dashboard' : '/user/dashboard'}
                className={`font-semibold transition-colors ${location.pathname.includes('dashboard') ? 'text-coral-500' : 'text-navy-700 hover:text-coral-500'}`}
              >
                Dashboard
              </Link>
              <div className="flex items-center gap-3 pl-4 border-l border-navy-200">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-coral-400 to-coral-600 rounded-full flex items-center justify-center text-white font-bold">
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-sm font-semibold text-navy-900">{user.name}</p>
                    <p className="text-xs text-navy-500">
                      {user.role === 'MENTOR' ? '🏠 Host' : user.role === 'USER' ? '👤 Guest' : '⚡ Admin'}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className="rounded-full text-navy-600 hover:text-coral-500 hover:bg-coral-50"
                  data-testid="logout-button"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" className="rounded-full font-semibold text-navy-700 hover:text-navy-900" data-testid="login-button">
                  Log In
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="rounded-full bg-coral-500 hover:bg-coral-600 font-bold px-6 shadow-playful" data-testid="signup-button">
                  Get Started ✨
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 text-navy-900"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-navy-100 px-6 py-4 space-y-4">
          <Link 
            to="/events" 
            className="block font-semibold text-navy-700 hover:text-coral-500 py-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            🎉 Explore Events
          </Link>
          {user ? (
            <>
              <Link 
                to={user.role === 'MENTOR' ? '/mentor/dashboard' : user.role === 'ADMIN' ? '/admin/dashboard' : '/user/dashboard'}
                className="block font-semibold text-navy-700 hover:text-coral-500 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                📊 Dashboard
              </Link>
              <div className="pt-4 border-t border-navy-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-coral-400 to-coral-600 rounded-full flex items-center justify-center text-white font-bold">
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-navy-900">{user.name}</p>
                    <p className="text-xs text-navy-500">
                      {user.role === 'MENTOR' ? 'Host' : user.role === 'USER' ? 'Guest' : 'Admin'}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Log Out
                </Button>
              </div>
            </>
          ) : (
            <div className="pt-4 border-t border-navy-100 space-y-3">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full rounded-full font-semibold">
                  Log In
                </Button>
              </Link>
              <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full rounded-full bg-coral-500 hover:bg-coral-600 font-bold">
                  Get Started ✨
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
