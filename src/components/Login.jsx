import { useState } from 'react';

export default function Login({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    rank: '',
    unit: '',
    division: ''
  });
  const [error, setError] = useState('');

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Get existing users
    const users = JSON.parse(localStorage.getItem('vicpol-users') || '{}');

    if (isSignup) {
      // Signup
      if (!formData.username || !formData.password || !formData.fullName || !formData.rank || !formData.unit) {
        setError('Please fill in all required fields');
        return;
      }

      if (users[formData.username]) {
        setError('Username already exists');
        return;
      }

      // Create new user
      users[formData.username] = {
        password: formData.password,
        fullName: formData.fullName,
        rank: formData.rank,
        unit: formData.unit,
        division: formData.division || 'General Duties Division | Victoria Police'
      };

      localStorage.setItem('vicpol-users', JSON.stringify(users));
      
      // Auto login after signup
      onLogin({
        username: formData.username,
        fullName: formData.fullName,
        rank: formData.rank,
        unit: formData.unit,
        division: formData.division || 'General Duties Division | Victoria Police'
      });
    } else {
      // Login
      if (!formData.username || !formData.password) {
        setError('Please enter username and password');
        return;
      }

      const user = users[formData.username];
      if (!user || user.password !== formData.password) {
        setError('Invalid username or password');
        return;
      }

      onLogin({
        username: formData.username,
        fullName: user.fullName,
        rank: user.rank,
        unit: user.unit,
        division: user.division
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="text-3xl font-black mb-2">VicPol Paperwork</div>
          <div className="text-muted text-sm">Victoria Police Report Management System</div>
        </div>

        {/* Form Card */}
        <div className="bg-gradient-to-b from-card2 to-card border border-border rounded-2xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
          <h2 className="text-xl font-black mb-6">{isSignup ? 'Create Account' : 'Sign In'}</h2>
          
          <form onSubmit={handleSubmit} className="grid gap-4">
            {/* Username */}
            <label>
              <div className="text-xs text-muted mb-1.5 ml-0.5">Username *</div>
              <input
                type="text"
                className="w-full bg-black/25 border border-border text-text rounded-xl px-3 py-2.5 outline-none focus:border-ok/50"
                placeholder="Enter username"
                value={formData.username}
                onChange={(e) => handleChange('username', e.target.value)}
              />
            </label>

            {/* Password */}
            <label>
              <div className="text-xs text-muted mb-1.5 ml-0.5">Password *</div>
              <input
                type="password"
                className="w-full bg-black/25 border border-border text-text rounded-xl px-3 py-2.5 outline-none focus:border-ok/50"
                placeholder="Enter password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
              />
            </label>

            {/* Signup only fields */}
            {isSignup && (
              <>
                <div className="h-px bg-border my-2"></div>
                
                <label>
                  <div className="text-xs text-muted mb-1.5 ml-0.5">Full Name *</div>
                  <input
                    type="text"
                    className="w-full bg-black/25 border border-border text-text rounded-xl px-3 py-2.5 outline-none focus:border-ok/50"
                    placeholder="e.g. Chris Gray"
                    value={formData.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                  />
                </label>

                <label>
                  <div className="text-xs text-muted mb-1.5 ml-0.5">Rank *</div>
                  <input
                    type="text"
                    className="w-full bg-black/25 border border-border text-text rounded-xl px-3 py-2.5 outline-none focus:border-ok/50"
                    placeholder="e.g. Senior Constable"
                    value={formData.rank}
                    onChange={(e) => handleChange('rank', e.target.value)}
                  />
                </label>

                <label>
                  <div className="text-xs text-muted mb-1.5 ml-0.5">Unit / Callsign *</div>
                  <input
                    type="text"
                    className="w-full bg-black/25 border border-border text-text rounded-xl px-3 py-2.5 outline-none focus:border-ok/50"
                    placeholder="e.g. MEL 228"
                    value={formData.unit}
                    onChange={(e) => handleChange('unit', e.target.value)}
                  />
                </label>

                <label>
                  <div className="text-xs text-muted mb-1.5 ml-0.5">Division (optional)</div>
                  <input
                    type="text"
                    className="w-full bg-black/25 border border-border text-text rounded-xl px-3 py-2.5 outline-none focus:border-ok/50"
                    placeholder="General Duties Division | Victoria Police"
                    value={formData.division}
                    onChange={(e) => handleChange('division', e.target.value)}
                  />
                </label>
              </>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-3 py-2.5 text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-ok/20 border border-ok/40 text-ok rounded-xl px-4 py-3 font-black hover:bg-ok/30 transition-colors mt-2"
            >
              {isSignup ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          {/* Toggle Login/Signup */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsSignup(!isSignup);
                setError('');
              }}
              className="text-muted hover:text-text text-sm transition-colors"
            >
              {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 text-center text-muted text-xs">
          All data is stored locally in your browser. No server connection.
        </div>
      </div>
    </div>
  );
}
