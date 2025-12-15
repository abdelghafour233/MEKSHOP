export enum Category {
  ELECTRONICS = 'electronics',
  HOME = 'home',
  CARS = 'cars',
}

export interface Product {
  id: string;
  title: string;
  price: number;
  oldPrice?: number;
  category: Category;
  description: string;
  features: string[];
  imageUrl: string;
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