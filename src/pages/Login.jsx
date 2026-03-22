import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (loginError) throw loginError;

      alert(`Welcome back!`);
      navigate('/dashboard'); 

    } catch (err) {
       setError(err.message || 'Invalid login credentials.');
    } finally {
       setLoading(false);
    }
  };

  return (
    <div style={{ padding: '80px 20px', background: 'var(--bg-color)', minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="glass-card" style={{ maxWidth: '500px', width: '100%', padding: '40px', borderRadius: '16px' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '10px', textAlign: 'center', color: 'var(--primary-blue)' }}>Welcome Back</h2>
        <p style={{ textAlign: 'center', color: 'var(--color-gray)', marginBottom: '30px' }}>Login to access your BeconHive dashboard.</p>
        
        {error && <div style={{ background: '#FEE2E2', color: '#DC2626', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Email Address</label>
            <input type="email" name="email" required onChange={handleChange} style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid var(--color-gray)', outline: 'none' }} placeholder="you@company.com" />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontWeight: 600 }}>Password</label>
              <Link to="#" style={{ color: 'var(--primary-orange)', fontSize: '0.9rem' }}>Forgot password?</Link>
            </div>
            <input type="password" name="password" required onChange={handleChange} style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid var(--color-gray)', outline: 'none' }} placeholder="••••••••" />
          </div>
          
          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
            {loading ? 'Authenticating...' : 'Login'}
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--color-gray)' }}>
          Don't have an account? <Link to="/signup" style={{ color: 'var(--primary-blue)', fontWeight: 600 }}>Sign up here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
