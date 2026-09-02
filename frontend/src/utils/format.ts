export const formatCurrency = (amount: number) => {
  return amount.toLocaleString('en-NG', {
    style: 'currency',
    currency: 'NGN',
  });
};
