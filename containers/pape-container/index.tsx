'use client';

import Cart from '@/components/Cart';
import ProductList from '@/components/ProductList';
import OrderConfirmed from '@/components/OrderConfirmed';
import { useApiPost } from '@/hooks/useApi';
import { CartItemModel, CartModel } from '@/models/cart';
import { ProductModel } from '@/models/product';
import { useState, useCallback, useEffect } from 'react';
import React from 'react';
import styles from './styles.module.scss';

interface PageContainerProps {
  initialProducts: ProductModel[];
  initialCart: CartModel | null;
}

const defaultCart = {
  uuid: undefined,
  totalDiscount: 0,
  subTotalAmount: 0,
  totalAmount: 0,
  totalItems: 0,
  currency: 'VND',
  items: [],
};

export default function ProductContainer(props: PageContainerProps) {
  // Initialize products with quantityInCart = 0
  const [products, setProducts] = useState<ProductModel[]>(
    props.initialProducts.map(product => ({
      ...product,
      quantityInCart: product.quantityInCart || 0,
    }))
  );

  // Initialize cart with default value if null
  const [cart, setCart] = useState<CartModel>(props.initialCart || defaultCart);

  const {
    data: cartPreviewData,
    execute: executeCartPreview,
    loading: cartLoading,
  } = useApiPost<CartModel>('/v1/carts/preview');

  const {
    data: cartCheckoutData,
    execute: executeCartCheckout,
    loading: cartCheckoutLoading,
  } = useApiPost<CartModel>('/v1/carts/checkout');

  const handleUpdateProducts = (product: ProductModel, quantity: number) => {
    setProducts((prev: ProductModel[]) => {
      return prev.map((item: ProductModel) =>
        item.id === product.id
          ? { ...item, quantityInCart: (item.quantityInCart || 0) + quantity }
          : item
      );
    });
  };

  const handleUpdateCart = (product: ProductModel, quantity: number) => {
    setCart((prev: CartModel) => {
      let exist = false;
      let newItems = prev.items.map((item: CartItemModel) => {
        if (item.productSku === product.sku) {
          exist = true;
          return { ...item, quantity: (item.quantity || 0) + quantity };
        }
        return item;
      });
      if (!exist) {
        newItems.push({
          productSku: product.sku,
          productName: product.name,
          productImage: product.images?.mobile ?? '',
          price: product.price,
          quantity: quantity,
        });
      }
      newItems = newItems.filter((item: CartItemModel) => item.quantity > 0);
      const cart =
        newItems.length > 0 ? { ...prev, items: newItems } : defaultCart;
      return cart;
    });
  };

  const handleAddToCart = useCallback((product: ProductModel) => {
    handleUpdateProducts(product, 1);
    handleUpdateCart(product, 1);
  }, []);

  const handleRemoveFromCart = useCallback((product: ProductModel) => {
    handleUpdateProducts(product, -1);
    handleUpdateCart(product, -1);
  }, []);

  const handleRemoveItem = useCallback((productSku: string) => {
    setProducts((prev: ProductModel[]) =>
      prev.map((item: ProductModel) =>
        item.sku === productSku ? { ...item, quantityInCart: 0 } : item
      )
    );
    setCart((prev: CartModel) => {
      const newItems = prev.items.filter(
        (item: CartItemModel) => item.productSku !== productSku
      );
      return newItems.length > 0 ? { ...prev, items: newItems } : defaultCart;
    });
  }, []);

  const handleEnterPromotions = useCallback((promotionCode: string) => {
    setCart((prev: CartModel) => {
      let exist = false;
      const newPromotions =
        prev.promotionCodes?.map((promotion: string) => {
          if (promotion === promotionCode) {
            exist = true;
            return promotion;
          }
          return promotion;
        }) || [];
      if (!exist) {
        newPromotions.push(promotionCode);
      }
      return { ...prev, promotionCodes: newPromotions };
    });
  }, []);

  // Effect to call cart preview API when cart items change
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (cart.items.length > 0) {
        // Call API to update cart preview with current items
        const requestBody = {
          currency: cart.currency,
          promotionCodes: cart.promotionCodes,
          items: cart.items.map(item => ({
            productName: item.productName,
            productImage: item.productImage,
            productSku: item.productSku,
            price: item.price,
            quantity: item.quantity,
          })),
        };
        executeCartPreview(requestBody);
      }
    }, 500); // Debounce for 500ms to avoid too many API calls

    return () => clearTimeout(debounceTimer);
  }, [cart.items, cart.promotionCodes]);

  // Update cart state when API response comes back
  useEffect(() => {
    if (cartPreviewData) {
      setCart(prev => ({
        ...prev,
        ...cartPreviewData,
        promotionCodes: prev.promotionCodes,
        items: prev.items,
      }));
    }
  }, [cartPreviewData]);

  // Handle checkout success - reset cart and products only when checkout is successful
  useEffect(() => {
    if (cartCheckoutData) {
      // Reset cart to default state
      setCart(defaultCart);
      setProducts(prevProducts =>
        prevProducts.map(product => ({
          ...product,
          quantityInCart: 0,
        }))
      );

      // Set confirmed order and show confirmation
      setConfirmedOrder(cartCheckoutData);
      setIsOrderConfirmed(true);
    }
  }, [cartCheckoutData]);

  // Order confirmed state
  const [isOrderConfirmed, setIsOrderConfirmed] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<CartModel | null>(null);

  const handleConfirmOrder = useCallback((cart: CartModel) => {
    // Call checkout API only
    if (cart.items.length > 0) {
      const requestBody = {
        currency: cart.currency,
        promotionCodes: cart.promotionCodes,
        items: cart.items.map(item => ({
          productName: item.productName,
          productImage: item.productImage,
          productSku: item.productSku,
          price: item.price,
          quantity: item.quantity,
        })),
      };
      executeCartCheckout(requestBody);
    }
  }, [executeCartCheckout]);

  const handleStartNewOrder = useCallback(() => {
    // Reset order confirmed state
    setIsOrderConfirmed(false);
    setConfirmedOrder(null);
  }, []);

  return (
    <>
      <div className={styles.pageContainer}>
        <div className={styles.productSection}>
          <MemoizedProductList
            products={products}
            onAddToCart={handleAddToCart}
            onRemoveFromCart={handleRemoveFromCart}
          />
        </div>
        <div className={styles.cartSection}>
          <Cart
            cart={cart}
            onRemoveItem={handleRemoveItem}
            onEnterPromotions={handleEnterPromotions}
            onConfirmOrder={handleConfirmOrder}
            loading={cartLoading || cartCheckoutLoading}
          />
        </div>
      </div>

      {/* Order Confirmed Popup */}
      <OrderConfirmed
        isOpen={isOrderConfirmed}
        orderData={confirmedOrder || defaultCart}
        onClose={() => setIsOrderConfirmed(false)}
        onStartNewOrder={handleStartNewOrder}
      />
    </>
  );
}

// Memoize ProductList để chỉ re-render khi products thay đổi
const MemoizedProductList = React.memo(ProductList);
