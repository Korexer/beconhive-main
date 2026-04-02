import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { servicesData } from '../data/services';
import { Check, Star } from 'lucide-react';
import { useAuth } from '../utils/AuthContext';
import { supabase } from '../utils/supabaseClient';

const NGN_EXCHANGE_RATE = 1550; // Standard USD to NGN rate
const FLUTTERWAVE_PUB = import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY;

// Dedicated Purchase button handling its own Flutterwave configuration natively via inline JS
const PurchaseButton = ({ pkgName, service, user, onSuccessCallback, className }) => {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const amountUsd = service.packages[pkgName.toLowerCase()].price;
  const amountNgn = amountUsd * NGN_EXCHANGE_RATE;

  useEffect(() => {
    // Dynamically load Flutterwave script for ultra-fast bundle performance
    if (document.getElementById('flutterwave-script')) {
      setScriptLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.src = "https://checkout.flutterwave.com/v3.js";
    script.id = "flutterwave-script";
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);
  }, []);

  const handleClick = () => {
    if (!user) {
       onSuccessCallback('redirect');
       return;
    }
    if (!scriptLoaded || !window.FlutterwaveCheckout) {
      alert("Payment gateway is still loading, please wait a second.");
      return;
    }
    
    window.FlutterwaveCheckout({
      public_key: FLUTTERWAVE_PUB,
      tx_ref: (new Date()).getTime().toString(),
      amount: amountNgn,
      currency: 'NGN',
      payment_options: 'card, banktransfer, ussd',
      customer: {
        email: user?.email || "customer@beconhive.com",
      },
      customizations: {
        title: "BeconHive",
        description: `Payment for ${service.title} - ${service.packages[pkgName.toLowerCase()].name}`,
      },
      callback: function(response){
        onSuccessCallback({ reference: response.transaction_id || response.tx_ref }, amountUsd, amountNgn, pkgName);
      },
      onclose: function(){
        console.log('Payment window closed.');
      }
    });
  };

  return (
    <button onClick={handleClick} className={className} style={{ width: '100%' }}>
      Select {service.packages[pkgName.toLowerCase()].name}
    </button>
  );
};

const ServiceDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const service = servicesData.find(s => s.slug === slug);

  const onSuccessfulPayment = async (referenceStr, amountUsd, amountNgn, pkgName) => {
    if (referenceStr === 'redirect') {
       alert(`You must be signed in to purchase a package. Redirecting to sign up...`);
       navigate('/signup');
       return;
    }

    try {
      await supabase.from('payments').insert({
         user_id: user.id,
         service_id: service.id,
         package_name: pkgName,
         amount_usd: amountUsd,
         amount_ngn: amountNgn,
         reference: referenceStr.reference,
         status: 'success'
      });
      
      alert(`Payment completely successful! Order recorded. Reference: ${referenceStr.reference}`);
      navigate('/dashboard');
    } catch(err) {
      console.error(err);
      alert("Payment was successful but we couldn't record it automatically. Please contact support with reference " + referenceStr.reference);
    }
  };

  if (!service) {
    return <div className="text-center section-padding"><h2>Service not found</h2><Link to="/services">Back to services</Link></div>;
  }

  return (
    <div>
      <section style={{ padding: '120px 0 80px', background: 'var(--primary-blue)', color: 'white', textAlign: 'center' }}>
        <div className="container">
          <span style={{ 
            display: 'inline-block', padding: '6px 16px', background: 'rgba(0, 0, 0, 0.6)', color: 'white', 
            borderRadius: '20px', fontWeight: 600, fontSize: '0.9rem', marginBottom: '20px'
          }}>Service Details</span>
          <h1 style={{ color: 'white', fontSize: '3.5rem', marginBottom: '20px' }}>{service.title}</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.25rem', maxWidth: '800px', margin: '0 auto' }}>
            {service.shortDesc}
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container" style={{ maxWidth: '900px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '24px' }}>Overview</h2>
          <p style={{ fontSize: '1.2rem', lineHeight: 1.8 }}>{service.fullDesc}</p>
          
          <div style={{ marginTop: '40px' }}>
             <button onClick={() => { if(!user) navigate('/signup'); else navigate('/dashboard'); }} className="btn btn-secondary" style={{ padding: '16px 40px', fontSize: '1.1rem' }}>
                Talk To An Agent About This Service
             </button>
             <p style={{ marginTop: '12px', fontSize: '0.9rem', color: 'var(--color-gray)' }}>Not sure which package is right for you? Talk to one of our expert agents.</p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-light">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Pricing Packages</h2>
            <p>Select the package that best fits your immediate needs. Charges will be processed securely.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', alignItems: 'stretch' }}>
            {/* Basic Package */}
            <div className="glass-card" style={{ padding: '40px', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '1.8rem', color: 'var(--color-black)' }}>{service.packages.basic.name}</h3>
              <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary-blue)', margin: '20px 0' }}>${service.packages.basic.price}</div>
              <p style={{ marginBottom: '30px', minHeight: '60px' }}>{service.packages.basic.desc}</p>
              <ul style={{ marginBottom: '40px', flex: 1 }}>
                {service.packages.basic.features.map((feature, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <Check size={20} color="var(--primary-orange)" /> <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <PurchaseButton pkgName="Basic" service={service} user={user} onSuccessCallback={onSuccessfulPayment} className="btn btn-outline" />
            </div>

            {/* Standard Package */}
            <div className="glass-card" style={{ padding: '40px', display: 'flex', flexDirection: 'column', transform: 'scale(1.05)', border: '2px solid var(--primary-orange)', boxShadow: 'var(--shadow-lg)' }}>
               <div style={{ background: 'var(--primary-orange)', color: 'white', textAlign: 'center', padding: '8px', position: 'absolute', top: 0, left: 0, width: '100%', fontWeight: 'bold' }}>MOST POPULAR</div>
              <h3 style={{ fontSize: '1.8rem', color: 'var(--color-black)', marginTop: '20px' }}>{service.packages.standard.name}</h3>
              <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary-orange)', margin: '20px 0' }}>${service.packages.standard.price}</div>
              <p style={{ marginBottom: '30px', minHeight: '60px' }}>{service.packages.standard.desc}</p>
              <ul style={{ marginBottom: '40px', flex: 1 }}>
                {service.packages.standard.features.map((feature, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <Check size={20} color="var(--primary-orange)" /> <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <PurchaseButton pkgName="Standard" service={service} user={user} onSuccessCallback={onSuccessfulPayment} className="btn btn-secondary" />
            </div>

            {/* Premium Package */}
            <div className="glass-card" style={{ padding: '40px', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '1.8rem', color: 'var(--color-black)' }}>{service.packages.premium.name}</h3>
              <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary-blue)', margin: '20px 0' }}>${service.packages.premium.price}</div>
              <p style={{ marginBottom: '30px', minHeight: '60px' }}>{service.packages.premium.desc}</p>
              <ul style={{ marginBottom: '40px', flex: 1 }}>
                {service.packages.premium.features.map((feature, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <Check size={20} color="var(--primary-orange)" /> <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <PurchaseButton pkgName="Premium" service={service} user={user} onSuccessCallback={onSuccessfulPayment} className="btn btn-primary" />
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Slider Section */}
      <section style={{ padding: '80px 0', borderTop: '1px solid var(--border-color)', overflow: 'hidden' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>What Our Clients Say</h2>
            <p>Real feedback from businesses that utilized our {service.title} services.</p>
          </div>
          
          <div style={{ 
            display: 'flex', 
            gap: '24px', 
            overflowX: 'auto', 
            paddingBottom: '20px', 
            scrollSnapType: 'x mandatory',
            scrollbarWidth: 'thin',
            scrollbarColor: 'var(--primary-blue) transparent'
          }} className="reviews-slider">
            {(service.reviews || []).map((review, idx) => (
              <div key={idx} className="glass-card" style={{ 
                minWidth: '350px', 
                padding: '30px', 
                scrollSnapAlign: 'start', 
                display: 'flex', 
                flexDirection: 'column' 
              }}>
                <div style={{ display: 'flex', gap: '4px', color: '#FFD700', marginBottom: '16px' }}>
                  <Star size={18} fill="#FFD700" />
                  <Star size={18} fill="#FFD700" />
                  <Star size={18} fill="#FFD700" />
                  <Star size={18} fill="#FFD700" />
                  <Star size={18} fill="#FFD700" />
                </div>
                <p style={{ fontStyle: 'italic', marginBottom: '24px', flex: 1, fontSize: '1.05rem', lineHeight: 1.6 }}>"{review.text}"</p>
                <div style={{ fontWeight: 700, color: 'var(--primary-blue)', fontSize: '1.1rem' }}>— {review.name}</div>
              </div>
            ))}
          </div>
          
          <style>{`
            .reviews-slider::-webkit-scrollbar {
              height: 8px;
            }
            .reviews-slider::-webkit-scrollbar-track {
              background: transparent;
            }
            .reviews-slider::-webkit-scrollbar-thumb {
              background-color: var(--primary-blue);
              border-radius: 20px;
            }
          `}</style>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetail;
