import { useEffect, useState, useCallback } from "react";
import { api } from "@/config/api";
import { useDispatch } from "react-redux";
import { setLostItems } from "@/redux/lostitemSlice";

const useFetchAllLostItems = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ function that can be called anytime
  const refetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/lost-item/get");

      console.log("Fetched lost items:", res.data);

      if (res.data.success) {
        dispatch(setLostItems(res.data.data));
      } else {
        throw new Error(res.data.message || "Failed to fetch items");
      }
    } catch (err: any) {
      console.error("Error fetching lost items:", err);
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  // ✅ run on mount
  useEffect(() => {
    refetchItems();
  }, [refetchItems]);

  // ✅ return refetch
  return { loading, error, refetchItems };
};

export default useFetchAllLostItems;
