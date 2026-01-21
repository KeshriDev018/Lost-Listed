import { User } from "../models/user.model.js";
import getDataUri from "../utils/getDataUri.js";
import cloudinary from "../utils/cloudinary.js";


export const registerUser = async (req, res) => {
  try {
    const { fullName, email, username, password, phone, location } = req.body;

    if ([fullName, email, username, password].some((f) => !f?.trim())) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    const existedUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existedUser) {
      return res.status(409).json({
        message: "User with email or username already exists",
        success: false,
      });
    }

    // Avatar upload
    const avatarFile = req.file;
    if (!avatarFile) {
      return res.status(400).json({
        message: "Avatar image is required",
        success: false,
      });
    }

    const fileUri = getDataUri(avatarFile);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

    const user = await User.create({
      username,
      email,
      fullName,
      phone,
      location,
      avatar: {
        url: cloudResponse.secure_url,
        public_id: cloudResponse.public_id,
      },
      password,
    });

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    return res.status(201).json({
      message: "User registered successfully",
      data: createdUser,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong while registering the user",
      success: false,
    });
  }
};


export const loginUser = async (req, res) => {
  

  const { email, username, password } = req.body;


  if (!username && !email) {
    return res.status(400).json({
      message: "username or email is required",
      success:false
    });
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    return res.status(404).json({
      message: "User does not exist",
      success: false,
    });
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
     return res.status(401).json({
       message: "Invalid user credentials",
       success: false,
     });
  }

  const  refreshToken  = user.generateRefreshToken();

   user.refreshToken = refreshToken;
   await user.save({ validateBeforeSave: false });
    
  
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    // secure: false, // ✅ false for localhost (use true only on HTTPS)
    sameSite: "strict", // ✅ required for cross-origin cookies
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .json({
      data:{
          user: loggedInUser,
          refreshToken,
        },
      message:"user logged in succesfully",
      success:true

    }
    );

};

export const logoutUser = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    // ✅ Logout must always succeed
    if (refreshToken) {
      const user = await User.findOne({ refreshToken });
      if (user) {
        user.refreshToken = null;
        await user.save({ validateBeforeSave: false });
      }
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });

    return res.status(200).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(200).json({
      message: "Logged out",
      success: true,
    });
  }
};



export const getUserProfile = async (req, res) => {
  try {
    // req.user is already available from verifyJWT middleware
    const user = await User.findById(req.user._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "User profile fetched successfully",
      data: user,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return res.status(500).json({
      message: "Something went wrong while fetching user profile",
      success: false,
    });
  }
};


export const updateUserInfo = async (req, res) => {
  try {
    const userId = req.user._id; // from verifyJWT
    const { fullName, phone, location } = req.body;

    // build the fields to update
    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (phone) updateData.phone = phone;
    if (location) updateData.location = location;


    // update user in DB
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    ).select("-password -refreshToken");

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
      success: true,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({
      message: "Something went wrong while updating profile",
      success: false,
    });
  }
};

export const updateUserAvatar = async (req, res) => {
  try {
    const userId = req.user._id; // from verifyJWT
   
    // build the fields to update
    const updateData = {};
    

    // handle avatar upload (optional)
    if (req.file) {
      const fileUri = getDataUri(req.file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      updateData.avatar = {
        url: cloudResponse.secure_url,
        public_id: cloudResponse.public_id,
      };
    }

    // update user in DB
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    ).select("-password -refreshToken");

    return res.status(200).json({
      message: "Avatar updated successfully",
      user: updatedUser,
      success: true,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({
      message: "Something went wrong while updating profile",
      success: false,
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.user._id; // from verifyJWT
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Both current and new passwords are required",
        success: false,
      });
    }

    // get the user from DB
    const user = await User.findById(userId);

    // check if current password is correct
    const isMatch = await user.isPasswordCorrect(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        message: "Current password is incorrect",
        success: false,
      });
    }

    // update password (pre-save hook will hash it)
    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      message: "Password changed successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error changing password:", error);
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
    });
  }
};




