export const WEIDIAN_SHOP_URL = "https://weidian.com/?userid=1663319819&spider_token=bd76";
export const MAISONLOOKS_URL = "https://streetstyle.maisonlooks.com/";

export function getMaisonLooksSearchUrl(title: string) {
  return `${MAISONLOOKS_URL}en/search?q=${encodeURIComponent(title)}`;
}
