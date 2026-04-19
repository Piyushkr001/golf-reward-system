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
            <div className="rounded-3xl border border-border bg-card/60 backdrop-blur-md p-10 mt-6 text-center text-muted-foreground shadow-sm">
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
