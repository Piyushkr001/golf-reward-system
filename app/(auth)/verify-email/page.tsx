"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      toast.error('Missing verification token.');
      return;
    }

    axios.post('/api/auth/verify-email', { token })
      .then((res) => {
        setStatus('success');
        toast.success(res.data.message || 'Email verified successfully!');
      })
      .catch((err) => {
        setStatus('error');
        toast.error(err.response?.data?.error || 'Verification failed. The link may have expired.');
      });
  }, [token]);

  if (status === 'loading') {
    return (
      <div className="text-center py-8">
        <Loader2 className="animate-spin h-12 w-12 mx-auto text-violet-500 mb-6" />
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Verifying your email</h2>
        <p className="text-slate-500">Please wait while we confirm your account...</p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="text-center py-8">
        <CheckCircle2 className="h-16 w-16 mx-auto text-emerald-500 mb-6" />
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Email Verified!</h2>
        <p className="text-slate-500 mb-8">You can now access your account.</p>
        <Button size="lg" className="w-full bg-linear-to-r from-violet-600 to-cyan-500" onClick={() => router.push('/sign-in')}>
          Continue to Login
        </Button>
      </div>
    );
  }

  return (
    <div className="text-center py-8">
      <XCircle className="h-16 w-16 mx-auto text-red-500 mb-6" />
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Verification Failed</h2>
      <p className="text-slate-500 mb-8">Please try again or request a new link.</p>
      <Button variant="outline" size="lg" className="w-full" onClick={() => router.push('/forgot-password')}>
        Contact Support
      </Button>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="w-full max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl">
      <Suspense fallback={<div className="flex justify-center py-10"><Loader2 className="animate-spin h-8 w-8 text-violet-500" /></div>}>
        <VerifyEmailForm />
      </Suspense>
    </div>
  );
}
