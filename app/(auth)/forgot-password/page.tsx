"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Loader2, Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await axios.post('/api/auth/forgot-password', { email });
      toast.success("Password reset email sent!");
      setSuccess(true);
    } catch (err: any) {
      toast.error(err.response?.data?.error || err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl relative">
      <Link href="/sign-in" className="absolute top-8 left-8 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
        <ArrowLeft className="h-5 w-5" />
      </Link>

      <div className="text-center mb-8 mt-2">
        <div className="mx-auto w-12 h-12 bg-violet-100 dark:bg-violet-500/10 rounded-full flex items-center justify-center mb-4">
          <Mail className="h-6 w-6 text-violet-600 dark:text-violet-400" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Forgot Password</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm px-4">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      {success ? (
        <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 p-6 rounded-xl text-center">
          <h3 className="text-emerald-700 dark:text-emerald-400 font-semibold mb-2">Check your inbox</h3>
          <p className="text-sm text-emerald-600 dark:text-emerald-500/80 mb-6">
            We've sent password reset instructions to <strong>{email}</strong>
          </p>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => window.location.href = '/sign-in'}
          >
            Return to Sign In
          </Button>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
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

            <Button disabled={loading} type="submit" size="lg" className="w-full h-12 bg-linear-to-r from-violet-600 to-cyan-500 hover:opacity-90 text-white rounded-xl shadow-lg transition-all text-base font-semibold">
              {loading ? <Loader2 className="animate-spin h-5 w-5 mx-auto" /> : 'Send Reset Link'}
            </Button>
          </form>
        </>
      )}
    </div>
  );
}
