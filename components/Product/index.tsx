import { ProductModel } from "@/models/product";
import styles from "./styles.module.scss";
import Image from "next/image";

interface ProductProps {
  product: ProductModel;
  onAddToCart?: (product: ProductModel) => void;
  onRemoveFromCart?: (product: ProductModel) => void;
}

export default function Product({ product, onAddToCart, onRemoveFromCart }: ProductProps) {
  const handleAddToCart = () => {
    onAddToCart?.(product);
  };

  const handleRemoveFromCart = () => {
    onRemoveFromCart?.(product);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <div className={styles.productCard}>
      <div className={styles.imageContainer}>
        <Image
          src={product.images.desktop}
          alt={product.name}
          width={300}
          height={200}
          className={styles.productImage}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
      </div>
      
      <div className={styles.productInfo}>
        <div className={styles.productHeader}>
          <h3 className={styles.productName}>{product.name}</h3>
          <span className={styles.sku}>SKU: {product.sku}</span>
        </div>
        
        <p className={styles.description}>{product.description}</p>
        
        <div className={styles.productFooter}>
          <div className={styles.priceContainer}>
            <span className={styles.price}>{formatPrice(product.price)}</span>
          </div>
          
          {product.quantityInCart ? (
            <div className={styles.quantityControls}>
              <button 
                className={styles.quantityBtn}
                onClick={handleRemoveFromCart}
                aria-label="Remove from cart"
              >
                -
              </button>
              <span className={styles.quantity}>{product.quantityInCart}</span>
              <button 
                className={styles.quantityBtn}
                onClick={handleAddToCart}
                aria-label="Add to cart"
              >
                +
              </button>
            </div>
          ) : (
            <button 
              className={styles.addToCartBtn}
              onClick={handleAddToCart}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L5 3H2m5 10v6a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-6m-9 3h2m2 0h2" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}