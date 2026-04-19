"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Mail, ShieldCheck, HeartPulse, Loader2, Save, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";

export default function UserProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/dashboard/profile");
      const data = await res.json();
      if (res.ok && data.success) {
        setProfile(data.profile);
      } else {
        toast.error("Failed to load profile.");
      }
    } catch (err) {
      toast.error("An error occurred loading profile metadata.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/dashboard/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: profile.fullName,
          avatarUrl: profile.avatarUrl
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Profile saved successfully.");
      } else {
        toast.error(data.error || "Failed to update profile.");
      }
    } catch (err) {
      toast.error("Internal process failed updating profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[75vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 flex flex-col max-w-6xl mx-auto w-full">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Profile Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your platform identity and account preferences.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col - Global Identity Card */}
        <div className="lg:col-span-1 space-y-8">
          <Card className="border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm overflow-hidden">
            {/* Soft background header */}
            <div className="h-24 w-full bg-linear-to-r from-cyan-500 to-blue-500 opacity-90 relative">
               <div className="absolute inset-0 bg-white/10 mix-blend-overlay dark:bg-black/10" />
            </div>
            
            <CardContent className="pt-0 relative px-6 pb-6">
              <div className="flex justify-center -mt-12 mb-4">
                <div className="h-24 w-24 rounded-full border-4 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden shadow-lg shadow-cyan-500/20">
                  {profile?.avatarUrl ? (
                    <img src={profile.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-10 w-10 text-slate-400" />
                  )}
                </div>
              </div>

              <div className="text-center space-y-1">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{profile?.fullName || "Verified User"}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium inline-flex items-center justify-center gap-1">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" /> Authenticated Subscriber
                </p>
              </div>

              <div className="mt-8 space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <Mail className="h-4 w-4" /> Email Access
                  </span>
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate pl-4">
                    {profile?.email}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <HeartPulse className="h-4 w-4" /> Charity Match
                  </span>
                  <span className="text-sm font-medium text-cyan-600 dark:text-cyan-400">
                    {profile?.contributionPercentage}% Rate
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Col - Settings Form */}
        <div className="lg:col-span-2">
          <Card className="border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md shadow-sm relative overflow-hidden">
            {/* Glow backing */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 dark:bg-cyan-500/10 pointer-events-none" />
            
            <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 relative z-10 bg-slate-50/50 dark:bg-slate-900/20">
              <CardTitle>Personal Details</CardTitle>
              <CardDescription>Review and modify your identity descriptors explicitly handling your draw appearances.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 relative z-10">
              <form onSubmit={handleSave} className="space-y-6">
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="fullName" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Display Name
                    </label>
                    <Input 
                      id="fullName"
                      name="fullName"
                      placeholder="Enter your full name"
                      value={profile?.fullName || ""}
                      onChange={handleChange}
                      className="max-w-md bg-white dark:bg-slate-950/80 border-slate-200 dark:border-slate-800 focus-visible:ring-cyan-500"
                      required
                    />
                    <p className="text-xs text-slate-500">This moniker will visibly appear on global leaderboards mapping scoring bounds.</p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="avatarUrl" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Avatar URL
                    </label>
                    <div className="flex w-full max-w-md items-center space-x-2">
                      <Input 
                        id="avatarUrl"
                        name="avatarUrl"
                        type="url"
                        placeholder="https://example.com/avatar.jpg"
                        value={profile?.avatarUrl || ""}
                        onChange={handleChange}
                        className="flex-1 bg-white dark:bg-slate-950/80 border-slate-200 dark:border-slate-800 focus-visible:ring-cyan-500"
                      />
                    </div>
                    <p className="text-xs text-slate-500">Link explicitly to a securely hosted image structure to update your visual card.</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                  <Button 
                    type="submit" 
                    disabled={saving}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg px-8 shadow-md shadow-cyan-500/20 transition-all font-semibold"
                  >
                    {saving ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving parameters...</>
                    ) : (
                      <><Save className="mr-2 h-4 w-4" /> Save Profile</>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
