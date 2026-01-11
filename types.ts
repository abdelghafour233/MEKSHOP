
export enum Category {
  ELECTRONICS = 'electronics',
  CAR_ACCESSORIES = 'car_accessories',
  GLASSES = 'glasses',
  OTHER = 'other',
}

export const CATEGORY_LABELS: Record<Category, string> = {
  [Category.ELECTRONICS]: 'إلكترونيات',
  [Category.CAR_ACCESSORIES]: 'إكسسوارات سيارات',
  [Category.GLASSES]: 'نظارات ذكية',
  [Category.OTHER]: 'أخرى',
};

export type OrderStatus = 'Pending' | 'Confirmed' | 'Shipped' | 'Cancelled';

export interface Product {
  id: string;
  title: string;
  price: number;
  oldPrice?: number;
  category: Category;
  description: string;
  features: string[];
  imageUrl: string;
  additionalImages: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface OrderForm {
  fullName: string;
  city: string;
  phone: string;
  address?: string;
}

export interface Order {
  id: string;
  date: string;
  customer: OrderForm;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  notes?: string;
}
