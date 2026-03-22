import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../utils/AuthContext';

const Navbar = () => {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      zIndex: 1000,
      background: scrolled ? 'rgba(4, 20, 45, 0.95)' : '#04142D',
      backdropFilter: scrolled ? 'blur(10px)' : 'none',
      boxShadow: scrolled ? 'var(--shadow-lg)' : 'none',
      color: 'white',
      transition: 'all var(--transition)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '80px'
      }}>
        {/* Authentic Customer Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <img src="/logo.png" alt="BeconHive" style={{ height: '64px', maxWidth: '240px', objectFit: 'contain' }} />
        </Link>

        {/* Desktop Menu */}
        <nav style={{ display: 'flex', gap: '32px', alignItems: 'center' }} className="desktop-nav">
          <Link to="/" style={{ fontWeight: 600, color: 'white' }}>Home</Link>
          <Link to="/about" style={{ fontWeight: 600, color: 'white' }}>About Us</Link>
          <Link to="/services" style={{ fontWeight: 600, color: 'white' }}>Services</Link>
          <Link to="/blog" style={{ fontWeight: 600, color: 'white' }}>Blog</Link>
          <Link to="/contact" style={{ fontWeight: 600, color: 'white' }}>Contact</Link>
        </nav>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }} className="nav-actions">
          {user ? (
            <>
              <span style={{ fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>Hello, {profile?.full_name?.split(' ')[0] || 'User'}</span>
              <Link to="/dashboard" className="btn btn-secondary" style={{ padding: '10px 24px' }}>Dashboard</Link>
              <button onClick={handleLogout} className="btn" style={{ padding: '8px 16px', fontSize: '0.9rem', background: 'transparent', border: '2px solid rgba(255,255,255,0.4)', color: 'white', borderRadius: '30px', fontWeight: 600 }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ fontWeight: 600, color: 'white', display: 'flex', alignItems: 'center' }}>Login</Link>
              <Link to="/signup" className="btn btn-secondary" style={{ padding: '10px 24px' }}>Sign Up</Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="mobile-toggle"
          onClick={() => setIsOpen(!isOpen)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'none', color: 'white', transition: 'transform 0.3s' }}
        >
          {isOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      <div 
        style={{
          position: 'fixed',
          top: '80px',
          left: 0,
          width: '100%',
          height: 'calc(100vh - 80px)',
          background: 'rgba(4, 20, 45, 0.98)',
          backdropFilter: 'blur(20px)',
          zIndex: 999,
          display: isOpen ? 'flex' : 'none',
          flexDirection: 'column',
          padding: '40px 20px',
          transition: 'all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)'
        }}
        className="mobile-drawer"
      >
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '30px', alignItems: 'center', width: '100%' }}>
          <Link to="/" onClick={() => setIsOpen(false)} style={{ fontSize: '1.5rem', fontWeight: 600 }}>Home</Link>
          <Link to="/about" onClick={() => setIsOpen(false)} style={{ fontSize: '1.5rem', fontWeight: 600 }}>About Us</Link>
          <Link to="/services" onClick={() => setIsOpen(false)} style={{ fontSize: '1.5rem', fontWeight: 600 }}>Services</Link>
          <Link to="/blog" onClick={() => setIsOpen(false)} style={{ fontSize: '1.5rem', fontWeight: 600 }}>Blog</Link>
          <Link to="/contact" onClick={() => setIsOpen(false)} style={{ fontSize: '1.5rem', fontWeight: 600 }}>Contact</Link>
          
          <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.1)', margin: '10px 0' }} />
          
          {user ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', alignItems: 'center' }}>
               <Link to="/dashboard" onClick={() => setIsOpen(false)} className="btn btn-secondary" style={{ width: '100%', padding: '16px' }}>Go to Dashboard</Link>
               <button onClick={() => { handleLogout(); setIsOpen(false); }} style={{ background: 'transparent', border: 'none', color: 'white', fontWeight: 600, fontSize: '1.1rem' }}>Logout Account</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', alignItems: 'center' }}>
               <Link to="/login" onClick={() => setIsOpen(false)} style={{ fontSize: '1.3rem', fontWeight: 600 }}>Login</Link>
               <Link to="/signup" onClick={() => setIsOpen(false)} className="btn btn-secondary" style={{ width: '100%', padding: '16px' }}>Sign Up Free</Link>
            </div>
          )}
        </nav>
      </div>

      <style>{`
        @media (max-width: 991px) {
          .desktop-nav, .nav-actions { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
