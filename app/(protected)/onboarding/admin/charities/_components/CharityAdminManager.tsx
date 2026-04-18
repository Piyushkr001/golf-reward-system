"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Loader2, PlusCircle, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface CharityItem {
    id: string;
    name: string;
    slug: string;
    shortDescription: string;
    fullDescription: string;
    imageUrl: string | null;
    websiteUrl: string | null;
    category: string;
    featured: boolean;
    isActive: boolean;
    displayOrder: number;
}

export function CharityAdminManager({ initialCharities }: { initialCharities: CharityItem[] }) {
    const [charities, setCharities] = useState(initialCharities);
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

    const refreshCharities = async () => {
        const res = await fetch("/api/charities");
        const data = await res.json();
        if (data?.charities) {
            // public endpoint only returns active charities, so keep current state for simple flow
        }
    };

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
            window.location.reload();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (charity: CharityItem) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/charities/${charity.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(charity),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to update charity");

            toast.success("Charity updated successfully");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleDeactivate = async (id: string) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/charities/${id}/delete`, {
                method: "PATCH",
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to deactivate charity");

            toast.success("Charity deactivated successfully");
            setCharities((prev) => prev.map((item) => (item.id === id ? { ...item, isActive: false } : item)));
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-10">
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
                        <Input value={form.category} onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))} className="border-white/10 bg-slate-950/70 text-white" />
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

                    <div className="grid gap-6">
                        {charities.map((charity) => (
                            <div key={charity.id} className="rounded-3xl border border-white/10 bg-slate-900/60 p-5">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label>Name</Label>
                                        <Input
                                            value={charity.name}
                                            onChange={(e) =>
                                                setCharities((prev) => prev.map((item) => (item.id === charity.id ? { ...item, name: e.target.value } : item)))
                                            }
                                            className="border-white/10 bg-slate-950/70 text-white"
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label>Category</Label>
                                        <Input
                                            value={charity.category}
                                            onChange={(e) =>
                                                setCharities((prev) => prev.map((item) => (item.id === charity.id ? { ...item, category: e.target.value } : item)))
                                            }
                                            className="border-white/10 bg-slate-950/70 text-white"
                                        />
                                    </div>

                                    <div className="grid gap-2 md:col-span-2">
                                        <Label>Short Description</Label>
                                        <Textarea
                                            value={charity.shortDescription}
                                            onChange={(e) =>
                                                setCharities((prev) => prev.map((item) => (item.id === charity.id ? { ...item, shortDescription: e.target.value } : item)))
                                            }
                                            className="border-white/10 bg-slate-950/70 text-white"
                                        />
                                    </div>

                                    <div className="grid gap-2 md:col-span-2">
                                        <Label>Full Description</Label>
                                        <Textarea
                                            value={charity.fullDescription}
                                            onChange={(e) =>
                                                setCharities((prev) => prev.map((item) => (item.id === charity.id ? { ...item, fullDescription: e.target.value } : item)))
                                            }
                                            className="min-h-28 border-white/10 bg-slate-950/70 text-white"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Image URL</Label>
                                        <Input
                                            value={charity.imageUrl || ""}
                                            onChange={(e) =>
                                                setCharities((prev) => prev.map((item) => (item.id === charity.id ? { ...item, imageUrl: e.target.value } : item)))
                                            }
                                            className="border-white/10 bg-slate-950/70 text-white"
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label>Website URL</Label>
                                        <Input
                                            value={charity.websiteUrl || ""}
                                            onChange={(e) =>
                                                setCharities((prev) => prev.map((item) => (item.id === charity.id ? { ...item, websiteUrl: e.target.value } : item)))
                                            }
                                            className="border-white/10 bg-slate-950/70 text-white"
                                        />
                                    </div>
                                </div>
                                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex flex-wrap items-center gap-6">
                                        <div className="flex items-center gap-3">
                                            <Switch
                                                checked={charity.featured}
                                                onCheckedChange={(checked) =>
                                                    setCharities((prev) => prev.map((item) => (item.id === charity.id ? { ...item, featured: checked } : item)))
                                                }
                                            />
                                            <span className="text-sm text-slate-200">Featured</span>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <Switch
                                                checked={charity.isActive}
                                                onCheckedChange={(checked) =>
                                                    setCharities((prev) => prev.map((item) => (item.id === charity.id ? { ...item, isActive: checked } : item)))
                                                }
                                            />
                                            <span className="text-sm text-slate-200">Active</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-3 sm:flex-row">
                                        <Button onClick={() => handleUpdate(charity)} disabled={loading} className="rounded-2xl bg-linear-to-r from-violet-600 to-cyan-500 text-white">
                                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                            Save
                                        </Button>
                                        <Button onClick={() => handleDeactivate(charity.id)} disabled={loading} variant="destructive" className="rounded-2xl">
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Deactivate
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}