import { Shop } from "@/lib/api/types";
import { get } from "@/lib/api/requests";

export const getShop = async (): Promise<Shop> => {
  const response = await get("/shops/get-shop");

  const shop = response;
  console.log('shop Response', shop);
  return shop;
};