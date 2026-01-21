import { useEffect, useState, useCallback } from "react";
import { api } from "@/config/api";
import { useDispatch } from "react-redux";
import { setfoundItems } from "@/redux/founditemSlice";

const useFetchAllFoundItems = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ function to fetch items (can be reused for refetch)
  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get("/found-item/get");

      if (res.data.success) {
        dispatch(setfoundItems(res.data.data));
      } else {
        throw new Error(res.data.message || "Failed to fetch items");
      }
    } catch (err: any) {
      console.error("Error fetching found items:", err);
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  // ✅ fetch on mount
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return {
    loading,
    error,
    refetchItems: fetchItems, // ✅ return for manual trigger
  };
};

export default useFetchAllFoundItems;
