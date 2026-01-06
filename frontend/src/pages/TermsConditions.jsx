import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function TermsConditions() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-16">
        <h1 className="text-4xl font-heading font-bold text-primary mb-8">Terms & Conditions</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-muted-foreground mb-6">
            Last updated: January 6, 2026
          </p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-heading font-bold text-primary mb-4">1. Acceptance of Terms</h2>
            <p className="text-foreground mb-4">
              By accessing and using LeadBridge, you accept and agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-heading font-bold text-primary mb-4">2. User Accounts</h2>
            <ul className="list-disc pl-6 text-foreground space-y-2">
              <li>You must provide accurate and complete information when creating an account</li>
              <li>You are responsible for maintaining the security of your account</li>
              <li>You must notify us immediately of any unauthorized access</li>
              <li>We reserve the right to suspend or terminate accounts that violate our policies</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-heading font-bold text-primary mb-4">3. Mentor Services</h2>
            <p className="text-foreground mb-4">
              Mentors using our platform agree to:
            </p>
            <ul className="list-disc pl-6 text-foreground space-y-2">
              <li>Provide accurate information about their expertise and experience</li>
              <li>Create genuine events and offerings</li>
              <li>Respond to leads in a timely and professional manner</li>
              <li>Maintain high-quality service standards</li>
              <li>Not misuse lead information or engage in spam</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-heading font-bold text-primary mb-4">4. User Bookings</h2>
            <p className="text-foreground mb-4">
              Users booking events agree to:
            </p>
            <ul className="list-disc pl-6 text-foreground space-y-2">
              <li>Provide accurate contact information</li>
              <li>Respond to mentor communications</li>
              <li>Not create fake or spam bookings</li>
              <li>Respect mentor time and expertise</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-heading font-bold text-primary mb-4">5. Payment Terms</h2>
            <ul className="list-disc pl-6 text-foreground space-y-2">
              <li>Mentors pay for verified leads at the price they set</li>
              <li>All payments are processed securely through our payment gateway</li>
              <li>Refunds are subject to our refund policy</li>
              <li>We are not responsible for disputes between mentors and users</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-heading font-bold text-primary mb-4">6. Prohibited Conduct</h2>
            <p className="text-foreground mb-4">
              You may not:
            </p>
            <ul className="list-disc pl-6 text-foreground space-y-2">
              <li>Violate any laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Transmit malicious code or viruses</li>
              <li>Engage in fraudulent activities</li>
              <li>Harass or abuse other users</li>
              <li>Scrape or collect data without permission</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-heading font-bold text-primary mb-4">7. Limitation of Liability</h2>
            <p className="text-foreground mb-4">
              LeadBridge is not liable for any indirect, incidental, special, or consequential damages arising from your use of our services.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-heading font-bold text-primary mb-4">8. Changes to Terms</h2>
            <p className="text-foreground mb-4">
              We reserve the right to modify these terms at any time. Continued use of our services constitutes acceptance of the modified terms.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-heading font-bold text-primary mb-4">9. Contact</h2>
            <p className="text-foreground mb-4">
              For questions about these Terms, contact us at legal@leadbridge.com
            </p>
          </section>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default TermsConditions;
