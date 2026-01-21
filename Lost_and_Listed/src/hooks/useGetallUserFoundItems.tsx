import { useEffect, useState } from "react";
import { api } from "@/config/api";
import { useDispatch } from "react-redux";
import {setuserfoundItems} from "@/redux/founditemSlice"

const useGetallUserFoundItems = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchItems = async () => {
    try {
      const res = await api.get("/found-item/user");

      if (res.data.success) {
        dispatch(setuserfoundItems(res.data.data));
      } else {
        throw new Error(res.data.message || "Failed to fetch items");
      }
    } catch (err) {
      console.error("Error fetching lost items:", err);
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // fetch on mount
  useEffect(() => {
    fetchItems();
  }, []);

  return { loading, error, refetchFoundItems: fetchItems };
};

export default useGetallUserFoundItems;
