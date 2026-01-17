// Type definitions for the application

export interface CategoryType {
  _id: string;
  name: string;
  image: string;
  slug: string;
}

export interface ProductType {
  _id: string;
  name: string;
  description: string;
  composition: string;
  price: number;
  image: string;
  categoryId: CategoryType | string;
  isPromotion: boolean;
  promotionPercentage: number;
  isPack: boolean;
  stock: number;
  discountedPrice?: number;
}

export interface CartItemType extends ProductType {
  quantity: number;
}

export interface OrderType {
  _id: string;
  customerName: string;
  email: string;
  address: string;
  phone: string;
  items: OrderItemType[];
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

export interface OrderItemType {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}
