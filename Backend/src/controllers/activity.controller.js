import { Activity } from "../models/activity.model.js";


export const getRecentActivities = async (req, res) => {
  try {
    
    const activities = await Activity.find()
      .sort({ createdAt: -1 }) 
      .limit(10)
      .populate("user", "fullName email avatar") 
      .populate("item");

    return res.status(200).json({
      success: true,
      data: activities,
    });
  } catch (error) {
    console.error("Error fetching recent activities:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch recent activities",
    });
  }
};
