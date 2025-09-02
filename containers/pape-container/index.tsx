'use client';

import Cart from '@/components/Cart';
import ProductList from '@/components/ProductList';
import { useApiGet } from '@/hooks/useApi';
import { ProductModel } from '@/models/product';
import { useState, useCallback } from 'react';
import React from 'react';

interface PageContainerProps {
  initialProducts: ProductModel[];
  initialCart: any;
}

export default function ProductContainer(props: PageContainerProps) {
  const [products, setProducts] = useState<ProductModel[]>(
    props.initialProducts
  );
  const [cart, setCart] = useState<any>(props.initialCart);

  const { data: refreshedProducts, execute: refetchProducts } = useApiGet<{
    items: ProductModel[];
  }>('/v1/products');

  // Memoize callback functions để tránh re-create mỗi render
  const handleAddToCart = useCallback((product: ProductModel) => {
    setProducts((prev: ProductModel[]) =>
      prev.map((item: ProductModel) =>
        item.id === product.id
          ? { ...item, quantityInCart: (item.quantityInCart || 0) + 1 }
          : item
      )
    );
  }, []);

  const handleRemoveFromCart = useCallback((product: ProductModel) => {
    setProducts((prev: ProductModel[]) =>
      prev.map((item: ProductModel) =>
        item.id === product.id
          ? {
              ...item,
              quantityInCart: Math.max((item.quantityInCart || 0) - 1, 0),
            }
          : item
      )
    );
  }, []);

  return (
    <div className='page-container'>
      <MemoizedProductList
        products={products}
        onAddToCart={handleAddToCart}
        onRemoveFromCart={handleRemoveFromCart}
      />
      <Cart />
    </div>
  );
}

// Memoize ProductList để chỉ re-render khi products thay đổi
const MemoizedProductList = React.memo(ProductList);
