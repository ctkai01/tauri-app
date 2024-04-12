export const calculateTotalPrice = (prices: string[]): string => {
  let total = 0;

  prices.forEach((price) => {
    total += +price;
  });
  return total.toLocaleString("en-US");
};
