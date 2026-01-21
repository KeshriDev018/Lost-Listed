import { api } from "@/config/api";

export const useFilterFoundItems = () => {
  const filterItems = async (queryString: string) => {
    const res = await api.get(`/found-item/filter?${queryString}`);
    return res; // only return actual items
  };

  return filterItems;
};
