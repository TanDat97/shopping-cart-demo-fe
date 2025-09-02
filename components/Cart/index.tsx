import { CartModel } from '@/models/cart';
import styles from './styles.module.scss';
import { useState } from 'react';
import { Utils } from '@/libs/utils';

interface CartProps {
  cart: CartModel;
  onRemoveItem?: (productSku: string) => void;
  onEnterPromotions?: (promotionCode: string) => void;
  onConfirmOrder?: (cart: CartModel) => void;
  loading?: boolean;
}

export default function Cart({
  cart,
  onRemoveItem,
  onEnterPromotions,
  onConfirmOrder,
  loading = false,
}: CartProps) {
  const handleConfirmOrder = () => {
    onConfirmOrder?.(cart);
  };

  const handleRemoveItem = (productSku: string) => {
    onRemoveItem?.(productSku);
  };

  // Promotion code state
  const [promotionCode, setPromotionCode] = useState('');

  const handlePromotionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (promotionCode.trim()) {
      onEnterPromotions?.(promotionCode.trim());
      setPromotionCode(''); // Clear input after submit
    }
  };

  const handlePromotionKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handlePromotionSubmit(e as any);
    }
  };

  return (
    <div className={styles.cart}>
      <div className={styles.cartHeader}>
        <h2 className={styles.cartTitle}>Your Cart</h2>
        <span className={styles.totalItems}>
          {cart.totalItems || 0} items
          {loading && <span className={styles.loadingIndicator}>⟳</span>}
        </span>
      </div>

      <div
        className={
          styles.cartBody +
          ' ' +
          (cart.items && cart.items.length > 0 ? styles.cartBody__hasItems : '')
        }
      >
        {cart.items && cart.items.length > 0 ? (
          <>
            <div className={styles.cartBodyContent}>
              {/* Cart Items */}
              <div className={styles.cartItems}>
                {cart.items.map((item, index) => (
                  <div
                    key={`${item.productSku}-${index}`}
                    className={styles.cartItem}
                  >
                    <button
                      className={styles.removeItemBtn}
                      onClick={() => handleRemoveItem(item.productSku)}
                      aria-label='Remove item from cart'
                    >
                      ×
                    </button>
                    <div className={styles.itemInfo}>
                      <h4 className={styles.productName}>{item.productName}</h4>
                      <span className={styles.productSku}>
                        SKU: {item.productSku}
                      </span>
                    </div>

                    <div className={styles.itemDetails}>
                      <div className={styles.quantityPrice}>
                        <span className={styles.quantity}>
                          Quantity: {item.quantity}
                        </span>
                        <span className={styles.price}>
                          {Utils.formatPrice(item.price)}
                        </span>
                      </div>

                      {item.discount && item.discount > 0 ? (
                        <div className={styles.discount}>
                          Discount: {Utils.formatPrice(item.discount)}
                        </div>
                      ) : null}

                      <div className={styles.totalPrice}>
                        Total:{' '}
                        {Utils.formatPrice(
                          item.totalPrice || item.price * item.quantity
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promotion Codes */}
              {cart.promotions && cart.promotions.length > 0 && (
                <div className={styles.promotions}>
                  <h3 className={styles.promotionTitle}>
                    Applied Promotions
                  </h3>
                  {cart.promotions.map((promo, index) => (
                    <div
                      key={`${promo.code}-${index}`}
                      className={styles.promotionItem}
                    >
                      <div className={styles.promotionCode}>{promo.code}</div>
                      <div className={styles.promotionDescription}>
                        {promo.description}
                      </div>
                      <div className={styles.promotionDiscount}>
                        -{Utils.formatPrice(promo.discountAmount || 0)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Summary */}
            <div className={styles.cartSummary}>
              


            {/* Promotion Code Form */}
            <div className={styles.promotionForm}>
              <form onSubmit={handlePromotionSubmit} className={styles.promotionFormContainer}>
                <input
                  type="text"
                  value={promotionCode}
                  onChange={(e) => setPromotionCode(e.target.value)}
                  onKeyPress={handlePromotionKeyPress}
                  placeholder="Enter promotion code"
                  className={styles.promotionInput}
                />
                <button
                  type="submit"
                  className={styles.promotionButton}
                  disabled={!promotionCode.trim()}
                >
                  Apply
                </button>
              </form>
            </div>

              <div className={styles.summaryRow}>
                <span>Sub Total:</span>
                <span>{Utils.formatPrice(cart.subTotalAmount || 0)}</span>
              </div>

              {cart.totalDiscount && cart.totalDiscount > 0 ? (
                <div className={styles.summaryRow}>
                  <span>Total Discount:</span>
                  <span className={styles.discountAmount}>
                    -{Utils.formatPrice(cart?.totalDiscount || 0)}
                  </span>
                </div>
              ) : null}

              <div className={styles.summaryRow + ' ' + styles.totalRow}>
                <span>Total:</span>
                <span className={styles.totalAmount}>
                  {Utils.formatPrice(cart.totalAmount || 0)}
                </span>
              </div>

              {/* Confirm Order Button */}
              <button
                className={styles.confirmOrderBtn}
                onClick={handleConfirmOrder}
                disabled={loading}
              >
                Confirm Order
              </button>
            </div>
          </>
        ) : (
          <div className={styles.emptyCart}>
            <p>Your Cart is empty</p>
          </div>
        )}
      </div>
    </div>
  );
}
