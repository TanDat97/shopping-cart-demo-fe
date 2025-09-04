import { ProductModel } from '@/models/product';
import styles from './styles.module.scss';
import Image from 'next/image';
import { Utils } from '@/libs/utils';

interface ProductProps {
  product: ProductModel;
  onAddToCart?: (product: ProductModel) => void;
  onRemoveFromCart?: (product: ProductModel) => void;
}

export default function Product({
  product,
  onAddToCart,
  onRemoveFromCart,
}: ProductProps) {
  const handleAddToCart = () => {
    onAddToCart?.(product);
  };

  const handleRemoveFromCart = () => {
    onRemoveFromCart?.(product);
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
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
        />
      </div>

      <div className={styles.productQuantity}>
        {product.quantityInCart ? (
          <div className={styles.quantityControls}>
            <button
              className={styles.quantityBtn}
              onClick={handleRemoveFromCart}
              aria-label='Remove from cart'
            >
              -
            </button>
            <span className={styles.quantity}>{product.quantityInCart}</span>
            <button
              className={styles.quantityBtn}
              onClick={handleAddToCart}
              aria-label='Add to cart'
            >
              +
            </button>
          </div>
        ) : (
          <button className={styles.addToCartBtn} onClick={handleAddToCart}>
            <svg
              width='20'
              height='20'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
            >
              <path d='M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L5 3H2m5 10v6a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-6m-9 3h2m2 0h2' />
            </svg>{' '}
            <span>Add to cart</span>
          </button>
        )}
      </div>

      <div className={styles.productInfo}>
        <div className={styles.category}>
          <span className={styles.category}>{product.category}</span>
        </div>
        <div className={styles.productHeader}>
          <h3 className={styles.productName}>{product.name}</h3>
        </div>

        {/* <p className={styles.description}>{product.description}</p> */}

        <div className={styles.productFooter}>
          <div className={styles.priceContainer}>
            <span className={styles.price}>
              {Utils.formatPrice(product.price)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
