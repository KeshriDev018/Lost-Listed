import { useEffect, useState, useCallback } from "react";
import { api } from "@/config/api";
import { useDispatch } from "react-redux";
import { setactivities } from "@/redux/activitySlice";

const usefetchRecentActiivties = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const refetchRecentActiivties = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/activity/recentactivity");


      if (res.data.success) {
        dispatch(setactivities(res.data.data));
      } else {
        throw new Error(res.data.message || "Failed to fetch recent activities");
      }
    } catch (err: any) {
      console.error("Error fetching recent activities:", err);
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  // ✅ run on mount
  useEffect(() => {
    refetchRecentActiivties();
  }, [refetchRecentActiivties]);

  // ✅ return refetch
  return { loading, error, refetchRecentActiivties };
};

export default usefetchRecentActiivties;
