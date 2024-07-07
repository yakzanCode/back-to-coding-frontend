export interface Product {
    _id: string;
    name: string;
    price: number;
    image: string;
    description?: string;
    salePercent?: number; 
    priceAfterSale?: number; 
    priceBeforePromotion?: number; 
    priceAfterPromotion?: number; 
    brand: string;
    category: string;
    type: string;
    createdAt?: Date;
    updatedAt?: Date;
    salesCount?: number;
    rating?: number;
    reviewsCount?: number;
    featured?: boolean;
}
