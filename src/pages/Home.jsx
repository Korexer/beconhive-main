import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedCounter from '../components/AnimatedCounter';
import { CheckCircle, BarChart3, TrendingUp } from 'lucide-react';
import { SiTesla, SiSamsung, SiCisco, SiIntel, SiApple } from 'react-icons/si';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section style={{ 
        padding: '160px 0 120px', 
        position: 'relative',
        overflow: 'hidden',
        backgroundImage: 'url("/hero_image.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-referrer',
        color: 'white',
        textAlign: 'left'
      }}>
        {/* Dark Colored Overlay to enforce text visibility standards */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to right, rgba(10, 88, 202, 0.95) 0%, rgba(10, 88, 202, 0.1) 100%)' }}></div>
        
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '800px', margin: '0' }}>
            <span style={{ 
              display: 'inline-block',
              padding: '8px 20px',
              background: 'rgba(0, 0, 0, 0.6)',
              color: 'white',
              borderRadius: '30px',
              fontWeight: 700,
              fontSize: '0.95rem',
              marginBottom: '24px',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }} className="animate-fade-up">Premium Business Solutions</span>
            
            <h1 style={{ 
              fontSize: 'clamp(3rem, 6vw, 5.5rem)', 
              marginBottom: '24px',
              lineHeight: 1.1,
              letterSpacing: '-1px',
              color: 'var(--primary-orange)'
            }} className="animate-fade-up">Get it done!</h1>
            
            <p style={{ 
              fontSize: 'clamp(1.4rem, 2.5vw, 1.8rem)', 
              fontWeight: '500',
              marginBottom: '40px', 
              color: 'rgba(255, 255, 255, 0.95)',
              maxWidth: '700px',
              margin: '0 0 40px'
            }} className="animate-fade-up">
              Efficient, affordable, and expert services tailored to help your business thrive and dominate the market.
            </p>
            
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-start', flexWrap: 'wrap' }} className="animate-fade-up">
              <Link to="/services" className="btn btn-secondary" style={{ padding: '16px 36px', fontSize: '1.1rem' }}>Explore Services</Link>
              <Link to="/contact" className="btn" style={{ padding: '16px 36px', fontSize: '1.1rem', background: 'white', color: 'var(--primary-blue)', border: 'none', borderRadius: '30px', fontWeight: 600 }}>Talk to an Expert</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="section-padding">
        <div className="container" style={{ padding: '0 16px' }}>
          <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '24px' }}>Expert Solutions for Established Businesses and Entrepreneurs</h2>
            <p>At BeconHive, we specialize in delivering top-tier business solutions to visionary entrepreneurs and companies worldwide. Whether you need a winning business plan, a compelling pitch deck, or branding that stands out, our team of professionals is here to make it happen.</p>
          </div>

          <div className="mobile-horizontal-scroll" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            <div className="glass-card card-hover" style={{ padding: '32px' }}>
              <div style={{ width: '60px', height: '60px', background: 'rgba(10, 50, 115, 0.1)', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-blue)', marginBottom: '24px' }}>
                <CheckCircle size={32} />
              </div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>Industry Expertise</h3>
              <p>Over a decade of experience crafting solutions for 350+ industries worldwide.</p>
            </div>
            <div className="glass-card card-hover" style={{ padding: '32px' }}>
              <div style={{ width: '60px', height: '60px', background: 'rgba(255, 106, 0, 0.1)', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-orange)', marginBottom: '24px' }}>
                <TrendingUp size={32} />
              </div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>Proven Funding Success</h3>
              <p>We’ve helped clients secure millions in equity and debt financing for growth.</p>
            </div>
            <div className="glass-card card-hover" style={{ padding: '32px' }}>
              <div style={{ width: '60px', height: '60px', background: 'rgba(10, 50, 115, 0.1)', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-blue)', marginBottom: '24px' }}>
                <BarChart3 size={32} />
              </div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>Comprehensive Solutions</h3>
              <p>From business plans to branding, we offer a full range of tailored services.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Counter Section */}
      <section style={{ padding: '100px 0', background: 'var(--color-black)', color: 'var(--color-white)' }}>
        <div className="container">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '60px', alignItems: 'center' }}>
            <div className="mobile-centered-stack" style={{ flex: '1 1 500px' }}>
              <h2 style={{ fontSize: '2.5rem', color: 'var(--color-white)', marginBottom: '20px' }}>Satisfied Customers</h2>
              <p style={{ color: '#94a3b8', fontSize: '1.2rem', marginBottom: '40px' }}>
                Join the ranks of our delighted clients who have successfully achieved their business goals. We build trust by delivering breathtaking results.
              </p>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '40px 60px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.1)', display: 'inline-block' }}>
                <AnimatedCounter end={2500} step={10} />
                <div style={{ fontSize: '1.2rem', color: '#94a3b8', marginTop: '10px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 600 }}>Still Counting...</div>
              </div>
            </div>
            
            <div style={{ flex: '1 1 400px' }}>
              <img src="/satisfied_customers.png" alt="Satisfied Business Clients" style={{ width: '100%', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', objectFit: 'cover' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="section-padding bg-light">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '2.5rem' }}>Success Stories</h2>
            <p>Tailored solutions that drive business growth.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
            {/* Case Study 1 */}
            <div className="glass-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '200px', background: 'var(--primary-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                 <h3 style={{ color: 'white', fontSize: '1.6rem', textAlign: 'center' }}>Tech Startup Secures $500k</h3>
              </div>
              <div style={{ padding: '30px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '12px' }}>Startup Funding Success</h3>
                <p style={{ marginBottom: '16px', fontSize: '0.95rem' }}><strong>Challenge:</strong> Tech startup needed $500,000 but lacked a convincing strategy and pitch deck.</p>
                <div style={{ marginTop: 'auto', padding: '20px', background: 'var(--bg-white)', borderRadius: '12px', borderLeft: '4px solid var(--primary-orange)' }}>
                  <strong>Result:</strong> Secured $500,000 in funding within 3 months and successfully scaled.
                </div>
              </div>
            </div>

            {/* Case Study 2 */}
            <div className="glass-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '200px', background: 'var(--primary-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                <h3 style={{ color: 'white', fontSize: '1.6rem', textAlign: 'center' }}>Retail Traffic Up 40%</h3>
              </div>
              <div style={{ padding: '30px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '12px' }}>Global Branding Results</h3>
                <p style={{ marginBottom: '16px', fontSize: '0.95rem' }}><strong>Challenge:</strong> Small retail brand wanted a cohesive strategy and professional online presence.</p>
                <div style={{ marginTop: 'auto', padding: '20px', background: 'var(--bg-white)', borderRadius: '12px', borderLeft: '4px solid var(--primary-blue)' }}>
                  <strong>Result:</strong> Traffic increased 40% and social following grew 150% in 60 days.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section style={{ padding: '80px 0', borderTop: '1px solid var(--shadow-sm)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>People Who Love Our Services</h2>
            <p>Join our satisfied clients who have achieved remarkable success.</p>
          </div>
          {/* Authentic Logo Highlights */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '60px', flexWrap: 'wrap', opacity: 0.6 }}>
             {[<SiTesla size={60} />, <SiSamsung size={80} />, <SiCisco size={60} />, <SiIntel size={80} />, <SiApple size={60} />].map((icon, idx) => (
               <div key={idx} style={{ 
                 height: '80px', 
                 display: 'flex', 
                 alignItems: 'center', 
                 justifyContent: 'center', 
                 color: 'var(--color-black)',
                 filter: 'grayscale(100%)',
                 transition: 'var(--transition)',
                 cursor: 'pointer'
               }} onMouseEnter={(e) => { e.currentTarget.style.filter = 'grayscale(0%)'; e.currentTarget.style.color = 'var(--primary-blue)' }} onMouseLeave={(e) => { e.currentTarget.style.filter = 'grayscale(100%)'; e.currentTarget.style.color = 'var(--color-black)' }}>
                 {icon}
               </div>
             ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
