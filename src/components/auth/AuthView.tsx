import React, { useState, FormEvent } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import { Theme } from'../../types';

export const AuthView: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.Researcher);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);

  const { login, signup, loginWithGoogle, loginWithGithub } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(name, email, password, role);
      }
    } catch (err: any) {
      console.error(err);
      // More user-friendly error messages
      switch (err.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          setError('Invalid email or password.');
          break;
        case 'auth/email-already-in-use':
          setError('An account with this email already exists.');
          break;
        case 'auth/weak-password':
          setError('Password should be at least 6 characters.');
          break;
        default:
          setError('An unexpected error occurred. Please try again.');
          break;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      // The onAuthStateChanged listener will handle the UI update.
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in cancelled. Please try again.');
      } else if (err.code === 'auth/unauthorized-domain') {
        setError('This domain is not authorized. Please check your Firebase settings.');
      } else {
        setError('Could not sign in with Google. Please try again.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    setError('');
    setGithubLoading(true);
    try {
      await loginWithGithub();
      // The onAuthStateChanged listener will handle the UI update.
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in cancelled. Please try again.');
      } else if (err.code === 'auth/unauthorized-domain') {
        setError('This domain is not authorized. Please check your Firebase settings.');
      } else if (err.code === 'auth/account-exists-with-different-credential') {
        setError('An account already exists with the same email but different sign-in method.');
      } else {
        setError('Could not sign in with GitHub. Please try again.');
      }
    } finally {
      setGithubLoading(false);
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError('');
    setEmail('');
    setPassword('');
    setName('');
    setRole(UserRole.Researcher);
  };
  
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-4 relative overflow-hidden transition-colors duration-200">
        {/* Animated background that works in both themes */}
        <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-br from-blue-200 via-gray-100 to-green-200 dark:from-blue-900 dark:via-gray-900 dark:to-green-900 animate-[rotate_20s_ease-in-out_infinite]"></div>
        
        {/* Theme Toggle Button */}
        <button 
          onClick={toggleTheme}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 backdrop-blur-sm border border-gray-300 dark:border-gray-600 transition-all duration-200 z-20"
          aria-label={`Switch to ${theme === Theme.Dark ? 'light' : 'dark'} mode`}
        >
          {theme === Theme.Dark ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>

        <div className="relative z-10 w-full max-w-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-300 dark:border-white/10 rounded-2xl shadow-2xl p-8 transform transition-all">
            <div className="text-center mb-6">
                <div className="flex justify-center items-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mr-3 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">LabMonitor</h1>
                </div>
                <h2 className="text-xl font-light text-gray-600 dark:text-gray-300">{isLogin ? 'Welcome Back' : 'Create an Account'}</h2>
            </div>

            <div className="space-y-4">
                <button 
                  onClick={handleGoogleSignIn}
                  disabled={googleLoading}
                  className="w-full flex items-center justify-center py-3 px-4 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed border border-gray-600"
                >
                  {googleLoading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : (
                    <>
                      <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48">
                        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path>
                        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path>
                        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.223 0-9.651-3.657-11.297-8.481l-6.522 5.025C9.505 39.556 16.227 44 24 44z"></path>
                        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.012 35.841 44 30.138 44 24c0-1.341-.138-2.65-.389-3.917z"></path>
                      </svg>
                      Continue with Google
                    </>
                  )}
                </button>

                <button 
                  onClick={handleGithubSignIn}
                  disabled={githubLoading}
                  className="w-full flex items-center justify-center py-3 px-4 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed border border-gray-600"
                >
                  {githubLoading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : (
                    <>
                      <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      Continue with GitHub
                    </>
                  )}
                </button>
            </div>

            <div className="relative flex py-5 items-center">
                <div className="flex-grow border-t border-gray-400 dark:border-gray-600"></div>
                <span className="flex-shrink mx-4 text-gray-500 dark:text-gray-400 text-sm">OR</span>
                <div className="flex-grow border-t border-gray-400 dark:border-gray-600"></div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                {!isLogin && (
                     <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2" htmlFor="name">Full Name</label>
                        <input className="w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white transition-colors duration-200" type="text" id="name" value={name} onChange={e => setName(e.target.value)} required />
                    </div>
                )}
                <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2" htmlFor="email">Email Address</label>
                    <input className="w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white transition-colors duration-200" type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2" htmlFor="password">Password</label>
                    <input className="w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white transition-colors duration-200" type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                 {!isLogin && (
                    <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2" htmlFor="role">Your Role</label>
                        <select className="w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none text-gray-900 dark:text-white transition-colors duration-200" id="role" value={role} onChange={e => setRole(e.target.value as UserRole)} required>
                            {Object.values(UserRole).map((r: UserRole) => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                 )}
                 {error && <p className="text-red-600 dark:text-red-400 text-sm text-center bg-red-100 dark:bg-red-900/50 p-2 rounded-lg transition-colors duration-200">{error}</p>}
                <div>
                    <button type="submit" disabled={loading} className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-white transition-all duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center">
                        {loading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : (isLogin ? 'Login' : 'Sign Up')}
                    </button>
                </div>
            </form>
            <div className="mt-6 text-center">
                <p className="text-gray-600 dark:text-gray-400 transition-colors duration-200">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button onClick={toggleForm} className="ml-2 font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200">
                        {isLogin ? 'Sign up' : 'Login'}
                    </button>
                </p>
            </div>
        </div>
    </div>
  );
};