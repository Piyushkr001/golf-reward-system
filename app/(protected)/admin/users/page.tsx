"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Trash2, 
  Loader2, 
  ShieldAlert, 
  Mail, 
  CalendarDays,
  UserCheck
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminUsersPage() {
  const [loading, setLoading] = useState(true);
  const [usersList, setUsersList] = useState<any[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (res.ok && data.success) {
        setUsersList(data.users);
      } else {
        toast.error("Failed to fetch user list.");
      }
    } catch (err) {
      toast.error("An error occurred loading the users matrix.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you explicitly certain you want to structurally delete user ${name || id}?`)) return;

    // Optimistic UI freeze for safety
    setUsersList(prev => prev.map(u => u.id === id ? { ...u, deleting: true } : u));
    
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE"
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("User successfully deleted natively.");
        setUsersList(prev => prev.filter(u => u.id !== id));
      } else {
        toast.error(data.error || "Failed to delete user target.");
        // Revert freeze
        setUsersList(prev => prev.map(u => u.id === id ? { ...u, deleting: false } : u));
      }
    } catch (err) {
      toast.error("Internal deletion parameter failed.");
      setUsersList(prev => prev.map(u => u.id === id ? { ...u, deleting: false } : u));
    }
  };

  if (loading) {
    return (
      <div className="flex h-[75vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 flex flex-col max-w-7xl mx-auto w-full">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">User Management</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Review, monitor, and structurally manage standard user boundaries.</p>
        </div>
        <div className="inline-flex items-center rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-sm font-medium text-purple-700 dark:text-purple-400 backdrop-blur-sm self-start md:self-auto">
          <ShieldAlert className="h-4 w-4 mr-2" />
          Restricted Sub-Admin Scope
        </div>
      </div>

      {/* Main Structural Grid */}
      <Card className="border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md shadow-sm relative overflow-hidden">
        {/* Decorative Administrative Glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 dark:bg-purple-500/10 pointer-events-none" />
        
        <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 relative z-10 bg-slate-50/50 dark:bg-slate-900/20">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-500" /> Platform Subscribers Tracker
          </CardTitle>
          <CardDescription>
            This list explicitly filters out administrator accounts ensuring core root bounds cannot be compromised natively.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-0 relative z-10">
          {usersList.length === 0 ? (
            <div className="py-24 text-center flex flex-col items-center justify-center opacity-70">
              <UserCheck className="h-10 w-10 text-slate-400 mb-4" />
              <p className="text-slate-600 dark:text-slate-400 font-medium">No standard users detected.</p>
              <p className="text-sm text-slate-500">Wait organically for new registrations.</p>
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-100/50 dark:bg-slate-800/30 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">Identity Identifier</th>
                    <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">Authentication Loop</th>
                    <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">Status Vector</th>
                    <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">Registration Date</th>
                    <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {usersList.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700">
                             {user.avatarUrl ? (
                               <img src={user.avatarUrl} alt="avatar" className="h-full w-full object-cover" />
                             ) : (
                               <Users className="h-5 w-5 text-slate-400" />
                             )}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white">{user.fullName || "Unconfigured"}</p>
                            <p className="text-xs text-slate-500 max-w-[150px] truncate">{user.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                          <Mail className="h-4 w-4" /> {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {user.status === "completed" ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
                            Onboarded
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50">
                            Incomplete
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4" />
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDelete(user.id, user.fullName || user.email)}
                          disabled={user.deleting}
                          className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 border-rose-200 dark:border-rose-900"
                        >
                          {user.deleting ? (
                            <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Deleting</>
                          ) : (
                            <><Trash2 className="h-4 w-4 mr-2" /> Delete</>
                          )}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
