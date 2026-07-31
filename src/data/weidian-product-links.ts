import { WEIDIAN_SHOP_URL } from "./links";

export const weidianProductLinks: Record<string, string> = {
};

export function getWeidianPurchaseUrl(productSlug: string) {
  return weidianProductLinks[productSlug] ?? WEIDIAN_SHOP_URL;
}
