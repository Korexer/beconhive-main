import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

const Signup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = Details, 2 = Verification
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStep1Submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 1. Generate 6-digit random code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);

    try {
      // 2. Add to email_verifications table for record-keeping
      const { error: dbError } = await supabase
        .from('email_verifications')
        .insert({ 
          email: formData.email, 
          code: code,
          expires_at: new Date(Date.now() + 10 * 60000).toISOString() // 10 mins
        });
        
      if (dbError && dbError.code !== '23505') throw dbError; // Ignore if it's just a duplicate existing unverified code row for now

      // 3. Call Edge Function to send email
      const { data, error: functionError } = await supabase.functions.invoke('send_verification_email', {
        body: { email: formData.email, code: code }
      });

      if (functionError) throw functionError;
      
      // Proceed to Step 2
      setVerificationCode(''); // Ensure code input is empty when entering step 2
      setStep(2);
    } catch (err) {
      console.error(err);
      setError("Failed to send verification email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStep2Submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Sanitize input (trim spaces)
    const enteredCode = verificationCode.trim();

    if (enteredCode !== generatedCode) {
      setError("Invalid or incorrect verification code. Please check your email again.");
      setLoading(false);
      return;
    }

    try {
      // Correct verification code, proceed to create user account
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            role: 'customer'
          }
        }
      });

      if (signUpError) throw signUpError;

      // Update email verification record 
      await supabase.from('email_verifications')
        .update({ verified: true })
        .eq('email', formData.email);

      // Successfully registered
      alert("Account verified and created successfully! Welcome to BeconHive.");
      navigate('/dashboard');
      
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '80px 20px', background: 'var(--bg-light-blue)', minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="glass-card" style={{ maxWidth: '500px', width: '100%', padding: '40px', borderRadius: '16px' }}>
        
        {step === 1 ? (
          <>
            <h2 style={{ fontSize: '2rem', marginBottom: '10px', textAlign: 'center' }}>Create an Account</h2>
            <p style={{ textAlign: 'center', color: 'var(--color-gray)', marginBottom: '30px' }}>Join BeconHive and start scaling your business.</p>
            
            {error && <div style={{ background: '#FEE2E2', color: '#DC2626', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem' }}>{error}</div>}

            <form onSubmit={handleStep1Submit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Full Name</label>
                <input type="text" name="fullName" required onChange={handleChange} style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} placeholder="John Doe" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Email Address</label>
                <input type="email" name="email" required onChange={handleChange} style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} placeholder="you@company.com" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Password <span style={{fontSize: '0.8rem', color: 'var(--color-gray)', fontWeight: 'normal'}}>(Min 6 chars)</span></label>
                <input type="password" name="password" minLength={6} required onChange={handleChange} style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} placeholder="••••••••" />
              </div>
              
              <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                {loading ? 'Processing...' : 'Verify Email'}
              </button>
            </form>
            
            <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--color-gray)' }}>
              Already have an account? <Link to="/login" style={{ color: 'var(--primary-blue)', fontWeight: 600 }}>Login here</Link>
            </p>
          </>
        ) : (
          <>
             <h2 style={{ fontSize: '2rem', marginBottom: '10px', textAlign: 'center' }}>Enter Verification Code</h2>
             <p style={{ textAlign: 'center', color: 'var(--color-gray)', marginBottom: '30px' }}>We sent a 6-digit code to <strong>{formData.email}</strong>. Entering it below allows us to secure your account instantly.</p>
             
             {error && <div style={{ background: '#FEE2E2', color: '#DC2626', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem' }}>{error}</div>}

              <form onSubmit={handleStep2Submit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                   <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Verification Code <span style={{ color: 'red' }}>*</span></label>
                   <input 
                     type="text" 
                     name="beconhive_verify_code_input" 
                     autoComplete="off" 
                     maxLength={6} 
                     required 
                     value={verificationCode}
                     onChange={(e) => setVerificationCode(e.target.value)} 
                     style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '2px solid var(--primary-orange)', outline: 'none', textAlign: 'center', fontSize: '1.2rem', letterSpacing: '4px' }} 
                     placeholder="000000" 
                   />
                </div>
               
               <button type="submit" disabled={loading} className="btn btn-secondary" style={{ width: '100%', marginTop: '10px' }}>
                  {loading ? 'Verifying...' : 'Complete Sign Up'}
               </button>

               <button type="button" onClick={() => setStep(1)} disabled={loading} className="btn btn-outline" style={{ width: '100%' }}>
                  Back / Change Email
               </button>
             </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Signup;
