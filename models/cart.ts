export interface CartModel {
  uuid: string;
  totalDiscount?: number;
  subTotalAmount?: number;
  totalAmount?: number;
  totalItems?: number;
  currency?: string;
  items: CartItemModel[];
  promotionCodes?: string[];
  promotions?: PromotionModel[];
}

export interface CartItemModel {
  productSku: string;
  productName: string;
  productImage?: string;
  price: number;
  totalPrice?: number;
  quantity: number;
  discount?: number;
  note?: string
}

export interface PromotionModel {
  code: string;
  type: string;
  discountAmount?: number;
  description?: string;
  appliedToItems: string[];
}