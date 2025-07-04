import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    if (email.includes('@')) {
      setSent(true);
    } else {
      setError('Please enter a valid email address.');
    }
    setLoading(false);
  };

  if (sent) {
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
        A password reset link has been sent to {email}.<br />
        <Link to="/login">Back to Login</Link>
      </div>
    );
  }

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
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </div>
        <button type="submit" disabled={loading} style={{ width: '100%', padding: 10 }}>
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
        {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
      </form>
      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <Link to="/login">Back to Login</Link>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
