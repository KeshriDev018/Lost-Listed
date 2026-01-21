import { api } from "@/config/api";

export const useFilterLostItems = () => {
  const filterItems = async (queryString:string) => {
    const res = await api.get(`/lost-item/filter?${queryString}`);
    return res; // only return actual items
  };

  return filterItems;
};
