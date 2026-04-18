"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Loader2, PlusCircle, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { CharityItem } from "./types";

interface CharityCreateFormProps {
    onCreated: (charity: CharityItem) => void;
}

export function CharityCreateForm({ onCreated }: CharityCreateFormProps) {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: "",
        shortDescription: "",
        fullDescription: "",
        imageUrl: "",
        websiteUrl: "",
        category: "other",
        featured: false,
        isActive: true,
        displayOrder: 0,
    });

    const handleCreate = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/charities", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to create charity");

            toast.success("Charity created successfully");
            if (data.charity) {
                onCreated(data.charity);
            }
            
            setForm({
                name: "",
                shortDescription: "",
                fullDescription: "",
                imageUrl: "",
                websiteUrl: "",
                category: "other",
                featured: false,
                isActive: true,
                displayOrder: 0,
            });
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6">
            <div className="mb-6 flex items-center gap-3">
                <PlusCircle className="h-5 w-5 text-cyan-300" />
                <h2 className="text-xl font-semibold text-white">Create New Charity</h2>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                    <Label>Name</Label>
                    <Input value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} className="border-white/10 bg-slate-950/70 text-white" />
                </div>
                
                <div className="grid gap-2">
                    <Label>Category</Label>
                    <Select value={form.category} onValueChange={(value) => setForm(prev => ({ ...prev, category: value || "other" }))}>
                        <SelectTrigger className="border-white/10 bg-slate-950/70 text-white">
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-white/10 text-white">
                            <SelectItem value="education">Education</SelectItem>
                            <SelectItem value="sports">Sports</SelectItem>
                            <SelectItem value="health">Health</SelectItem>
                            <SelectItem value="environment">Environment</SelectItem>
                            <SelectItem value="community">Community</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                
                <div className="grid gap-2 md:col-span-2">
                    <Label>Short Description</Label>
                    <Textarea value={form.shortDescription} onChange={(e) => setForm((prev) => ({ ...prev, shortDescription: e.target.value }))} className="border-white/10 bg-slate-950/70 text-white" />
                </div>

                <div className="grid gap-2 md:col-span-2">
                    <Label>Full Description</Label>
                    <Textarea value={form.fullDescription} onChange={(e) => setForm((prev) => ({ ...prev, fullDescription: e.target.value }))} className="min-h-32 border-white/10 bg-slate-950/70 text-white" />
                </div>
                
                <div className="grid gap-2">
                    <Label>Image URL</Label>
                    <Input value={form.imageUrl} onChange={(e) => setForm((prev) => ({ ...prev, imageUrl: e.target.value }))} className="border-white/10 bg-slate-950/70 text-white" />
                </div>
                
                <div className="grid gap-2">
                    <Label>Website URL</Label>
                    <Input value={form.websiteUrl} onChange={(e) => setForm((prev) => ({ ...prev, websiteUrl: e.target.value }))} className="border-white/10 bg-slate-950/70 text-white" />
                </div>
                
                <div className="grid gap-2">
                    <Label>Display Order</Label>
                    <Input type="number" value={form.displayOrder} onChange={(e) => setForm((prev) => ({ ...prev, displayOrder: Number(e.target.value) }))} className="border-white/10 bg-slate-950/70 text-white" />
                </div>
                
                <div className="flex items-center gap-8 pt-7">
                    <div className="flex items-center gap-3">
                        <Switch checked={form.featured} onCheckedChange={(checked) => setForm((prev) => ({ ...prev, featured: checked }))} />
                        <span className="text-sm text-slate-200">Featured</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Switch checked={form.isActive} onCheckedChange={(checked) => setForm((prev) => ({ ...prev, isActive: checked }))} />
                        <span className="text-sm text-slate-200">Active</span>
                    </div>
                </div>
            </div>
            
            <div className="mt-6 flex justify-end">
                <Button onClick={handleCreate} disabled={loading} className="rounded-2xl bg-linear-to-r from-violet-600 to-cyan-500 text-white">
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Create Charity
                </Button>
            </div>
        </div>
    );
}
