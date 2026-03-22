import React from 'react';

const Privacy = () => {
  return (
    <div className="section-padding">
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>Privacy Policy</h1>
        <p style={{ color: 'var(--color-gray)', marginBottom: '40px' }}>Last updated: {new Date().toLocaleDateString()}</p>
        
        <div style={{ '& > h2': { marginTop: '40px', marginBottom: '20px' }, '& > p': { marginBottom: '20px' } }}>
          <p>At BeconHive, operated through beconhive.com, your privacy is of uppermost importance to us. This Privacy Policy outlines what information we collect, how we use it, and how we safeguard your personal data.</p>
          
          <h2 style={{ marginTop: '40px', marginBottom: '20px' }}>Information We Collect</h2>
          <p>We may collect personal identification information from Users in a variety of ways, including, but not limited to, when Users visit our site, register on the site, place an order, subscribe to the newsletter, respond to a survey, fill out a form, and in connection with other activities, services, features or resources we make available on our Site. Users may be asked for, as appropriate, name, email address, mailing address, phone number, and credit card information.</p>
          
          <h2 style={{ marginTop: '40px', marginBottom: '20px' }}>How We Use Collected Information</h2>
          <p>BeconHive may collect and use Users personal information for the following purposes:</p>
          <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginBottom: '20px', color: 'var(--color-gray)' }}>
            <li style={{ marginBottom: '10px' }}><strong>To improve customer service:</strong> Information you provide helps us respond to your customer service requests and support needs more efficiently.</li>
            <li style={{ marginBottom: '10px' }}><strong>To personalize user experience:</strong> We may use information in the aggregate to understand how our Users as a group use the services and resources provided on our Site.</li>
            <li style={{ marginBottom: '10px' }}><strong>To process payments:</strong> We may use the information Users provide about themselves when placing an order only to provide service to that order. We do not share this information with outside parties except to the extent necessary to provide the service.</li>
            <li style={{ marginBottom: '10px' }}><strong>To send periodic emails:</strong> We may use the email address to send User information and updates pertaining to their order. It may also be used to respond to their inquiries, questions, and/or other requests.</li>
          </ul>

          <h2 style={{ marginTop: '40px', marginBottom: '20px' }}>How We Protect Your Information</h2>
          <p>We adopt appropriate data collection, storage and processing practices and security measures to protect against unauthorized access, alteration, disclosure or destruction of your personal information, username, password, transaction information and data stored on our Site.</p>
          
          <h2 style={{ marginTop: '40px', marginBottom: '20px' }}>Changes To This Privacy Policy</h2>
          <p>BeconHive has the discretion to update this privacy policy at any time. When we do, we will revise the updated date at the bottom of this page. We encourage Users to frequently check this page for any changes to stay informed about how we are helping to protect the personal information we collect.</p>
          
        </div>
      </div>
    </div>
  );
};

export default Privacy;
