export class Utils {
  static formatPrice(price: number) {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(price);
  }
}
