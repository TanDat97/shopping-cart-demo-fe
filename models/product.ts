export interface ProductModel {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  description: string;
  images: {
    mobile: string;
    tablet: string;
    desktop: string;
    thumbnail: string;
  };
  quantityInCart?: number;
}
