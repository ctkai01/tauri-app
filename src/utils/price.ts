export const calculateTotalPrice = (prices: string[]): number => {
  let total = 0;

  prices.forEach((price) => {
    total += +price;
  });
  return total;
};
