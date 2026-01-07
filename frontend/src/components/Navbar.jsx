import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { LogOut, User } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function Navbar({ user }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(`${BACKEND_URL}/api/auth/logout`, {}, { withCredentials: true });
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-white border-b border-border">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3" data-testid="navbar-logo">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <span className="text-white text-xl font-heading font-bold">S</span>
          </div>
          <div>
            <span className="text-2xl font-heading font-bold text-primary">The Social Circle</span>
            <p className="text-xs text-muted-foreground">Real Connections. Curated Dinners.</p>
          </div>
        </Link>
        
        <div className="flex items-center gap-6">
          {!user && (
            <Link to="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Explore Dinners
            </Link>
          )}
          
          {user ? (
            <>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <User className="w-4 h-4" />
                <span>{user.name}</span>
                <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                  {user.role === 'MENTOR' ? 'Host' : user.role === 'USER' ? 'Guest' : 'Admin'}
                </span>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="rounded-full"
                data-testid="logout-button"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Log Out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" className="rounded-full" data-testid="login-button">
                  Log In
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="rounded-full bg-primary hover:bg-primary/90" data-testid="signup-button">
                  Become a Host
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
