"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Mail, 
  MapPin, 
  PhoneCall, 
  Send,
  Loader2,
  MessageSquareHeart
} from "lucide-react";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Message sent successfully! We will get back to you soon.");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        toast.error(data.error || "Failed to send message.");
      }
    } catch (error) {
      toast.error("An error occurred while sending your message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* 
        Hero Section 
      */}
      <section className="relative overflow-hidden pt-24 pb-16 flex flex-col items-center justify-center text-center px-4">
        {/* Dynamic Gradient Background utilizing Tailwind v4 syntax */}
        <div className="absolute inset-0 bg-linear-to-b from-rose-50 via-white to-transparent dark:from-rose-950/20 dark:via-background dark:to-transparent -z-10" />
        
        {/* Subtle background glow effect */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 bg-rose-400/20 dark:bg-rose-600/10 blur-[120px] rounded-full -z-10" />

        <div className="max-w-3xl space-y-6 flex flex-col items-center z-10">
          <div className="inline-flex items-center rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-sm font-medium text-rose-700 dark:text-rose-400 backdrop-blur-sm">
            <MessageSquareHeart className="h-4 w-4 mr-2 text-rose-500" />
            We're Here to Help
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
            Get in <span className="text-transparent bg-clip-text bg-linear-to-r from-rose-500 to-orange-500">Touch.</span>
          </h1>
          
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
            Have questions about charitable integrations, payout processes, or score validation rules? Our team is standing by to support you natively.
          </p>
        </div>
      </section>

      {/* Main Content Layout using Flex/Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 flex-1 flex flex-col items-center">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-8">
          
          {/* Contact Information (Left Pane) */}
          <div className="lg:col-span-2 space-y-8 lg:pr-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Contact Information
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Reach out to us through any of our channels. We aim to respond to all technical and billing inquiries within 24 hours.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start">
                <div className="shrink-0 mt-1">
                  <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
                    <Mail className="h-5 w-5" />
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-base font-semibold text-slate-900 dark:text-white">Email Support</h4>
                  <p className="mt-1 text-slate-600 dark:text-slate-400">support@playlance.com</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="shrink-0 mt-1">
                  <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400">
                    <MapPin className="h-5 w-5" />
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-base font-semibold text-slate-900 dark:text-white">Headquarters</h4>
                  <p className="mt-1 text-slate-600 dark:text-slate-400">123 PlayLance Foundation Center<br/>Silicon Valley, CA 94025</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="shrink-0 mt-1">
                  <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400">
                    <PhoneCall className="h-5 w-5" />
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-base font-semibold text-slate-900 dark:text-white">Response Time</h4>
                  <p className="mt-1 text-slate-600 dark:text-slate-400">Monday - Friday<br/>9:00 AM - 5:00 PM PST</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form (Right Pane) */}
          <div className="lg:col-span-3">
            <Card className="border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 backdrop-blur-md shadow-xl overflow-hidden relative">
              {/* Form Decorative Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
              
              <CardContent className="p-8 lg:p-10 relative z-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                     <div className="space-y-2">
                       <label htmlFor="name" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                         Full Name
                       </label>
                       <Input 
                         id="name"
                         name="name"
                         placeholder="John Doe"
                         value={formData.name}
                         onChange={handleChange}
                         required
                         className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus-visible:ring-rose-500"
                       />
                     </div>
                     <div className="space-y-2">
                       <label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                         Email Address
                       </label>
                       <Input 
                         id="email"
                         name="email"
                         type="email"
                         placeholder="john@example.com"
                         value={formData.email}
                         onChange={handleChange}
                         required
                         className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus-visible:ring-rose-500"
                       />
                     </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Subject
                    </label>
                    <Input 
                      id="subject"
                      name="subject"
                      placeholder="How can we help you?"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus-visible:ring-rose-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Your Message
                    </label>
                    <Textarea 
                      id="message"
                      name="message"
                      placeholder="Please explicitly describe your issue or inquiry..."
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus-visible:ring-rose-500 resize-none"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-rose-600 hover:bg-rose-700 text-white rounded-lg h-12 text-base font-semibold shadow-lg shadow-rose-500/20 transition-all"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Routing Safely...
                      </>
                    ) : (
                      <>
                        Send Protocol Message
                        <Send className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

        </div>
      </section>
    </div>
  );
}
