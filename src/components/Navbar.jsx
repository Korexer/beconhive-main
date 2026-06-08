import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';
import { useAuth } from '../utils/AuthContext';

const Navbar = () => {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [bizToolsOpen, setBizToolsOpen] = useState(false);
  const [mobileBizToolsOpen, setMobileBizToolsOpen] = useState(false);
  const bizToolsRef = useRef(null);
  const isAIPlannerRoute = location.pathname === '/ai-planner';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (bizToolsRef.current && !bizToolsRef.current.contains(event.target)) {
        setBizToolsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const closeMobileMenu = () => {
    setIsOpen(false);
    setMobileBizToolsOpen(false);
  };

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      zIndex: 1000,
      background: isAIPlannerRoute ? 'rgba(4, 20, 45, 0.9)' : (scrolled ? 'rgba(4, 20, 45, 0.95)' : '#04142D'),
      backdropFilter: isAIPlannerRoute || scrolled ? 'blur(14px)' : 'none',
      boxShadow: isAIPlannerRoute || scrolled ? 'var(--shadow-lg)' : 'none',
      borderBottom: isAIPlannerRoute ? '1px solid rgba(255,255,255,0.08)' : 'none',
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
          <img src="/logo.png" alt="BeconHive" style={{ height: isAIPlannerRoute ? '58px' : '64px', maxWidth: '240px', objectFit: 'contain' }} />
        </Link>

        {/* Desktop Menu */}
        <nav style={{ display: 'flex', gap: '32px', alignItems: 'center' }} className="desktop-nav">
          <Link to="/" style={{ fontWeight: 600, color: 'white' }}>Home</Link>
          <Link to="/about" style={{ fontWeight: 600, color: 'white' }}>About Us</Link>
          <Link to="/services" style={{ fontWeight: 600, color: 'white' }}>Services</Link>
          <div ref={bizToolsRef} style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setBizToolsOpen((current) => !current)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'transparent',
                border: 'none',
                color: 'white',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Biz Tools
              <ChevronDown size={18} style={{ transform: bizToolsOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }} />
            </button>

            {bizToolsOpen ? (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 16px)',
                  left: 0,
                  minWidth: '220px',
                  padding: '10px',
                  borderRadius: '18px',
                  background: 'rgba(255,255,255,0.98)',
                  boxShadow: '0 18px 40px rgba(4, 20, 45, 0.16)',
                  border: '1px solid rgba(10, 88, 202, 0.1)'
                }}
              >
                <Link
                  to="/ai-planner"
                  onClick={() => setBizToolsOpen(false)}
                  style={{
                    display: 'block',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    color: 'var(--color-black)',
                    fontWeight: 600
                  }}
                >
                  AI Planner
                </Link>
              </div>
            ) : null}
          </div>
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
              {!isAIPlannerRoute ? (
                <>
                  <Link to="/login" style={{ fontWeight: 600, color: 'white', display: 'flex', alignItems: 'center' }}>Login</Link>
                  <Link to="/signup" className="btn btn-secondary" style={{ padding: '10px 24px' }}>Sign Up</Link>
                </>
              ) : (
                <a href="#ai-waitlist-footer" className="btn btn-secondary" style={{ padding: '10px 24px' }}>Get Early Access</a>
              )}
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
          display: 'flex',
          flexDirection: 'column',
          padding: '40px 20px',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'all' : 'none',
          transform: isOpen ? 'translateY(0)' : 'translateY(-12px)',
          transition: 'opacity 0.3s ease, transform 0.3s ease',
        }}
        className="mobile-drawer"
      >
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '30px', alignItems: 'center', width: '100%' }}>
          <Link to="/" onClick={closeMobileMenu} style={{ fontSize: '1.5rem', fontWeight: 600 }}>Home</Link>
          <Link to="/about" onClick={closeMobileMenu} style={{ fontSize: '1.5rem', fontWeight: 600 }}>About Us</Link>
          <Link to="/services" onClick={closeMobileMenu} style={{ fontSize: '1.5rem', fontWeight: 600 }}>Services</Link>
          <div style={{ width: '100%', maxWidth: '320px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
            <button
              type="button"
              onClick={() => setMobileBizToolsOpen((current) => !current)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                fontSize: '1.5rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
            >
              Biz Tools
              <ChevronDown size={18} style={{ transform: mobileBizToolsOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }} />
            </button>
            {mobileBizToolsOpen ? (
              <Link
                to="/ai-planner"
                onClick={closeMobileMenu}
                style={{
                  width: '100%',
                  textAlign: 'center',
                  padding: '14px 18px',
                  borderRadius: '16px',
                  background: 'rgba(255,255,255,0.08)',
                  fontSize: '1.1rem',
                  fontWeight: 600
                }}
              >
                AI Planner
              </Link>
            ) : null}
          </div>
          <Link to="/blog" onClick={closeMobileMenu} style={{ fontSize: '1.5rem', fontWeight: 600 }}>Blog</Link>
          <Link to="/contact" onClick={closeMobileMenu} style={{ fontSize: '1.5rem', fontWeight: 600 }}>Contact</Link>
          
          <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.1)', margin: '10px 0' }} />
          
          {user ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', alignItems: 'center' }}>
               <Link to="/dashboard" onClick={closeMobileMenu} className="btn btn-secondary" style={{ width: '100%', padding: '16px' }}>Go to Dashboard</Link>
               <button onClick={() => { handleLogout(); closeMobileMenu(); }} style={{ background: 'transparent', border: 'none', color: 'white', fontWeight: 600, fontSize: '1.1rem' }}>Logout Account</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', alignItems: 'center' }}>
               {!isAIPlannerRoute ? (
                 <>
                   <Link to="/login" onClick={closeMobileMenu} style={{ fontSize: '1.3rem', fontWeight: 600 }}>Login</Link>
                   <Link to="/signup" onClick={closeMobileMenu} className="btn btn-secondary" style={{ width: '100%', padding: '16px' }}>Sign Up Free</Link>
                 </>
               ) : (
                 <a href="#ai-waitlist-footer" onClick={closeMobileMenu} className="btn btn-secondary" style={{ width: '100%', padding: '16px' }}>Get Early Access</a>
               )}
            </div>
          )}
        </nav>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .desktop-nav, .nav-actions { display: none !important; }
          .mobile-toggle { display: block !important; }
        }

        @media (min-width: 768px) {
          .desktop-nav {
            gap: ${isAIPlannerRoute ? '26px' : '32px'} !important;
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
