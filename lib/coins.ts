/**
 * Determine how many coins a user receives for a given USD amount.
 * Exchange rate base: 1 USD = 100 coins
 * Includes four fixed purchase tiers.
 */
export function determineCoinsForAmount(amountUSD: number): number {
  if (!amountUSD || amountUSD <= 0) return 0;

  // Match the exact product tiers
  if (amountUSD >= 99.99) return 11000;
  if (amountUSD >= 49.99) return 5100;
  if (amountUSD >= 29.99) return 3000;
  if (amountUSD >= 9.99) return 1000;

  // Fallback for non-tier amounts (rare case)
  return Math.floor(amountUSD * 100);
}
