import { CharityItem } from "./types";
import { CharityCardEditor } from "./CharityCardEditor";

interface CharityListProps {
    charities: CharityItem[];
    onUpdateCharity: (updated: CharityItem) => void;
    onDeactivateCharity: (id: string) => void;
}

export function CharityList({ charities, onUpdateCharity, onDeactivateCharity }: CharityListProps) {
    if (!charities || charities.length === 0) {
        return (
            <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-10 mt-6 text-center text-slate-400">
                <p>No charities found. Start by creating a new one above!</p>
            </div>
        );
    }
    
    return (
        <div className="grid gap-6 mt-6">
            {charities.map((charity) => (
                <CharityCardEditor 
                    key={charity.id} 
                    charity={charity} 
                    onUpdateParams={onUpdateCharity} 
                    onDeactivate={onDeactivateCharity} 
                />
            ))}
        </div>
    );
}
