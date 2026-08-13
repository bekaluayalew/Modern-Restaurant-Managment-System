import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import './ResetPasswordPage.css';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    if (!token) {
      setError('Invalid reset link. The reset token is missing.');
      return;
    }

    if (!password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);

      const apiUrl =
        `${import.meta.env.VITE_API_URL}/auth/reset-password/${token}`;

      console.log('Reset password URL:', apiUrl);

      const response = await fetch(apiUrl, {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          password,
          confirmPassword,
        }),
      });

      console.log('Response status:', response.status);

      const responseText = await response.text();

      console.log('Server response:', responseText);

      let data;

      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error(
          'The server returned an invalid response.'
        );
      }

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to reset password.'
        );
      }

      setSuccess(
        data.message ||
          'Password has been reset successfully.'
      );

      setPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      console.error('Reset password error:', err);

      setError(
        err.message ||
          'Failed to fetch. Please try again.'
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-page">

      <div className="reset-container">

        <div className="reset-card">

          <div className="reset-header">

            <h2>Reset Password</h2>

            <p>
              Enter your new password below.
            </p>

          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {success && (
            <div className="success-message">
              {success}
            </div>
          )}

          {!success && (
            <form
              onSubmit={handleSubmit}
              className="reset-form"
            >

              <div className="form-group">

                <label htmlFor="password">
                  New Password
                </label>

                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter new password"
                  autoComplete="new-password"
                  required
                />

              </div>

              <div className="form-group">

                <label htmlFor="confirmPassword">
                  Confirm New Password
                </label>

                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                  required
                />

              </div>

              <button
                type="submit"
                className="reset-btn"
                disabled={loading}
              >
                {loading
                  ? 'Changing Password...'
                  : 'Change Password'}
              </button>

            </form>
          )}

          <div className="reset-footer">

            <Link to="/login">
              ← Back to Login
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
};

export default ResetPasswordPage