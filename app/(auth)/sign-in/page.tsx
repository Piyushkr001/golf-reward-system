"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Client-side guard preventing authenticated traversal
    axios.get('/api/auth/me')
      .then((res) => {
         if (res.data?.user) {
            toast.success("You are already signed in");
            router.replace(res.data.user.role === 'admin' ? '/admin' : '/dashboard');
         }
      })
      .catch(() => {});
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('/api/auth/login', { email, password, role: 'user' });
      toast.success("Successfully logged in!");
      router.push('/onboarding/user');
    } catch (err: any) {
      toast.error(err.response?.data?.error || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (response: any) => {
    try {
      await axios.post('/api/auth/google', { credential: response.credential, role: 'user' });
      toast.success("Google sign-in successful!");
      router.push('/onboarding/user');
    } catch (err: any) {
      toast.error(err.response?.data?.error || err.message || 'Google auth failed');
    }
  };

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "PROVIDE_YOUR_CLIENT_ID"}>
      <div className="w-full max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Welcome Back</h1>
          <p className="text-slate-600 dark:text-slate-400">Sign in to your PlayLance account.</p>
        </div>

        <div className="mb-6 flex justify-center">
          <GoogleLogin 
            onSuccess={handleGoogleSuccess} 
            onError={() => toast.error('Google Sign In failed')}
            shape="pill"
            theme="filled_blue"
            text="signin_with"
          />
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200 dark:border-slate-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-slate-900 px-3 text-slate-500 rounded-full">Or continue with email</span>
          </div>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 relative">
            <Label htmlFor="email" className="text-slate-700 dark:text-slate-300">Email Address</Label>
            <Input 
              id="email" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              placeholder="you@example.com"
              className="h-12 px-4 rounded-xl border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50"
            />
          </div>

          <div className="flex flex-col gap-2 relative">
            <div className="flex justify-between">
              <Label htmlFor="password" className="text-slate-700 dark:text-slate-300">Password</Label>
              <Link href="/forgot-password" className="text-xs text-violet-600 dark:text-violet-400 hover:underline">Forgot password?</Link>
            </div>
            <div className="relative">
              <Input 
                id="password" 
                type={showPassword ? 'text' : 'password'} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                placeholder="••••••••"
                className="h-12 px-4 pr-12 rounded-xl border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 w-full"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <Button disabled={loading} type="submit" size="lg" className="w-full h-12 bg-slate-900 dark:bg-white hover:opacity-90 text-white dark:text-slate-900 rounded-xl shadow-lg transition-all text-base font-semibold">
            {loading ? <Loader2 className="animate-spin h-5 w-5 mx-auto" /> : 'Sign In'}
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
          Don't have an account?{' '}
          <Link href="/sign-up" className="font-semibold text-violet-600 dark:text-violet-400 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </GoogleOAuthProvider>
  );
}
