import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { toast } from 'sonner';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-heading font-bold text-primary mb-4">Contact Us</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions or concerns? We're here to help. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white border border-border shadow-sm rounded-xl p-8">
            <h2 className="text-2xl font-heading font-bold text-primary mb-6">Send us a message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  type="text"
                  placeholder="How can we help?"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Tell us more about your inquiry..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={6}
                  className="mt-2"
                />
              </div>
              
              <Button
                type="submit"
                className="w-full rounded-full bg-primary hover:bg-primary/90 py-6"
                disabled={submitting}
              >
                {submitting ? 'Sending...' : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </div>
          
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-primary to-navy-700 text-white rounded-xl p-8">
              <h2 className="text-2xl font-heading font-bold mb-6">Get in Touch</h2>
              <p className="mb-8 opacity-90">
                We're here to assist you with any questions about our platform, whether you're a mentor or a user.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="opacity-90">support@leadbridge.com</p>
                    <p className="opacity-90 text-sm mt-1">We'll respond within 24 hours</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Phone</h3>
                    <p className="opacity-90">+1 (555) 123-4567</p>
                    <p className="opacity-90 text-sm mt-1">Mon-Fri, 9 AM - 6 PM EST</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Office</h3>
                    <p className="opacity-90">123 Business Street</p>
                    <p className="opacity-90">New York, NY 10001</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* FAQ Section */}
            <div className="bg-muted rounded-xl p-8">
              <h3 className="text-xl font-heading font-bold text-primary mb-4">Frequently Asked Questions</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">How do I become a mentor?</h4>
                  <p className="text-sm text-muted-foreground">
                    Sign up with a mentor account, complete your profile, and wait for admin approval. Once approved, you can start creating events!
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">How are leads verified?</h4>
                  <p className="text-sm text-muted-foreground">
                    Leads undergo automatic email/phone validation and manual admin review to ensure quality and authenticity.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Can I get a refund?</h4>
                  <p className="text-sm text-muted-foreground">
                    Please refer to our Refund Policy for detailed information about refunds and exceptional circumstances.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default Contact;
