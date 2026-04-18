"use client";

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, KeyRound, Eye, EyeOff } from 'lucide-react';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    setError('');

    try {
      await axios.post('/api/auth/reset-password', { token, password });
      setSuccess(true);
      setTimeout(() => router.push('/sign-in'), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Invalid Link</h2>
        <p className="text-sm text-slate-500">This password reset link is invalid or missing a security token.</p>
        <Button className="mt-6 w-full" onClick={() => router.push('/forgot-password')}>
          Request a new link
        </Button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">Password Reset Successful!</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">You will be redirected to the login page momentarily.</p>
        <Loader2 className="animate-spin h-6 w-6 mx-auto text-emerald-500" />
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-8">
        <div className="mx-auto w-12 h-12 bg-violet-100 dark:bg-violet-500/10 rounded-full flex items-center justify-center mb-4">
          <KeyRound className="h-6 w-6 text-violet-600 dark:text-violet-400" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Create New Password</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          Please enter your new strong password below.
        </p>
      </div>

      {error && (
         <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium">
           {error}
         </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 relative">
          <Label htmlFor="password" className="text-slate-700 dark:text-slate-300">New Password</Label>
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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:text-slate-400"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2 relative">
          <Label htmlFor="confirm" className="text-slate-700 dark:text-slate-300">Confirm Password</Label>
          <Input 
            id="confirm" 
            type={showPassword ? 'text' : 'password'} 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required 
            placeholder="••••••••"
            className="h-12 px-4 rounded-xl border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50"
          />
        </div>

        <Button disabled={loading} type="submit" size="lg" className="w-full h-12 bg-linear-to-r from-violet-600 to-cyan-500 hover:opacity-90 text-white rounded-xl shadow-lg transition-all text-base font-semibold">
          {loading ? <Loader2 className="animate-spin h-5 w-5 mx-auto" /> : 'Reset Password'}
        </Button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="w-full max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl">
      <Suspense fallback={<div className="flex justify-center py-10"><Loader2 className="animate-spin h-8 w-8 text-violet-500" /></div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
