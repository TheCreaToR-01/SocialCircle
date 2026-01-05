import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function AuthCallback() {
  const navigate = useNavigate();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const processSession = async () => {
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.substring(1));
      const sessionId = params.get('session_id');

      if (!sessionId) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.post(
          `${BACKEND_URL}/api/auth/session`,
          { session_id: sessionId },
          { withCredentials: true }
        );

        const user = response.data;
        
        if (user.role === 'USER') {
          navigate('/user/dashboard', { state: { user } });
        } else if (user.role === 'MENTOR') {
          navigate('/mentor/dashboard', { state: { user } });
        } else if (user.role === 'ADMIN') {
          navigate('/admin/dashboard', { state: { user } });
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Session exchange failed:', error);
        navigate('/login');
      }
    };

    processSession();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 to-emerald-950 flex items-center justify-center">
      <div className="text-white text-xl font-medium">Authenticating...</div>
    </div>
  );
}

export default AuthCallback;
