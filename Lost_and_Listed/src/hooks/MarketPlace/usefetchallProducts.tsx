import { useEffect, useState, useCallback } from "react";
import { api } from "@/config/api";
import { useDispatch } from "react-redux";
import { setproducts } from "@/redux/productSlice";

const useFetchAllProducts = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ function to fetch items (can be reused for refetch)
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get("/products/get");

      if (res.data.success) {
        dispatch(setproducts(res.data.products));
      } else {
        throw new Error(res.data.message || "Failed to fetch products");
      }
    } catch (err: any) {
      console.error("Error fetching products:", err);
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  // ✅ fetch on mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    loading,
    error,
    refetchProducts: fetchProducts, // ✅ return for manual trigger
  };
};

export default useFetchAllProducts;
