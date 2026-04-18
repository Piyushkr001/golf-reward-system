"use client";

import { useState } from "react";
import { CharityItem } from "./types";
import { CharityCreateForm } from "./CharityCreateForm";
import { CharityList } from "./CharityList";

export function CharityAdminManager({ initialCharities }: { initialCharities: CharityItem[] }) {
    const [charities, setCharities] = useState(initialCharities);

    // Sync child component mutations with top-level state
    const handleCharityCreated = (newCharity: CharityItem) => {
        setCharities((prev) => [newCharity, ...prev]);
    };

    const handleCharityUpdated = (updatedCharity: CharityItem) => {
        setCharities((prev) => prev.map((item) => (item.id === updatedCharity.id ? updatedCharity : item)));
    };

    const handleCharityDeactivated = (id: string) => {
        setCharities((prev) => prev.map((item) => (item.id === id ? { ...item, isActive: false } : item)));
    };

    return (
        <div className="flex flex-col gap-10">
            <CharityCreateForm onCreated={handleCharityCreated} />
            <CharityList 
                charities={charities} 
                onUpdateCharity={handleCharityUpdated} 
                onDeactivateCharity={handleCharityDeactivated} 
            />
        </div>
    );
}