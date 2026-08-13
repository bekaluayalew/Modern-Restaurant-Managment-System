import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ForgotPasswordPage.css';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [resetUrl, setResetUrl] = useState('');

 const handleSubmit = async (e) => {
  e.preventDefault();

  setError('');
  setMessage('');
  setResetUrl('');

  if (!email.trim()) {
    setError('Please enter your email address.');
    return;
  }

  try {
    setLoading(true);

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/auth/forgot-password`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
        }),
      }
    );

    console.log('Response status:', response.status);
    console.log('Response content type:', response.headers.get('content-type'));

    const responseText = await response.text();

    console.log('Server response:', responseText);

    let data;

    try {
      data = JSON.parse(responseText);
    } catch (error) {
      console.error('JSON parsing error:', error);

      throw new Error(
        'The server did not return JSON. Check the Node.js terminal for an error.'
      );
    }

    if (!response.ok) {
      throw new Error(
        data.message || 'Failed to process password reset request.'
      );
    }

    setMessage(
      data.message ||
        'Password reset link generated successfully.'
    );

    if (data.resetUrl) {
      setResetUrl(data.resetUrl);
    }

  } catch (err) {
    console.error('Forgot password error:', err);

    setError(
      err.message ||
        'Something went wrong. Please try again.'
    );

  } finally {
    setLoading(false);
  }
};

  return (
    <div className="forgot-page">
      <div className="forgot-container">
        <div className="forgot-card">

          <div className="forgot-header">
            <h2>Forgot Password?</h2>

            <p>
              Enter your email address and we will help you
              reset your password.
            </p>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {message && (
            <div className="success-message">
              {message}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="forgot-form"
          >

            <div className="form-group">
              <label htmlFor="email">
                Email Address
              </label>

              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                  setMessage('');
                  setResetUrl('');
                }}
                placeholder="Enter your email"
                autoComplete="email"
                required
              />
            </div>

            <button
              type="submit"
              className="reset-btn"
              disabled={loading}
            >
              {loading
                ? 'Processing...'
                : 'Send Reset Link'}
            </button>

          </form>

          {/* Local development reset link */}
          {resetUrl && (
            <div className="reset-link-box">
              <p>
                <strong>Development Reset Link:</strong>
              </p>

              <a
                href={resetUrl}
                className="reset-link"
              >
                Open Reset Password Page
              </a>

              <small>
                This link is displayed because your application
                is currently running locally.
              </small>
            </div>
          )}

          <div className="forgot-footer">
            <Link to="/login">
              ← Back to Login
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;