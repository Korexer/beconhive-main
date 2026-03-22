import React, { useState } from 'react';
import { servicesData } from '../data/services';
import { supabase } from '../utils/supabaseClient';
import { useNavigate } from 'react-router-dom';

const AgentSignup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', verificationCode: '' });
  const [selectedExpertise, setSelectedExpertise] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleExpertiseToggle = (serviceId) => {
    if (selectedExpertise.includes(serviceId)) {
      setSelectedExpertise(selectedExpertise.filter(id => id !== serviceId));
    } else {
      setSelectedExpertise([...selectedExpertise, serviceId]);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);

    // Hard requirement by user instruction
    if (formData.verificationCode !== 'Agent4Real009H') {
      setError("Invalid Internal Verification Code! Access Denied.");
      return;
    }
    
    if (selectedExpertise.length === 0) {
      setError("Please select at least one area of expertise.");
      return;
    }

    setLoading(true);

    try {
      // Create user auth account
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            role: 'agent', // Key identifier for agent vs customer
            expertise: selectedExpertise,
            internal_verification_code_used: formData.verificationCode,
            is_approved: true
          }
        }
      });

      if (signUpError) throw signUpError;

      alert(`Welcome ${formData.fullName}! Your BeconHive Agent profile has been created successfully.`);
      navigate('/dashboard'); 

    } catch (err) {
       console.error(err);
       setError(err.message || 'Error occurred while creating your agent profile.');
    } finally {
       setLoading(false);
    }
  };

  return (
    <div style={{ padding: '80px 20px', background: 'var(--color-black)', minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="glass-card" style={{ maxWidth: '600px', width: '100%', padding: '40px', borderRadius: '16px', background: 'white' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <span style={{ display: 'inline-block', padding: '6px 12px', background: 'var(--primary-blue)', color: 'white', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '10px' }}>INTERNAL PORTAL</span>
          <h2 style={{ fontSize: '2rem', color: 'var(--color-black)' }}>Agent Registration</h2>
          <p style={{ color: 'var(--color-gray)' }}>Apply to become a BeconHive verified expert.</p>
        </div>

        {error && <div style={{ background: '#FEE2E2', color: '#DC2626', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}
        
        <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Full Name</label>
              <input type="text" name="fullName" required onChange={handleChange} style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none' }} placeholder="Jane Doe" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Email Address</label>
              <input type="email" name="email" required onChange={handleChange} style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none' }} placeholder="jane@beconhive.com" />
            </div>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Password</label>
            <input type="password" name="password" minLength={6} required onChange={handleChange} style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none' }} placeholder="Choose a strong password" />
          </div>

          <div>
             <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Internal Verification Code <span style={{ color: 'red' }}>*</span></label>
             <input type="text" name="verificationCode" required onChange={handleChange} style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '2px solid var(--primary-orange)', outline: 'none' }} placeholder="Enter verification code" />
             <small style={{ color: 'var(--color-gray)', marginTop: '6px', display: 'block' }}>Required for account approval.</small>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '12px', fontWeight: 600 }}>Select Your Expertise (Select multiple)</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', maxHeight: '200px', overflowY: 'auto', padding: '10px', border: '1px solid #eee', borderRadius: '8px' }}>
              {servicesData.map(s => (
                <label key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input type="checkbox" checked={selectedExpertise.includes(s.id)} onChange={() => handleExpertiseToggle(s.id)} />
                  {s.title}
                </label>
              ))}
            </div>
          </div>
          
          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '20px', padding: '16px' }}>
            {loading ? 'Creating Profile...' : 'Submit Agent Application'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AgentSignup;
