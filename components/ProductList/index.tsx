import { ProductModel } from '@/models/product';
import Product from '../Product';
import styles from './styles.module.scss';

interface ProductListProps {
  products: ProductModel[];
  onAddToCart?: (product: ProductModel) => void;
  onRemoveFromCart?: (product: ProductModel) => void;
}

export default function ProductList({
  products,
  onAddToCart,
  onRemoveFromCart,
}: ProductListProps) {
  return (
    <>
      <div className={styles.productListTitle}>Desserts</div>
      <div className={styles.productList}>
        {products.map(product => (
          <Product
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            onRemoveFromCart={onRemoveFromCart}
          />
        ))}
      </div>
    </>
  );
}
