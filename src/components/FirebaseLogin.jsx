import { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default function FirebaseLogin({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    rank: '',
    unit: '',
    division: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignup) {
        // Signup
        if (!formData.email || !formData.password || !formData.fullName || !formData.rank || !formData.unit) {
          setError('Please fill in all required fields');
          setLoading(false);
          return;
        }

        // Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );

        // Store user profile in Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          email: formData.email,
          fullName: formData.fullName,
          rank: formData.rank,
          unit: formData.unit,
          division: formData.division || 'General Duties Division | Victoria Police',
          createdAt: new Date().toISOString()
        });

        // Auto login after signup
        onLogin({
          uid: userCredential.user.uid,
          email: formData.email,
          fullName: formData.fullName,
          rank: formData.rank,
          unit: formData.unit,
          division: formData.division || 'General Duties Division | Victoria Police'
        });

      } else {
        // Login
        if (!formData.email || !formData.password) {
          setError('Please enter email and password');
          setLoading(false);
          return;
        }

        // Sign in with Firebase Auth
        const userCredential = await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );

        // Get user profile from Firestore
        const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          onLogin({
            uid: userCredential.user.uid,
            email: userData.email,
            fullName: userData.fullName,
            rank: userData.rank,
            unit: userData.unit,
            division: userData.division
          });
        } else {
          setError('User profile not found');
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      
      // User-friendly error messages
      switch (err.code) {
        case 'auth/email-already-in-use':
          setError('Email already in use');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address');
          break;
        case 'auth/weak-password':
          setError('Password should be at least 6 characters');
          break;
        case 'auth/user-not-found':
          setError('No account found with this email');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password');
          break;
        case 'auth/network-request-failed':
          setError('Network error. Please check your connection.');
          break;
        default:
          setError(err.message || 'An error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {!isSignup ? (
          /* Windows 10 Style Login */
          <div className="text-center">
            {/* User Icon Circle */}
            <div className="mb-8 flex justify-center">
              <div className="w-40 h-40 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-2xl">
                <svg className="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <input
                type="email"
                className="w-full bg-white/90 backdrop-blur-sm text-gray-800 rounded px-4 py-3 outline-none focus:bg-white transition-colors placeholder-gray-500"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                disabled={loading}
              />

              {/* Password Input */}
              <div className="relative">
                <input
                  type="password"
                  className="w-full bg-white/90 backdrop-blur-sm text-gray-800 rounded px-4 py-3 pr-12 outline-none focus:bg-white transition-colors placeholder-gray-500"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center hover:bg-black/5 rounded transition-colors disabled:opacity-50"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/90 backdrop-blur-sm text-white rounded px-4 py-3 text-sm text-center">
                  {error}
                </div>
              )}
            </form>

            {/* Sign Up Link */}
            <div className="mt-8">
              <button
                onClick={() => {
                  setIsSignup(true);
                  setError('');
                }}
                disabled={loading}
                className="text-white/80 hover:text-white text-sm transition-colors disabled:opacity-50"
              >
                Don't have an account? Sign up
              </button>
            </div>
          </div>
        ) : (
          /* Signup Form - Keep existing style */
          <div>
            <div className="text-center mb-8">
              <div className="text-3xl font-light text-white mb-2">Create Account</div>
              <div className="text-white/60 text-sm">Victoria Police Report Management System</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <form onSubmit={handleSubmit} className="grid gap-4">
                {/* Email */}
                <input
                  type="email"
                  className="w-full bg-white/90 text-gray-800 rounded px-3 py-2.5 outline-none focus:bg-white placeholder-gray-500"
                  placeholder="Email *"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  disabled={loading}
                />

                {/* Password */}
                <input
                  type="password"
                  className="w-full bg-white/90 text-gray-800 rounded px-3 py-2.5 outline-none focus:bg-white placeholder-gray-500"
                  placeholder="Password (min 6 characters) *"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  disabled={loading}
                />

                <div className="h-px bg-white/20 my-2"></div>

                {/* Full Name */}
                <input
                  type="text"
                  className="w-full bg-white/90 text-gray-800 rounded px-3 py-2.5 outline-none focus:bg-white placeholder-gray-500"
                  placeholder="Full Name *"
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  disabled={loading}
                />

                {/* Rank */}
                <input
                  type="text"
                  className="w-full bg-white/90 text-gray-800 rounded px-3 py-2.5 outline-none focus:bg-white placeholder-gray-500"
                  placeholder="Rank (e.g. Senior Constable) *"
                  value={formData.rank}
                  onChange={(e) => handleChange('rank', e.target.value)}
                  disabled={loading}
                />

                {/* Unit */}
                <input
                  type="text"
                  className="w-full bg-white/90 text-gray-800 rounded px-3 py-2.5 outline-none focus:bg-white placeholder-gray-500"
                  placeholder="Unit / Callsign (e.g. MEL 228) *"
                  value={formData.unit}
                  onChange={(e) => handleChange('unit', e.target.value)}
                  disabled={loading}
                />

                {/* Division */}
                <input
                  type="text"
                  className="w-full bg-white/90 text-gray-800 rounded px-3 py-2.5 outline-none focus:bg-white placeholder-gray-500"
                  placeholder="Division (optional)"
                  value={formData.division}
                  onChange={(e) => handleChange('division', e.target.value)}
                  disabled={loading}
                />

                {/* Error Message */}
                {error && (
                  <div className="bg-red-500/90 text-white rounded px-3 py-2.5 text-sm">
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-white/20 hover:bg-white/30 text-white rounded px-4 py-3 font-medium transition-colors mt-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>

              {/* Back to Login */}
              <div className="mt-6 text-center">
                <button
                  onClick={() => {
                    setIsSignup(false);
                    setError('');
                  }}
                  disabled={loading}
                  className="text-white/70 hover:text-white text-sm transition-colors disabled:opacity-50"
                >
                  Already have an account? Sign in
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
