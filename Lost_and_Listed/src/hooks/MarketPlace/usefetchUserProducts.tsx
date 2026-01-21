import { useEffect, useState, useCallback } from "react";
import { api } from "@/config/api";
import { useDispatch } from "react-redux";
import { setuserProducts } from "@/redux/productSlice";

const useFetchAllUserProducts = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ function to fetch items (can be reused for refetch)
  const fetchUserProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get("/products/user");

      if (res.data.success) {
        dispatch(setuserProducts(res.data.products));
      } else {
        throw new Error(res.data.message || "Failed to fetch user products");
      }
    } catch (err: any) {
      console.error("Error fetching user products:", err);
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  // ✅ fetch on mount
  useEffect(() => {
    fetchUserProducts();
  }, [fetchUserProducts]);

  return {
    loading,
    error,
    refetchUserProducts: fetchUserProducts, // ✅ return for manual trigger
  };
};

export default useFetchAllUserProducts;
