import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-16">
        <h1 className="text-4xl font-heading font-bold text-primary mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-muted-foreground mb-6">
            Last updated: January 6, 2026
          </p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-heading font-bold text-primary mb-4">1. Information We Collect</h2>
            <p className="text-foreground mb-4">
              We collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc pl-6 text-foreground space-y-2">
              <li>Name, email address, and contact information</li>
              <li>Account credentials and profile information</li>
              <li>Mentor expertise, bio, and experience details</li>
              <li>Event bookings and lead information</li>
              <li>Payment and transaction data</li>
              <li>Communications with us and other users</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-heading font-bold text-primary mb-4">2. How We Use Your Information</h2>
            <p className="text-foreground mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 text-foreground space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send you technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Monitor and analyze trends and usage</li>
              <li>Detect and prevent fraud and abuse</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-heading font-bold text-primary mb-4">3. Information Sharing</h2>
            <p className="text-foreground mb-4">
              We share your information only in the following circumstances:
            </p>
            <ul className="list-disc pl-6 text-foreground space-y-2">
              <li>With mentors after they purchase your lead (for users)</li>
              <li>With service providers who assist our operations</li>
              <li>When required by law or to protect rights and safety</li>
              <li>With your consent or at your direction</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-heading font-bold text-primary mb-4">4. Data Security</h2>
            <p className="text-foreground mb-4">
              We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-heading font-bold text-primary mb-4">5. Your Rights</h2>
            <p className="text-foreground mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-foreground space-y-2">
              <li>Access and update your personal information</li>
              <li>Delete your account and associated data</li>
              <li>Opt-out of marketing communications</li>
              <li>Request a copy of your data</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-heading font-bold text-primary mb-4">6. Contact Us</h2>
            <p className="text-foreground mb-4">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="text-foreground">
              Email: privacy@leadbridge.com<br />
              Address: 123 Business Street, City, Country
            </p>
          </section>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default PrivacyPolicy;
