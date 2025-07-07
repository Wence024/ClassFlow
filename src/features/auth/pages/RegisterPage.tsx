import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  const { register, loading, error, user } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user || success) {
      navigate('/class-sessions');
    }
  }, [user, success, navigate]);

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!name) errors.name = 'Name is required';
    if (!email) errors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = 'Email is invalid';
    if (!password) errors.password = 'Password is required';
    if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await register(name, email, password);
      setSuccess(true);
    } catch (err) {
      // Error handling is done in the AuthContext
    }
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: '40px auto',
        padding: 24,
        background: '#fff',
        borderRadius: 8,
        boxShadow: '0 2px 8px #0001',
      }}
    >
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
          {formErrors.name && (
            <div style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.name}</div>
          )}
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
          {formErrors.email && (
            <div style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.email}</div>
          )}
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
          {formErrors.password && (
            <div style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.password}</div>
          )}
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
          {formErrors.confirmPassword && (
            <div style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.confirmPassword}</div>
          )}
        </div>
        <button type="submit" disabled={loading} style={{ width: '100%', padding: 10 }}>
          {loading ? 'Registering...' : 'Register'}
        </button>
        {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
      </form>
      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <Link to="/login">Already have an account? Login</Link>
      </div>
    </div>
  );
};

export default RegisterPage;
