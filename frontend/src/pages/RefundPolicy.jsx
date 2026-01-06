import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function RefundPolicy() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-16">
        <h1 className="text-4xl font-heading font-bold text-primary mb-8">Refund & Returns Policy</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-muted-foreground mb-6">
            Last updated: January 6, 2026
          </p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-heading font-bold text-primary mb-4">1. General Policy</h2>
            <p className="text-foreground mb-4">
              At LeadBridge, we strive to ensure satisfaction for both mentors and users. This policy outlines our approach to refunds and returns.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-heading font-bold text-primary mb-4">2. Lead Purchases</h2>
            <p className="text-foreground mb-4">
              <strong>No Refund Policy:</strong> Once a mentor purchases a verified lead, the transaction is final. This is because:
            </p>
            <ul className="list-disc pl-6 text-foreground space-y-2">
              <li>Lead contact information is immediately disclosed</li>
              <li>The information cannot be "returned"</li>
              <li>All leads are verified before being made available</li>
              <li>Pricing is set by the mentor themselves</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-heading font-bold text-primary mb-4">3. Exceptions</h2>
            <p className="text-foreground mb-4">
              Refunds may be considered in the following exceptional circumstances:
            </p>
            <ul className="list-disc pl-6 text-foreground space-y-2">
              <li><strong>Technical Error:</strong> If the same lead was charged twice due to a system error</li>
              <li><strong>Invalid Lead:</strong> If the lead information is completely fake or invalid (must be reported within 24 hours)</li>
              <li><strong>Unauthorized Transaction:</strong> If your account was compromised and unauthorized purchases were made</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-heading font-bold text-primary mb-4">4. Dispute Resolution</h2>
            <p className="text-foreground mb-4">
              If you believe you qualify for a refund:
            </p>
            <ol className="list-decimal pl-6 text-foreground space-y-2">
              <li>Contact our support team at support@leadbridge.com within 24 hours</li>
              <li>Provide your transaction details and reason for refund request</li>
              <li>Include any supporting evidence (screenshots, emails, etc.)</li>
              <li>Our team will review your case within 2-3 business days</li>
            </ol>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-heading font-bold text-primary mb-4">5. Refund Processing</h2>
            <p className="text-foreground mb-4">
              If a refund is approved:
            </p>
            <ul className="list-disc pl-6 text-foreground space-y-2">
              <li>Refund will be processed to the original payment method</li>
              <li>Processing time: 5-7 business days</li>
              <li>You will receive an email confirmation once processed</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-heading font-bold text-primary mb-4">6. Prevention Tips</h2>
            <p className="text-foreground mb-4">
              To ensure you're satisfied with your purchase:
            </p>
            <ul className="list-disc pl-6 text-foreground space-y-2">
              <li>Review lead status carefully before purchasing</li>
              <li>Check that the lead matches your event and target audience</li>
              <li>Set appropriate pricing for your leads</li>
              <li>Respond to leads promptly to maximize conversion</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-heading font-bold text-primary mb-4">7. User Bookings</h2>
            <p className="text-foreground mb-4">
              For users who book events:
            </p>
            <ul className="list-disc pl-6 text-foreground space-y-2">
              <li>Bookings are free for users</li>
              <li>You can cancel your interest at any time before mentor purchase</li>
              <li>Once purchased by mentor, cancellation is not possible</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-heading font-bold text-primary mb-4">8. Contact Us</h2>
            <p className="text-foreground mb-4">
              For refund inquiries or disputes:
            </p>
            <p className="text-foreground">
              Email: refunds@leadbridge.com<br />
              Phone: +1 (555) 123-4567<br />
              Hours: Monday-Friday, 9 AM - 6 PM EST
            </p>
          </section>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default RefundPolicy;
