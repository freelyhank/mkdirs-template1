import { SHOW_QUERY_LOGS } from "@/lib/constants";
import { type Order, User } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";

export const getOrderByUserIdAndItemId = async (
  userId: string,
  itemId: string,
) => {
  try {
    // @sanity-typegen-ignore
    const orderQry = `*[_type == "order" && user._ref == "${userId}" && item._ref == "${itemId}"][0]`;
    const order = await sanityFetch<Order>({
      query: orderQry,
      disableCache: true,
    });
    if (SHOW_QUERY_LOGS) {
      console.log("getOrderByUserIdAndItemId, order:", order);
    }
    return order;
  } catch (error) {
    console.error("getOrderByUserIdAndItemId, error:", error);
    return null;
  }
};
