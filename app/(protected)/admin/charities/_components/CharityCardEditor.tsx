"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Loader2, Save, Trash2 } from "lucide-react";
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

interface CharityCardEditorProps {
    charity: CharityItem;
    onUpdateParams: (charity: CharityItem) => void;
    onDeactivate: (id: string) => void;
}

export function CharityCardEditor({ charity, onUpdateParams, onDeactivate }: CharityCardEditorProps) {
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeactivating, setIsDeactivating] = useState(false);
    const [draft, setDraft] = useState<CharityItem>({ ...charity });

    const handleUpdate = async () => {
        setIsUpdating(true);
        try {
            const res = await fetch(`/api/admin/charities/${charity.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(draft),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to update charity");

            toast.success("Charity updated successfully");
            onUpdateParams(draft);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Something went wrong");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDeactivate = async () => {
        setIsDeactivating(true);
        try {
            const res = await fetch(`/api/admin/charities/${charity.id}/delete`, {
                method: "PATCH",
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to deactivate charity");

            toast.success("Charity deactivated successfully");
            const updatedDraft = { ...draft, isActive: false };
            setDraft(updatedDraft);
            onDeactivate(charity.id);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Something went wrong");
        } finally {
            setIsDeactivating(false);
        }
    };

    return (
        <div className="rounded-3xl border border-border bg-card/60 backdrop-blur-md p-5 shadow-sm">
            <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                    <Label>Name</Label>
                    <Input
                        value={draft.name}
                        onChange={(e) => setDraft((prev) => ({ ...prev, name: e.target.value }))}
                        className="bg-background"
                    />
                </div>
                
                <div className="grid gap-2">
                    <Label>Category</Label>
                    <Select value={draft.category} onValueChange={(value) => setDraft(prev => ({ ...prev, category: value || "other" }))}>
                        <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover text-popover-foreground">
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
                    <Textarea
                        value={draft.shortDescription}
                        onChange={(e) => setDraft((prev) => ({ ...prev, shortDescription: e.target.value }))}
                        className="bg-background"
                    />
                </div>
                
                <div className="grid gap-2 md:col-span-2">
                    <Label>Full Description</Label>
                    <Textarea
                        value={draft.fullDescription}
                        onChange={(e) => setDraft((prev) => ({ ...prev, fullDescription: e.target.value }))}
                        className="min-h-28 bg-background"
                    />
                </div>
                
                <div className="grid gap-2">
                    <Label>Image URL</Label>
                    <Input
                        value={draft.imageUrl || ""}
                        onChange={(e) => setDraft((prev) => ({ ...prev, imageUrl: e.target.value }))}
                        className="bg-background"
                    />
                </div>
                
                <div className="grid gap-2">
                    <Label>Website URL</Label>
                    <Input
                        value={draft.websiteUrl || ""}
                        onChange={(e) => setDraft((prev) => ({ ...prev, websiteUrl: e.target.value }))}
                        className="bg-background"
                    />
                </div>
            </div>
            
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-3">
                        <Switch
                            checked={draft.featured}
                            onCheckedChange={(checked) => setDraft((prev) => ({ ...prev, featured: checked }))}
                        />
                        <span className="text-sm text-foreground">Featured</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <Switch
                            checked={draft.isActive}
                            onCheckedChange={(checked) => setDraft((prev) => ({ ...prev, isActive: checked }))}
                        />
                        <span className="text-sm text-foreground">Active</span>
                    </div>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                    <Button onClick={handleUpdate} disabled={isUpdating || isDeactivating} className="rounded-2xl bg-linear-to-r from-violet-600 to-cyan-500 text-white">
                        {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Save
                    </Button>
                    <Button onClick={handleDeactivate} disabled={isUpdating || isDeactivating} variant="destructive" className="rounded-2xl">
                        {isDeactivating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                        Deactivate
                    </Button>
                </div>
            </div>
        </div>
    );
}
