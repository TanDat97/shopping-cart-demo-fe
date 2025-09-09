'use client';

import React from 'react';
import { CartModel } from '@/models/cart';
import styles from './styles.module.scss';
import { Utils } from '@/libs/utils';

interface OrderConfirmedProps {
  isOpen: boolean;
  orderData: CartModel;
  onStartNewOrder: () => void;
  onClose: () => void;
}

export default function OrderConfirmed({
  isOpen,
  onClose,
  orderData,
  onStartNewOrder,
}: OrderConfirmedProps) {
  const handleStartNewOrder = () => {
    onStartNewOrder();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.popup}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.successIcon}>
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22,4 12,14.01 9,11.01" />
            </svg>
          </div>
          <h2 className={styles.title}>Order Confirmed!</h2>
          <p className={styles.subtitle}>
            We hope you enjoy your!
          </p>
        </div>

        {/* Order Summary */}
        <div className={styles.orderSummary}>
          {/* <h3 className={styles.sectionTitle}>Order Summary</h3> */}
          
          {/* Order ID */}
          {/* <div className={styles.orderInfo}>
            <span className={styles.orderId}>
              Order ID: #{orderData.uuid || 'ORD-' + Date.now()}
            </span>
          </div> */}

          {/* Items */}
          <div className={styles.itemsList}>
            {orderData.items.map((item, index) => (
              <div key={`${item.productSku}-${index}`} className={styles.item}>
                <div className={styles.itemImage}>
                  <img src={item.productImage} alt={item.productName} />
                </div>
                <div className={styles.itemInfo}>
                  <span className={styles.itemName}>{item.productName}</span>
                  {/* <span className={styles.itemSku}>SKU: {item.productSku}</span> */}
                  <div className={styles.quantityPrice}>
                    <span className={styles.quantity}>x{item.quantity}</span>
                    <span className={styles.price}>@{Utils.formatPrice(item.price)}</span>
                  </div>
                </div>
                <div className={styles.itemDetails}>
                  <span className={styles.totalPrice}>
                    {Utils.formatPrice(item.totalPrice || item.price * item.quantity)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Promotions */}
          {orderData.promotions && orderData.promotions.length > 0 ? (
            <div className={styles.promotions}>
              <h4 className={styles.promotionTitle}>Applied Promotions</h4>
              {orderData.promotions.map((promo, index) => (
                <div key={`${promo.code}-${index}`} className={styles.promotion}>
                  <span className={styles.promoCode}>{promo.code}</span>
                  <span className={styles.promoDiscount}>
                    -{Utils.formatPrice(promo.discountAmount || 0)}
                  </span>
                </div>
              ))}
            </div>
          ) : null}

          {/* Total Summary */}
          <div className={styles.totalSummary}>
            <div className={styles.summaryRow}>
              <span>Sub Total:</span>
              <span>{Utils.formatPrice(orderData.subTotalAmount || 0)}</span>
            </div>
            
            {orderData.totalDiscount && orderData.totalDiscount > 0 ? (
              <div className={styles.summaryRow}>
                <span>Total Discount:</span>
                <span className={styles.discount}>
                  -{Utils.formatPrice(orderData.totalDiscount)}
                </span>
              </div>
            ) : null}
            
            <div className={styles.summaryRow + ' ' + styles.totalRow}>
              <span>Order Total:</span>
              <span className={styles.totalAmount}>
                {Utils.formatPrice(orderData.totalAmount || 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <button 
            className={styles.primaryBtn}
            onClick={handleStartNewOrder}
          >
            Start New Order
          </button>
        </div>
      </div>
    </div>
  );
}
