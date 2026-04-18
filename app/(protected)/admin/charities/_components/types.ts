export interface CharityItem {
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
