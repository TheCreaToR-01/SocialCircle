import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import { Button } from '../components/ui/button';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link');
      return;
    }

    verifyEmail();
  }, [token]);

  const verifyEmail = async () => {
    try {
      await axios.get(`${BACKEND_URL}/api/auth/verify-email/${token}`);
      setStatus('success');
      setMessage('Your email has been verified successfully!');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      setStatus('error');
      setMessage(
        error.response?.data?.detail || 
        'Verification failed. The link may be invalid or expired.'
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 to-emerald-950 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center" data-testid="verify-email-container">
        {status === 'verifying' && (
          <>
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader className="w-10 h-10 text-primary animate-spin" />
            </div>
            <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
              Verifying Your Email
            </h1>
            <p className="text-muted-foreground">
              Please wait while we verify your email address...
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
              Email Verified!
            </h1>
            <p className="text-muted-foreground mb-6">{message}</p>
            <p className="text-sm text-muted-foreground">
              Redirecting to login...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
              Verification Failed
            </h1>
            <p className="text-muted-foreground mb-6">{message}</p>
            <Button
              onClick={() => navigate('/login')}
              className="rounded-full bg-primary hover:bg-primary/90"
              data-testid="go-to-login"
            >
              Go to Login
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default VerifyEmail;
