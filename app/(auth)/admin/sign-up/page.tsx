"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, Loader2, ShieldAlert, Eye, EyeOff } from 'lucide-react';

export default function AdminSignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('/api/auth/register', { email, password, role: 'admin' });
      toast.success("Successfully registered as Admin!");
      router.push('/onboarding/admin');
    } catch (err: any) {
      toast.error(err.response?.data?.error || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-rose-200 dark:border-rose-900/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
      
      {/* Admin indicator strip */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-rose-500 to-orange-500" />

      <div className="text-center mb-8">
        <div className="mx-auto w-12 h-12 bg-rose-100 dark:bg-rose-500/10 rounded-full flex items-center justify-center mb-4">
          <ShieldAlert className="h-6 w-6 text-rose-600 dark:text-rose-400" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">System Admin</h1>
        <p className="text-slate-600 dark:text-slate-400">Register as a PlayLance Administrator.</p>
      </div>

      <form onSubmit={handleRegister} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 relative">
          <Label htmlFor="email" className="text-slate-700 dark:text-slate-300">Admin Email Address</Label>
          <Input 
            id="email" 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
            placeholder="admin@playlance.com"
            className="h-12 px-4 rounded-xl border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50"
          />
        </div>

        <div className="flex flex-col gap-2 relative">
          <Label htmlFor="password" className="text-slate-700 dark:text-slate-300">Secure Password</Label>
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

        <Button disabled={loading} type="submit" size="lg" className="w-full h-12 bg-linear-to-r from-rose-600 to-orange-500 hover:opacity-90 text-white rounded-xl shadow-lg shadow-rose-500/25 transition-all text-base font-semibold">
          {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Register Admin'}
          {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
        Already an admin?{' '}
        <Link href="/admin/login" className="font-semibold text-rose-600 dark:text-rose-400 hover:underline">
          Sign In Here
        </Link>
      </p>
    </div>
  );
}
