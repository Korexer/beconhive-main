import React from 'react';
import { Link } from 'react-router-dom';
import { servicesData } from '../data/services';
import { Briefcase, Presentation, FileText, Share2, Monitor, Target, Video, Palette, PenTool, Smartphone, Zap, Youtube, Mic, Star } from 'lucide-react';

const iconMap = {
  "business-plan-writing": <Briefcase size={36} color="var(--primary-blue)" />,
  "pitch-deck-design": <Presentation size={36} color="var(--primary-orange)" />,
  "resume-cover-letter": <FileText size={36} color="var(--primary-blue)" />,
  "social-media-management": <Share2 size={36} color="var(--primary-orange)" />,
  "web-development": <Monitor size={36} color="var(--primary-blue)" />,
  "branding": <Target size={36} color="var(--primary-orange)" />,
  "video-editing": <Video size={36} color="var(--primary-blue)" />,
  "graphic-designing": <Palette size={36} color="var(--primary-orange)" />,
  "blog-writing": <PenTool size={36} color="var(--primary-blue)" />,
  "app-development": <Smartphone size={36} color="var(--primary-orange)" />,
  "business-automation": <Zap size={36} color="var(--primary-blue)" />,
  "youtube-automation": <Youtube size={36} color="var(--primary-orange)" />,
  "transcription": <Mic size={36} color="var(--primary-blue)" />
};

const ServicesList = () => {
  return (
    <div>
      <section style={{ 
        padding: '160px 0 100px', 
        position: 'relative',
        background: 'url("/services_cover.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white', 
        textAlign: 'center' 
      }}>
        {/* Dark Colored Overlay to enforce text visibility standards */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to right, rgba(10, 88, 202, 0.95) 0%, rgba(10, 88, 202, 0.1) 100%)' }}></div>
        
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ color: 'white', fontSize: '3.5rem', marginBottom: '20px' }}>Our Expert Services</h1>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto' }}>
            Choose from our comprehensive suite of professional services designed to establish, grow, and automate your business.
          </p>
        </div>
      </section>

      <section className="section-padding bg-light">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
            {servicesData.map((service, index) => {
              const reviewCount = 60 + ((index * 17) % 91); // pseudo-random standard distribution 60-150
              return (
              <div key={service.id} className="glass-card card-hover" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ padding: '30px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ marginBottom: '24px', background: 'rgba(10,50,115,0.05)', width: '70px', height: '70px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {iconMap[service.id]}
                  </div>
                  <h3 style={{ fontSize: '1.5rem', color: 'var(--primary-blue)', marginBottom: '16px' }}>{service.title}</h3>
                  <p style={{ marginBottom: '24px', flex: 1, color: 'var(--color-gray)' }}>{service.shortDesc}</p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', color: '#FFD700' }}>
                      <Star size={18} fill="#FFD700" />
                      <Star size={18} fill="#FFD700" />
                      <Star size={18} fill="#FFD700" />
                      <Star size={18} fill="#FFD700" />
                      <Star size={18} fill="#FFD700" />
                    </div>
                    <span style={{ color: 'var(--color-gray)', fontWeight: 600, fontSize: '0.9rem' }}>({reviewCount})</span>
                  </div>

                  <Link to={`/services/${service.slug}`} className="btn btn-outline" style={{ width: '100%' }}>View Packages</Link>
                </div>
              </div>
            )})}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesList;
