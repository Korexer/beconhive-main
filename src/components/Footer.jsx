import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{ background: '#04142D', color: 'white', padding: '60px 0 20px', marginTop: 'auto' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginBottom: '40px' }}>
          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'white' }}>
              Becon<span style={{ color: 'var(--primary-orange)' }}>Hive</span>
            </h3>
            <p style={{ marginTop: '16px', fontSize: '0.95rem', color: 'rgba(255,255,255,0.85)' }}>
              Efficient, affordable, and expert services tailored to help your business thrive.
            </p>
          </div>
          <div>
            <h4 style={{ marginBottom: '20px', color: 'white' }}>Quick Links</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><Link to="/about" style={{ color: 'rgba(255,255,255,0.85)' }}>About Us</Link></li>
              <li><Link to="/services" style={{ color: 'rgba(255,255,255,0.85)' }}>Services</Link></li>
              <li><Link to="/blog" style={{ color: 'rgba(255,255,255,0.85)' }}>Blog</Link></li>
              <li><Link to="/contact" style={{ color: 'rgba(255,255,255,0.85)' }}>Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 style={{ marginBottom: '20px', color: 'white' }}>Legal</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><Link to="/terms" style={{ color: 'rgba(255,255,255,0.85)' }}>Terms of Service</Link></li>
              <li><Link to="/privacy" style={{ color: 'rgba(255,255,255,0.85)' }}>Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 style={{ marginBottom: '20px', color: 'white' }}>Contact Us</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', color: 'rgba(255,255,255,0.85)' }}>
              <li>Email: info@beconhive.com</li>
              <li>Support: support@beconhive.com</li>
            </ul>
          </div>
        </div>
        <div style={{ textAlign: 'center', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
          &copy; {new Date().getFullYear()} BeconHive. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
