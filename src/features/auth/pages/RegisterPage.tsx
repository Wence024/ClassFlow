import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  const { register, loading, error, clearError } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

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
    } catch {
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
      <form onSubmit={handleSubmit} role="form" aria-label="Register form">
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="register-name">Name:</label>
          <input
            id="register-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
            aria-label="Name"
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
          {formErrors.name && (
            <div style={{ color: 'red', fontSize: '0.8rem' }} role="alert" aria-live="assertive">
              {formErrors.name}
            </div>
          )}
        </div>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="register-email">Email:</label>
          <input
            id="register-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            aria-label="Email address"
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
          {formErrors.email && (
            <div style={{ color: 'red', fontSize: '0.8rem' }} role="alert" aria-live="assertive">
              {formErrors.email}
            </div>
          )}
        </div>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="register-password">Password:</label>
          <input
            id="register-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            aria-label="Password"
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
          {formErrors.password && (
            <div style={{ color: 'red', fontSize: '0.8rem' }} role="alert" aria-live="assertive">
              {formErrors.password}
            </div>
          )}
        </div>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="register-confirm-password">Confirm Password:</label>
          <input
            id="register-confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
            aria-label="Confirm password"
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
          {formErrors.confirmPassword && (
            <div style={{ color: 'red', fontSize: '0.8rem' }} role="alert" aria-live="assertive">
              {formErrors.confirmPassword}
            </div>
          )}
        </div>
        <button type="submit" disabled={loading} style={{ width: '100%', padding: 10 }}>
          {loading ? 'Registering...' : 'Register'}
        </button>
        {error && (
          <div style={{ color: 'red', marginTop: 10 }} role="alert" aria-live="assertive">
            {error}
          </div>
        )}
      </form>
      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <Link to="/login">Already have an account? Login</Link>
      </div>
    </div>
  );
};

export default RegisterPage;
