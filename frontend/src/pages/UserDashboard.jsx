import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { Calendar, Clock, CheckCircle, XCircle, Loader } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function UserDashboard() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.user) {
      setUser(location.state.user);
      fetchBookings();
      return;
    }

    const checkAuth = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/auth/me`, { withCredentials: true });
        if (response.data.role !== 'USER') {
          navigate('/');
          return;
        }
        setUser(response.data);
        fetchBookings();
      } catch (error) {
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate, location.state]);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/user/bookings`, { withCredentials: true });
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'VERIFIED':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'PURCHASED':
        return <CheckCircle className="w-5 h-5 text-primary" />;
      case 'REJECTED':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Loader className="w-5 h-5 text-yellow-600 animate-spin" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'VERIFIED':
        return 'Verified';
      case 'PURCHASED':
        return 'Mentor Connected';
      case 'REJECTED':
        return 'Rejected';
      default:
        return 'Pending Review';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50/30">
      <Navbar user={user} />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12" data-testid="user-dashboard">
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold text-foreground mb-2">
            Welcome back, {user.name}!
          </h1>
          <p className="text-muted-foreground">Manage your event bookings</p>
        </div>

        <div className="bg-white border border-border shadow-sm rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-heading font-bold mb-6">My Bookings</h2>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12 bg-muted rounded-xl">
              <p className="text-muted-foreground">You haven't booked any events yet.</p>
              <button
                onClick={() => navigate('/')}
                className="mt-4 text-primary font-medium hover:underline"
              >
                Browse Events
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.lead_id}
                  className="border border-border rounded-lg p-6 hover:border-primary/30 transition-colors"
                  data-testid={`booking-${booking.lead_id}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-heading font-bold text-foreground mb-2">
                        {booking.event_title}
                      </h3>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            Booked on {new Date(booking.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-full">
                      {getStatusIcon(booking.status)}
                      <span className="text-sm font-medium">{getStatusText(booking.status)}</span>
                    </div>
                  </div>
                  
                  {booking.status === 'PURCHASED' && (
                    <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                      <p className="text-sm text-primary font-medium">
                        ✓ The mentor has purchased your lead and will contact you soon!
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
