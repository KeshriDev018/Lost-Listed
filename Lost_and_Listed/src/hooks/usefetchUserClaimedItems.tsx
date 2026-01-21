import { useEffect, useState, useCallback } from "react";
import { api } from "@/config/api";
import { useDispatch } from "react-redux";
import { setuserClaimedItems } from "@/redux/authSlice";

const usefetchUserClaimedItems = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //  function that can be called anytime jb humko use ho khi refetch ka
  const fetchClaimedItems = useCallback(async () => {
    dispatch(setuserClaimedItems([]));

    try {
      setLoading(true);
      const res = await api.get("/found-item/claimedByuser");

      if (res.data.success) {
        dispatch(setuserClaimedItems(res.data.data));
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
    fetchClaimedItems();
  }, [fetchClaimedItems]);

  // ✅ return refetch
  return { loading, error, fetchClaimedItems };
};

export default usefetchUserClaimedItems;
