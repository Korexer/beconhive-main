import React from 'react';

const Contact = () => {
  return (
    <div>
      <section style={{ 
        padding: '160px 0 100px', 
        position: 'relative',
        background: 'url("/contact_cover.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white', 
        textAlign: 'center' 
      }}>
        {/* Dark Colored Overlay to enforce text visibility standards */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to right, rgba(10, 88, 202, 0.95) 0%, rgba(10, 88, 202, 0.1) 100%)' }}></div>
        
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ color: 'white', fontSize: '3.5rem', marginBottom: '20px' }}>Contact Us</h1>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto' }}>
            Get in touch with BeconHive for personalized solutions that drive your business forward. We’re here to help you succeed.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="responsive-contact-grid" style={{ display: 'flex', gap: '60px', flexDirection: 'row' }}>
            
            {/* Contact Info (Second on mobile) */}
            <div style={{ flex: 1, order: 2 }}>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '24px' }}>Let's talk about your project</h2>
              <p style={{ marginBottom: '40px' }}>We would love to hear from you! Reach out to discuss how we can help elevate your business.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '30px', background: 'var(--bg-light-blue)', borderRadius: '16px' }}>
                  <div style={{ width: '60px', height: '60px', background: 'var(--primary-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', color: 'white' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Email Us</h3>
                    <p style={{ margin: 0, fontWeight: 600, color: 'var(--primary-blue)' }}>info@beconhive.com</p>
                    <p style={{ margin: 0, fontWeight: 600, color: 'var(--primary-blue)' }}>support@beconhive.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form (First on mobile) */}
            <div className="glass-card" style={{ padding: '40px', flex: 1, order: 1 }}>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '24px' }}>Send us a Message</h3>
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  fetch('https://formsubmit.co/ajax/info@beconhive.com', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify({
                      name: e.target.name.value,
                      email: e.target.email.value,
                      subject: e.target.subject.value,
                      message: e.target.message.value,
                      _subject: 'New Website Contact Form Submission'
                    })
                  })
                  .then(response => response.json())
                  .then(data => {
                    alert("Message successfully sent! Our team at info@beconhive.com will contact you shortly.");
                    e.target.reset();
                  })
                  .catch(error => {
                    alert("Message could not be automatically sent. Please email us manually at info@beconhive.com");
                  });
                }} 
                style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label htmlFor="name" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Name *</label>
                  <input type="text" name="name" id="name" required style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid var(--color-gray)', outline: 'none', fontSize: '1rem' }} />
                </div>
                <div>
                  <label htmlFor="email" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Email *</label>
                  <input type="email" name="email" id="email" required style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid var(--color-gray)', outline: 'none', fontSize: '1rem' }} />
                </div>
                <div>
                  <label htmlFor="subject" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Subject *</label>
                  <input type="text" name="subject" id="subject" required style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid var(--color-gray)', outline: 'none', fontSize: '1rem' }} />
                </div>
                <div>
                  <label htmlFor="message" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Your Message *</label>
                  <textarea name="message" id="message" rows="5" required style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid var(--color-gray)', outline: 'none', fontSize: '1rem', resize: 'vertical' }}></textarea>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>Submit Message</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <style>{`
         @media (max-width: 767px) {
           .responsive-contact-grid { flex-direction: column !important; }
           .responsive-contact-grid > div:nth-child(1) { order: 2 !important; }
           .responsive-contact-grid > div:nth-child(2) { order: 1 !important; }
         }
      `}</style>
    </div>
  );
};

export default Contact;
