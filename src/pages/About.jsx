import React from 'react';
import { Link } from 'react-router-dom';
const About = () => {
  return (
    <div>
       {/* Page Header */}
       <section style={{ 
         padding: '160px 0 100px', 
         position: 'relative',
         background: 'url("/about_team.png")', 
         backgroundSize: 'cover',
         backgroundPosition: 'center',
         color: 'white', 
         textAlign: 'center' 
       }}>
        {/* Dark Colored Overlay to enforce text visibility standards */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to right, rgba(10, 88, 202, 0.95) 0%, rgba(10, 88, 202, 0.1) 100%)' }}></div>
        
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ color: 'white', fontSize: '3.5rem', marginBottom: '20px' }}>About Us</h1>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto' }}>
            Discover how BeconHive empowers businesses with expert services designed to fuel growth and success.
          </p>
        </div>
      </section>

      {/* intro */}
      <section className="section-padding">
        <div className="container">
          <div className="mobile-centered-stack" style={{ display: 'flex', flexWrap: 'wrap', gap: '60px', alignItems: 'center' }}>
            <div style={{ flex: '1 1 500px' }}>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '24px' }}>About BeconHive</h2>
              <p style={{ marginBottom: '20px' }}>
                Beconhive is a professional service provider specializing in business plan writing, pitch decks, grant proposals, and much more.
              </p>
              <p>
                With a dedicated team of professionals, we’ve built our reputation on helping businesses across the globe achieve their growth goals efficiently and affordably.
              </p>
            </div>
            <div style={{ flex: '1 1 400px', background: 'var(--bg-light-blue)', padding: '40px', borderRadius: '24px', position: 'relative' }}>
               <div style={{ position: 'absolute', top: '-15px', left: '-15px', background: 'var(--primary-orange)', color: 'white', padding: '16px', borderRadius: '50%', fontWeight: 'bold' }}>10+ Yrs</div>
               <h3 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>Global Reach</h3>
               <p style={{ color: 'var(--color-black)' }}>Serving clients in the USA, UK, Canada, Switzerland, Mexico, Africa, and beyond.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Journey */}
      <section className="section-padding bg-light">
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
              <span style={{ color: 'var(--primary-orange)', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>Our History</span>
              <h2 style={{ fontSize: '2.5rem', marginTop: '16px' }}>How It Started</h2>
            </div>
            
            <div style={{ background: 'white', padding: '50px', borderRadius: '24px', boxShadow: 'var(--shadow-md)' }}>
              <p style={{ marginBottom: '24px', fontSize: '1.1rem' }}>
                Our journey began with a simple, but bold vision from our founder, Ola Topaz. Armed with passion and determination, Ola Topaz and his team set out to offer remote professional services that would enable companies to grow without the high costs and limitations of traditional hiring. 
              </p>
              <p style={{ marginBottom: '24px', fontSize: '1.1rem' }}>
                Over a decade ago, we leaped into freelancing, and soon after, exciting opportunities began to emerge. Friends, colleagues, companies, and referrals came to us with their needs, and we quickly recognized a growing demand among startups for outsourced business solutions.
              </p>
              <p style={{ marginBottom: '24px', fontSize: '1.1rem' }}>
                At Beconhive, we believe that startups and growing a business shouldn’t be overwhelming or inaccessible. We asked ourselves: Why should startups face the anxiety and steep learning curve of business planning on their own? What if there was a better way? That’s why we’ve dedicated ourselves to providing expert services, helping entrepreneurs overcome these challenges.
              </p>
              <p style={{ fontSize: '1.1rem', fontStyle: 'italic', fontWeight: 600, borderLeft: '4px solid var(--primary-blue)', paddingLeft: '20px', color: 'var(--color-black)' }}>
                "We’re not just a service provider—we’re a hive of expertise, dedicated to helping businesses succeed."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding" style={{ background: 'var(--color-black)', color: 'white' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px' }}>
            <div style={{ padding: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px' }}>
              <div style={{ width: '60px', height: '60px', background: 'var(--primary-orange)', borderRadius: '15px', marginBottom: '24px' }}></div>
              <h2 style={{ color: 'white', marginBottom: '20px' }}>Vision Statement</h2>
              <p style={{ color: '#cbd5e1', fontSize: '1.15rem' }}>
                To be the global leader in delivering expert services that drive business growth, innovation, and success for entrepreneurs and companies worldwide.
              </p>
            </div>
            <div style={{ padding: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px' }}>
              <div style={{ width: '60px', height: '60px', background: 'var(--primary-blue)', borderRadius: '15px', marginBottom: '24px' }}></div>
              <h2 style={{ color: 'white', marginBottom: '20px' }}>Mission Statement</h2>
              <p style={{ color: '#cbd5e1', fontSize: '1.15rem' }}>
                Our mission is to empower businesses by providing tailored, high-quality solutions that simplify their journey to success and enable them to thrive in a competitive world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Why Choose Beconhive?</h2>
            <p style={{ maxWidth: '700px', margin: '0 auto' }}>
              At Beconhive, we help visionary entrepreneurs and business leaders Plan, Build, and Fund their business dreams.
            </p>
          </div>

          <div className="mobile-horizontal-scroll" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
            <div className="glass-card card-hover" style={{ padding: '40px' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', color: 'var(--primary-blue)' }}>Professional Writers</h3>
              <p>Our team of expert business plan writers brings extensive industry experience. We’ve conducted research in over 350 industries and are well-versed in crafting custom business plans.</p>
            </div>
            <div className="glass-card card-hover" style={{ padding: '40px' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', color: 'var(--primary-orange)' }}>Proven Success in Funding</h3>
              <p>Our clients have secured millions in funding through both debt and equity financing. We provide valuable insights and strategies to help you navigate fundraising.</p>
            </div>
            <div className="glass-card card-hover" style={{ padding: '40px' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', color: 'var(--primary-blue)' }}>Unmatched Reputation</h3>
              <p>With thousands of satisfied customers and hundreds of 5-star testimonials, our reputation speaks for itself. We deliver excellence in every project.</p>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '60px' }}>
            <Link to="/contact" className="btn btn-primary" style={{ padding: '16px 40px', fontSize: '1.1rem' }}>Let Us Help Turn Your Vision Into Reality</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
