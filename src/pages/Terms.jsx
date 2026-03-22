import React from 'react';

const Terms = () => {
  return (
    <div className="section-padding">
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>Terms of Service</h1>
        <p style={{ color: 'var(--color-gray)', marginBottom: '40px' }}>Last updated: {new Date().toLocaleDateString()}</p>
        
        <div style={{ '& > h2': { marginTop: '40px', marginBottom: '20px' }, '& > p': { marginBottom: '20px' } }}>
          <p>Welcome to BeconHive. By accessing beconhive.com (the "Site"), you agree to be bound by these Terms of Service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.</p>
          
          <h2 style={{ marginTop: '40px', marginBottom: '20px' }}>1. Services Provided</h2>
          <p>BeconHive provides various business solutions including but not limited to business plan writing, pitch decks, and digital branding. All services are subject to availability and the specific agreements reached upon service selection. We make every effort to display as accurately as possible the packages and services available on the Site.</p>
          
          <h2 style={{ marginTop: '40px', marginBottom: '20px' }}>2. User Registration & Accounts</h2>
          <p>Certain sections of, or offerings from, the site may require you to register. If registration is requested, you agree to provide us with accurate, complete registration information. Your registration must be done using your real name and accurate information.</p>
          
          <h2 style={{ marginTop: '40px', marginBottom: '20px' }}>3. Independent Agents</h2>
          <p>BeconHive acts as a platform facilitating communication between customers and registered professional agents. All agents on our platform undergo an internal verification process, but users should exercise normal discretion when exchanging sensitive details. The quality of individual service deliveries is actively monitored.</p>
          
          <h2 style={{ marginTop: '40px', marginBottom: '20px' }}>4. Payment Processing</h2>
          <p>All payments are securely processed through designated third-party processors. By selecting a service package, you authorize BeconHive to charge your provided payment method according to the specific tier requested. All transactions are non-refundable unless explicitly stated otherwise.</p>
          
          <h2 style={{ marginTop: '40px', marginBottom: '20px' }}>5. Limitation of Liability</h2>
          <p>In no event shall BeconHive or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on BeconHive's website.</p>
        </div>
      </div>
    </div>
  );
};

export default Terms;
