export enum Category {
  ELECTRONICS = 'electronics',
  HOME = 'home',
  CARS = 'cars',
}

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
  notes?: string; // ملاحظات الإدارة
}