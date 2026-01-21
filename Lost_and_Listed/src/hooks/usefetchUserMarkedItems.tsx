import { useEffect, useState, useCallback } from "react";
import { api } from "@/config/api";
import { useDispatch } from "react-redux";
import { setuserMarkedfoundItems } from "@/redux/authSlice";

const usefetchUserMarkedItems = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //  function that can be called anytime jb humko use ho khi refetch ka
  const fetchMarkedItems = useCallback(async () => {
    dispatch(setuserMarkedfoundItems([]));
    try {
      setLoading(true);
      const res = await api.get("/lost-item/foundByuser", {
        withCredentials: true,
      });

      if (res.data.success) {
        
        dispatch(setuserMarkedfoundItems(res.data.data));
      } else {
        throw new Error(res.data.message || "Failed to fetch items");
      }
    } catch (err: any) {
      console.error("Error fetching userMarkedfound items:", err);
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  // ✅ run on mount
  useEffect(() => {
    fetchMarkedItems()
  }, [fetchMarkedItems]);

  // ✅ return refetch
  return { loading, error, fetchMarkedItems };
};

export default usefetchUserMarkedItems;
