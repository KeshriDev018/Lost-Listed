import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  setuserClaimedItems,
  setuserMarkedfoundItems,
} from "@/redux/authSlice";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Upload,
  PencilLine,
  Loader2,
  KeyRound,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { api } from "@/config/api";
import { toast } from "sonner";
import { setUser } from "@/redux/authSlice";
import useGetallUserLostItems from "@/hooks/useGetallUserLostItems";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Navbar from "@/components/Navbar";
import useGetallUserFoundItems from "@/hooks/useGetallUserFoundItems";
import usefetchUserClaimedItems from "@/hooks/usefetchUserClaimedItems";
import usefetchUserMarkedItems from "@/hooks/usefetchUserMarkedItems";
import store from "@/redux/store";
import useFetchAllUserProducts from "@/hooks/MarketPlace/usefetchUserProducts";

const Profile = () => {
  //****************  Profile Header Handlers  ***************

  const { user } = useSelector((store: any) => store.auth);
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("lost");
  const [editData, setEditData] = useState({
    fullName: user?.fullName || "",
    phone: user?.phone || "",
    location: user?.location || "",
  });

  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const handleInfoChange = (e: any) =>
    setEditData({ ...editData, [e.target.name]: e.target.value });

  const handlePasswordChange = (e: any) =>
    setPasswords({ ...passwords, [e.target.name]: e.target.value });

  const handleInfoUpdate = async () => {
    try {
      const res = await api.put(`/user/update-profile`, editData, {
        withCredentials: true,
      });
      dispatch(setUser(res.data.user));
      toast.success("Profile info updated!");
      setEditOpen(false);
    } catch {
      toast.error("Failed to update profile info.");
    }
  };

  const handleAvatarUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);
    setUploading(true);

    try {
      const res = await api.put(`/user/update-avatar`, formData, {
        withCredentials: true,
      });
      dispatch(setUser(res.data.user));
      toast.success("Profile picture updated!");
    } catch {
      toast.error("Failed to update avatar.");
    } finally {
      setUploading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (!passwords.currentPassword || !passwords.newPassword)
      return toast.error("Please fill in both fields");

    setUpdatingPassword(true);
    try {
      await api.put(`/user/update-password`, passwords, {
        withCredentials: true,
      });
      toast.success("Password updated!");
      setPasswordOpen(false);
      setPasswords({ currentPassword: "", newPassword: "" });
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Error updating password");
    } finally {
      setUpdatingPassword(false);
    }
  };

  //****************  Found Item Handlers *****************

  const { refetchFoundItems } = useGetallUserFoundItems();
  const foundItems = useSelector(
    (store: any) => store.founditem.userfoundItems,
  );
  const [openFoundUpdate, setOpenFoundUpdate] = useState(false);
  const [currentFoundItem, setCurrentFoundItem] = useState<any>(null);
  const [foundFormData, setfoundFormData] = useState({
    title: "",
    description: "",
    category: "",
    dateFound: "",
    location: "",
    isClaimed: false,
    image: null,
  });

  const handleFoundUpdate = async (item: any) => {
    setCurrentFoundItem(item);
    setfoundFormData({
      title: item.title,
      description: item.description,
      category: item.category,
      dateFound: item.dateLost,
      location: item.location,
      isClaimed: item.isFound,
      image: null,
    });
    setOpenFoundUpdate(true);
  };

  const [FoundLoading, setFoundLoading] = useState(false);
  const submitFoundUpdate = async () => {
    try {
      setFoundLoading(true);
      const fd = new FormData();
      Object.keys(formData).forEach((key) => {
        if (foundFormData[key] !== null) fd.append(key, foundFormData[key]);
      });

      await api.put(`/found-item/update/${currentFoundItem._id}`, fd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      refetchFoundItems();
    } catch (error) {
      console.log(error);
    } finally {
      setOpenFoundUpdate(false);
      setFoundLoading(false);
    }
  };

  const [selectedClaimer, setSelectedClaimer] = useState(null);
  const [openClaimerInfo, setOpenClaimerInfo] = useState(false);

  const handleViewClaimer = async (item: any) => {
    setSelectedClaimer(item.claimedBy);
    setOpenClaimerInfo(true);
  };

  const handleFoundDeleteItem = async (item: any) => {
    try {
      const res = await api.delete(`/found-item/delete/${item._id}`);

      if (res.data.success) {
        toast.message("Item deleted Successfully");
        refetchFoundItems();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete item");
    }
  };

  //****************  Lost item Handlers  ****************

  const { refetchItems } = useGetallUserLostItems();
  const lostItems = useSelector((store: any) => store.lostitem.userlostItems);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    dateLost: "",
    location: "",
    isFound: false,
    image: null,
  });

  const handleUpdate = (item: any) => {
    setCurrentItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      category: item.category,
      dateLost: item.dateLost,
      location: item.location,
      isFound: item.isFound,
      image: null,
    });
    setOpenUpdate(true);
  };

  const [LostLoading, setLostLoading] = useState(false);
  const submitUpdate = async () => {
    try {
      setLostLoading(true);
      const fd = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null) fd.append(key, formData[key]);
      });

      await api.put(`/lost-item/update/${currentItem._id}`, fd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      refetchItems();
    } catch (error) {
      console.log(error);
    } finally {
      setOpenUpdate(false);
      setLostLoading(false);
    }
  };

  const [selectedFinder, setSelectedFinder] = useState(null);
  const [open, setOpen] = useState(false);

  const handleViewFinder = (item: any) => {
    setSelectedFinder(item.foundBy); // foundBy already has fullName,
    //  email, phoneNumber
    console.log(selectedFinder);
    setOpen(true);
  };

  const handleDeleteItem = async (item: any) => {
    try {
      const res = await api.delete(`/lost-item/delete/${item._id}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success("Item deleted Successfully");
        refetchItems();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete item");
    }
  };

  //****************  Claims activity Handlers ***************

  const { fetchClaimedItems } = usefetchUserClaimedItems();
  const { fetchMarkedItems } = usefetchUserMarkedItems();

  const markedItems = useSelector(
    (store: any) => store.auth.userMarkedfoundItems,
  );

  const claimedItems = useSelector((store: any) => store.auth.userClaimedItems);

  const [claimsTab, setClaimsTab] = useState("claimed");

  const handleWithdrawClaim = async (id: any) => {
    try {
      dispatch(
        setuserClaimedItems(
          claimedItems.filter((item: any) => item._id !== id),
        ),
      );

      await api.put(`/found-item/unclaim/${id}`);
      toast.success("Claim withdraw successfull");
      await fetchClaimedItems();
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Failed to withdraw claim");
    }
  };

  const [selectedReporter, setSelectedReporter] = useState(null);
  const [openReporter, setOpenReporter] = useState(false);

  const handleviewReporter = (item: any) => {
    setSelectedReporter(item.user);
    setOpenReporter(true);
  };

  const [selectedOwner, setSelectedOwner] = useState(null);
  const [openOwner, setOpenOwner] = useState(false);

  const handleviewOwner = (item: any) => {
    setSelectedOwner(item.user);
    setOpenOwner(true);
  };

  const handleUnmarkasFound = async (id: any) => {
    try {
      dispatch(
        setuserMarkedfoundItems(
          markedItems.filter((item: any) => item._id !== id),
        ),
      );

      await api.put(`/lost-item/unmark/${id}`);
      toast.success("Item unmarked as found");
      await fetchMarkedItems();
    } catch (err) {
      console.log(err);
      toast.error(
        err.response?.data?.message || "Failed to unmark item as found",
      );
    }
  };

  //**************  products activity Handlers  ***************

  const { refetchUserProducts } = useFetchAllUserProducts();

  const userProducts = useSelector((store: any) => store.product.userProducts);

  const handleProductDeleteItem = async (item: any) => {
    try {
      await api.delete(`/products/delete/${item._id}`, {
        withCredentials: true,
      });

      await refetchUserProducts();
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete product");
    }
  };

  const [openProductUpdate, setOpenProductUpdate] = useState(false);

  const [userProductForm, setUserProductForm] = useState({
    title: "",
    description: "",
    condition: "",
    price: 0,
    category: "",
    images: [],
  });

  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleProductUpdate = async (item: any) => {
    setSelectedProduct(item);
    setUserProductForm({
      title: item.title,
      description: item.description,
      condition: item.condition,
      price: item.price,
      category: item.category,
      images: [],
    });
    setOpenProductUpdate(true);
  };

  const handleuserProductFormChange = (e) => {
    const { name, type, value, files } = e.target;

    if (type === "file") {
      setUserProductForm((prev) => ({
        ...prev,
        images: Array.from(files), // store multiple files
      }));
    } else {
      setUserProductForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const [saveLoading, setSaveLoading] = useState(false);

  const submitProductUpdate = async () => {
    try {
      if (!selectedProduct) {
        toast.error("No product selected for update!");
        return;
      }
      setSaveLoading(true);

      const formData = new FormData();

      for (const key in userProductForm) {
        if (key === "images") {
          userProductForm.images.forEach((file) =>
            formData.append("images", file),
          );
        } else {
          formData.append(key, userProductForm[key]);
        }
      }

      const res = await api.put(
        `/products/update/${selectedProduct._id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      await refetchUserProducts();
      toast.success("Product updated successfully!");
    } catch (err) {
      console.error("Error updating product:", err);
      toast.error("Failed to update product");
    } finally {
      setOpenProductUpdate(false);
      setSaveLoading(false);
    }
  };

  const MarkasSold = async (i: any) => {
    try {
      const res = await api.put(`/products/sold/${i._id}`);

      if (res.data.success) {
        toast.success("Item marked as sold");
        await refetchUserProducts();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  const MarkasAvailable = async (i: any) => {
    try {
      const res = await api.put(`/products/unsold/${i._id}`);

      if (res.data.success) {
        toast.success("Item is now available for sale");
        await refetchUserProducts();
      }
    } catch (error) {
      console.log(error);

      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  // *********  Search bar section Handlers*********

  const [searchLost, setSearchLost] = useState("");
  const [searchFound, setSearchFound] = useState("");
  const [searchClaim, setSearchClaim] = useState("");
  const [searchProduct, setSearchProduct] = useState("");

  // Pagination states
  const [lostPage, setLostPage] = useState(1);
  const [foundPage, setFoundPage] = useState(1);
  const [claimsPage, setClaimsPage] = useState(1);
  const [productsPage, setProductsPage] = useState(1);
  const itemsPerPage = 6;

  if (!user)
    return (
      <div className="flex items-center justify-center h-screen">
        No user data
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <Navbar />
      <div className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Professional Header Profile Section */}
          <Card className="backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 border border-purple-100 dark:border-gray-700 shadow-2xl rounded-2xl overflow-hidden mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-purple-500/10 pointer-events-none" />
            <CardContent className="relative p-8 flex flex-col sm:flex-row gap-8 items-center sm:items-start">
              {/* Enhanced Avatar Section */}
              <div className="relative group transition-all duration-300">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full opacity-75 group-hover:opacity-100 blur transition-all duration-300"></div>
                <img
                  src={user.avatar?.url || "/default-avatar.png"}
                  className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full border-4 border-white dark:border-gray-700 shadow-xl object-cover transition-all duration-300 group-hover:scale-105"
                />
                <label
                  htmlFor="avatarUpload"
                  className="absolute inset-0 flex flex-col justify-center items-center bg-black/40 opacity-0 group-hover:opacity-100 text-white rounded-full cursor-pointer transition-opacity duration-300"
                >
                  {uploading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      <Upload className="h-5 w-5 transition-transform duration-200 group-hover:rotate-12" />
                      <span className="text-xs tracking-widest">Update</span>
                    </>
                  )}
                  <input
                    id="avatarUpload"
                    type="file"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                </label>
              </div>

              {/* User Info Section */}
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left w-full transition-all duration-300 animate-fade-in-up">
                <h1 className="text-xl sm:text-2xl font-bold break-words transition-all duration-300 hover:text-purple-600">
                  {user.fullName}
                </h1>
                <div className="text-sm opacity-70 dark:opacity-60 break-words transition-all duration-300">
                  @{user.username}
                </div>
                <Badge className="mt-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-all duration-200 hover:bg-purple-100 dark:hover:bg-purple-800">
                  Member
                </Badge>

                {/* Contact Details */}
                <div className="flex flex-col gap-1 mt-3 text-sm sm:text-base w-full transition-all duration-300">
                  <div className="flex items-center justify-center sm:justify-start gap-2 transition-all duration-200 hover:text-purple-600">
                    <Phone className="h-4 w-4 text-gray-500 dark:text-gray-400 transition-all duration-200" />
                    <span>{user.phone}</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-2 transition-all duration-200 hover:text-purple-600">
                    <Mail className="h-4 w-4 text-gray-500 dark:text-gray-400 transition-all duration-200" />
                    <span className="break-words">{user.email}</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-2 transition-all duration-200 hover:text-purple-600">
                    <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400 transition-all duration-200" />
                    <span className="break-words">{user.location}</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-2 transition-all duration-200 hover:text-purple-600">
                    <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400 transition-all duration-200" />
                    <span>
                      Joined on{" "}
                      {new Date(user.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {/* Buttons Section */}
                <div className="mt-4 flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center sm:justify-start transition-all duration-500">
                  {/* Edit Profile */}
                  <Dialog open={editOpen} onOpenChange={setEditOpen}>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        className="w-full sm:w-auto transition-transform duration-200 hover:scale-105 hover:bg-purple-600"
                      >
                        <PencilLine className="h-4 w-4 mr-2" /> Edit Profile
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-300 animate-fade-in">
                      <DialogHeader>
                        <DialogTitle>Edit Info</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <Label>FullName</Label>
                        <Input
                          name="fullName"
                          value={editData.fullName}
                          onChange={handleInfoChange}
                          placeholder="Full Name"
                          className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200"
                        />
                        <Label>Phone</Label>
                        <Input
                          name="phone"
                          value={editData.phone}
                          onChange={handleInfoChange}
                          placeholder="Phone"
                          className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200"
                        />
                        <Label>Location</Label>
                        <Input
                          name="location"
                          value={editData.location}
                          onChange={handleInfoChange}
                          placeholder="Location"
                          className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200"
                        />
                        <p className="text-sm text-gray-500 mt-2">
                          Note: You cannot update your{" "}
                          <span className="font-semibold">email</span> or{" "}
                          <span className="font-semibold">username</span>.
                        </p>
                      </div>
                      <DialogFooter>
                        <Button
                          onClick={handleInfoUpdate}
                          className="transition-all duration-200 hover:bg-purple-600"
                        >
                          Save
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  {/* Change Password */}
                  <Dialog open={passwordOpen} onOpenChange={setPasswordOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto transition-transform duration-200 hover:scale-105 hover:ring hover:ring-purple-300"
                      >
                        <KeyRound className="h-4 w-4 mr-2" /> Change Password
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-300 animate-fade-in">
                      <DialogHeader>
                        <DialogTitle>Change Password</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <Input
                          type="password"
                          name="currentPassword"
                          value={passwords.currentPassword}
                          onChange={handlePasswordChange}
                          placeholder="Current Password"
                          className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200"
                        />
                        <Input
                          type="password"
                          name="newPassword"
                          value={passwords.newPassword}
                          onChange={handlePasswordChange}
                          placeholder="New Password"
                          className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200"
                        />
                      </div>
                      <DialogFooter>
                        <Button
                          onClick={handlePasswordUpdate}
                          className="transition-all duration-200 hover:bg-purple-600"
                        >
                          {updatingPassword ? "Updating..." : "Update"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Tabs Section */}
          <div className="mb-8">
            {/* Enhanced Desktop Tabs */}
            <div className="hidden sm:flex gap-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg p-2 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              {["lost", "found", "claims", "products"].map((tab) => (
                <Button
                  key={tab}
                  className={`transition-all duration-300 ${
                    activeTab == tab
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg scale-105"
                      : "bg-transparent hover:bg-purple-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
                  variant="ghost"
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === "lost" && "Lost Items"}
                  {tab === "found" && "Found Items"}
                  {tab === "claims" && "Claims Activity"}
                  {tab === "products" && "Your Products"}
                </Button>
              ))}
            </div>

            {/* Enhanced Mobile Tabs Dropdown */}
            <div className="sm:hidden">
              <select
                className="w-full p-3 rounded-xl border-2 border-purple-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
              >
                <option value="lost">Lost Items</option>
                <option value="found">Found Items</option>
                <option value="claims">Claims Activity</option>
                <option value="products">Your Products</option>
              </select>
            </div>
          </div>

          {/* Professional Content Section */}
          <Card className="backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 shadow-xl rounded-2xl overflow-hidden">
            <CardContent className="p-6 sm:p-8 space-y-6">
              {/* ✅ Render table headings only if NOT claims */}
              {activeTab !== "claims" && (
                <div className="hidden sm:grid grid-cols-4 font-semibold text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-2 mb-3">
                  <span>Item</span>
                  <span>Details</span>
                  <span className="text-center">Status</span>
                  <span className="text-right">Actions</span>
                </div>
              )}

              {/* LOST ITEMS */}
              {activeTab === "lost" && (
                <>
                  {/* Enhanced Search Bar */}
                  <div className="flex justify-end mb-6">
                    <Input
                      type="text"
                      placeholder="Search Lost Items..."
                      value={searchLost}
                      onChange={(e) =>
                        setSearchLost(e.target.value.toLowerCase())
                      }
                      className="max-w-sm bg-white dark:bg-gray-700 border-2 border-purple-200 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-md rounded-xl"
                    />
                  </div>

                  {/* Filtered Lost Items */}
                  {lostItems && lostItems.length > 0 ? (
                    (() => {
                      const filteredItems = lostItems.filter(
                        (i: any) =>
                          i.title.toLowerCase().includes(searchLost) ||
                          i.category.toLowerCase().includes(searchLost) ||
                          i.location.toLowerCase().includes(searchLost),
                      );
                      const totalPages = Math.ceil(
                        filteredItems.length / itemsPerPage,
                      );
                      const startIndex = (lostPage - 1) * itemsPerPage;
                      const paginatedItems = filteredItems.slice(
                        startIndex,
                        startIndex + itemsPerPage,
                      );

                      return paginatedItems.length > 0 ? (
                        <>
                          {paginatedItems.map((i: any) => (
                            <div
                              key={i.id}
                              className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-xl shadow border-b border-gray-200 dark:border-gray-700 flex flex-col sm:grid sm:grid-cols-4 sm:items-center sm:gap-4 space-y-4 sm:space-y-0"
                            >
                              {/* Title */}
                              <span className="font-medium text-gray-900 dark:text-gray-100 text-lg truncate">
                                {i.title}
                              </span>

                              {/* Details */}
                              <div className="text-sm text-gray-600 dark:text-gray-300 flex flex-col space-y-1">
                                <span className="capitalize">
                                  <strong>Category: </strong> {i.category}
                                </span>
                                <span>
                                  <strong>Date Lost: </strong>{" "}
                                  {new Date(i.dateLost).toLocaleDateString(
                                    "en-GB",
                                  )}
                                </span>
                                <span>
                                  <strong>Location: </strong> {i.location}
                                </span>
                              </div>

                              {/* Status */}
                              <Badge
                                className={` w-fit mx-auto  text-white rounded-full px-3 py-1  ${
                                  i.isFound ? "bg-green-500" : "bg-red-500"
                                }`}
                              >
                                {i.isFound ? "Found" : "Not Found"}
                              </Badge>

                              {/* Actions */}
                              <div className="flex justify-end">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreVertical className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                                    </Button>
                                  </DropdownMenuTrigger>

                                  <DropdownMenuContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                                    <DropdownMenuItem
                                      onClick={() => handleUpdate(i)}
                                    >
                                      Update Item
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleViewFinder(i)}
                                    >
                                      View Finder Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleDeleteItem(i)}
                                    >
                                      Delete Item
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          ))}

                          {/* Pagination Controls */}
                          {totalPages > 1 && (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 }}
                              className="flex items-center justify-center gap-4 mt-8"
                            >
                              <Button
                                onClick={() => setLostPage(lostPage - 1)}
                                disabled={lostPage === 1}
                                variant="outline"
                                className="group relative overflow-hidden border-2 border-purple-500/30 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm hover:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <svg
                                  className="w-5 h-5 mr-2"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                  />
                                </svg>
                                Previous
                              </Button>

                              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20">
                                <span className="font-semibold text-purple-700 dark:text-purple-300">
                                  {lostPage}
                                </span>
                                <span className="text-gray-500 dark:text-gray-400">
                                  /
                                </span>
                                <span className="text-gray-600 dark:text-gray-300">
                                  {totalPages}
                                </span>
                              </div>

                              <Button
                                onClick={() => setLostPage(lostPage + 1)}
                                disabled={lostPage === totalPages}
                                variant="outline"
                                className="group relative overflow-hidden border-2 border-purple-500/30 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm hover:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Next
                                <svg
                                  className="w-5 h-5 ml-2"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                  />
                                </svg>
                              </Button>
                            </motion.div>
                          )}
                        </>
                      ) : (
                        // No Search Match
                        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                          <p className="text-lg font-medium">
                            No items match your search.
                          </p>
                          <p className="text-sm">
                            Try adjusting your search keywords.
                          </p>
                        </div>
                      );
                    })()
                  ) : (
                    // Empty State (No Lost Items)
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                      <p className="text-lg font-semibold">
                        No lost items found.
                      </p>
                      <p className="text-sm">
                        You haven’t reported any lost items yet.
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* FOUND ITEMS */}
              {activeTab === "found" && (
                <>
                  {/* Search Bar */}
                  <div className="flex justify-end mb-4">
                    <Input
                      type="text"
                      placeholder="Search Found Items..."
                      value={searchFound}
                      onChange={(e) =>
                        setSearchFound(e.target.value.toLowerCase())
                      }
                      className="max-w-sm bg-gray-100 dark:bg-gray-800"
                    />
                  </div>

                  {/* Found Items Display */}
                  {foundItems && foundItems.length > 0 ? (
                    (() => {
                      const filteredItems = foundItems.filter(
                        (i: any) =>
                          i.title.toLowerCase().includes(searchFound) ||
                          i.category.toLowerCase().includes(searchFound) ||
                          i.location.toLowerCase().includes(searchFound),
                      );
                      const totalPages = Math.ceil(
                        filteredItems.length / itemsPerPage,
                      );
                      const startIndex = (foundPage - 1) * itemsPerPage;
                      const paginatedItems = filteredItems.slice(
                        startIndex,
                        startIndex + itemsPerPage,
                      );

                      return paginatedItems.length > 0 ? (
                        <>
                          {paginatedItems.map((i: any) => (
                            <div
                              key={i.id}
                              className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-xl shadow border-b border-gray-200 dark:border-gray-700 flex flex-col sm:grid sm:grid-cols-4 sm:items-center sm:gap-4 space-y-4 sm:space-y-0"
                            >
                              {/* Title */}
                              <span className="font-medium text-gray-900 dark:text-gray-100 text-lg truncate">
                                {i.title}
                              </span>

                              {/* Details */}
                              <div className="text-sm text-gray-600 dark:text-gray-300 flex flex-col space-y-1">
                                <span className="capitalize">
                                  <strong>Category: </strong> {i.category}
                                </span>
                                <span>
                                  <strong>Date Found: </strong>{" "}
                                  {new Date(i.dateFound).toLocaleDateString(
                                    "en-GB",
                                  )}
                                </span>
                                <span>
                                  <strong>Location: </strong> {i.location}
                                </span>
                              </div>

                              {/* Status */}
                              <Badge
                                className={`w-fit mx-auto text-white rounded-full px-3 py-1 ${
                                  i.isClaimed ? "bg-green-500" : "bg-red-500"
                                }`}
                              >
                                {i.isClaimed ? "Claimed" : "Not Claimed"}
                              </Badge>

                              {/* Actions */}
                              <div className="flex justify-end">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreVertical className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                                    </Button>
                                  </DropdownMenuTrigger>

                                  <DropdownMenuContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                                    <DropdownMenuItem
                                      onClick={() => handleFoundUpdate(i)}
                                    >
                                      Update Item
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleViewClaimer(i)}
                                    >
                                      View Claimer Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleFoundDeleteItem(i)}
                                    >
                                      Delete Item
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          ))}

                          {/* Pagination Controls */}
                          {totalPages > 1 && (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 }}
                              className="flex items-center justify-center gap-4 mt-8"
                            >
                              <Button
                                onClick={() => setFoundPage(foundPage - 1)}
                                disabled={foundPage === 1}
                                variant="outline"
                                className="group relative overflow-hidden border-2 border-purple-500/30 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm hover:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <svg
                                  className="w-5 h-5 mr-2"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                  />
                                </svg>
                                Previous
                              </Button>

                              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20">
                                <span className="font-semibold text-purple-700 dark:text-purple-300">
                                  {foundPage}
                                </span>
                                <span className="text-gray-500 dark:text-gray-400">
                                  /
                                </span>
                                <span className="text-gray-600 dark:text-gray-300">
                                  {totalPages}
                                </span>
                              </div>

                              <Button
                                onClick={() => setFoundPage(foundPage + 1)}
                                disabled={foundPage === totalPages}
                                variant="outline"
                                className="group relative overflow-hidden border-2 border-purple-500/30 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm hover:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Next
                                <svg
                                  className="w-5 h-5 ml-2"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                  />
                                </svg>
                              </Button>
                            </motion.div>
                          )}
                        </>
                      ) : (
                        // No Search Match
                        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                          <p className="text-lg font-medium">
                            No items match your search.
                          </p>
                          <p className="text-sm">
                            Try changing your search keywords.
                          </p>
                        </div>
                      );
                    })()
                  ) : (
                    // Empty State (No Found Items)
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                      <p className="text-lg font-semibold">
                        No found items yet.
                      </p>
                      <p className="text-sm">
                        You haven’t reported any found items.
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* CLAIMS */}
              {activeTab === "claims" && (
                <div className="space-y-4">
                  {/* 🔹 Search Bar */}
                  <div className="flex justify-end mb-4">
                    <Input
                      type="text"
                      placeholder={
                        claimsTab === "claimed"
                          ? "Search Claimed Items..."
                          : "Search Marked Items..."
                      }
                      value={searchClaim}
                      onChange={(e) =>
                        setSearchClaim(e.target.value.toLowerCase())
                      }
                      className="max-w-sm bg-gray-100 dark:bg-gray-800"
                    />
                  </div>

                  {/* 🔹 Inner Tabs — Always Visible */}
                  <div className="flex flex-wrap gap-3 mb-4">
                    {["claimed", "marked"].map((t) => (
                      <Button
                        key={t}
                        onClick={() => setClaimsTab(t)}
                        className={`px-4 py-1 text-sm font-medium rounded-md ${
                          claimsTab === t
                            ? "bg-purple-600 text-white border-purple-600 dark:bg-purple-500 dark:border-purple-500"
                            : "bg-gray-100 text-gray-900 border-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                      >
                        {t === "claimed"
                          ? "Items You Claimed"
                          : "Items You Marked as Found"}
                      </Button>
                    ))}
                  </div>

                  {/* 🔹 Table Heading */}
                  <div className="hidden sm:grid grid-cols-5 font-semibold text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-2 mb-3">
                    <span>Item</span>
                    <span>Details</span>
                    <span className="text-center">Activity</span>
                    <span className="text-right">Reporting Date</span>
                    <span className="text-right">Action</span>
                  </div>

                  {/* 🔹 Filtered Items */}
                  {(() => {
                    const currentItems =
                      claimsTab === "claimed" ? claimedItems : markedItems;

                    const filtered = currentItems?.filter(
                      (a: any) =>
                        a.title.toLowerCase().includes(searchClaim) ||
                        (a.category &&
                          a.category.toLowerCase().includes(searchClaim)),
                    );

                    if (!currentItems || currentItems.length === 0) {
                      return (
                        <div className="text-center text-gray-500 dark:text-gray-400 py-6">
                          {claimsTab === "claimed"
                            ? "You haven't claimed any items yet."
                            : "You haven't marked any items as found yet."}
                        </div>
                      );
                    }

                    if (filtered.length === 0 && searchClaim.trim() !== "") {
                      return (
                        <div className="text-center text-gray-500 dark:text-gray-400 py-6">
                          No items found for your search.
                        </div>
                      );
                    }

                    const totalPages = Math.ceil(
                      filtered.length / itemsPerPage,
                    );
                    const startIndex = (claimsPage - 1) * itemsPerPage;
                    const paginatedItems = filtered.slice(
                      startIndex,
                      startIndex + itemsPerPage,
                    );

                    return (
                      <>
                        {paginatedItems.map((a: any) => (
                          <div
                            key={a._id}
                            className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-xl shadow border-b border-gray-200 dark:border-gray-700 flex flex-col sm:grid sm:grid-cols-5 sm:items-center sm:gap-4 space-y-4 sm:space-y-0"
                          >
                            <span className="font-medium text-gray-900 dark:text-gray-100 text-lg truncate">
                              {a.title}
                            </span>

                            <div className="text-sm text-gray-600 dark:text-gray-300">
                              <p>
                                <strong>Type:</strong>{" "}
                                {claimsTab === "claimed"
                                  ? "Found Item"
                                  : "Lost Item"}
                              </p>
                            </div>

                            <Badge
                              className={`w-fit mx-auto text-white rounded-full px-3 py-1 ${
                                claimsTab === "claimed"
                                  ? "bg-blue-500"
                                  : "bg-green-600"
                              }`}
                            >
                              {claimsTab === "claimed"
                                ? "You claimed it"
                                : "You marked as found"}
                            </Badge>

                            <span className=" text-right text-sm text-gray-500 dark:text-gray-400">
                              {new Date(a.createdAt).toLocaleDateString(
                                "en-IN",
                              )}
                            </span>

                            {/* Actions */}
                            <div className="flex justify-end">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                                  </Button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                                  {claimsTab === "claimed" ? (
                                    <>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleWithdrawClaim(a._id)
                                        }
                                      >
                                        Withdraw Claim
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => handleviewReporter(a)}
                                      >
                                        View Reporter Details
                                      </DropdownMenuItem>
                                    </>
                                  ) : (
                                    <>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleUnmarkasFound(a._id)
                                        }
                                      >
                                        Unmark as Found
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => handleviewOwner(a)}
                                      >
                                        View Owner Details
                                      </DropdownMenuItem>
                                    </>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        ))}

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center justify-center gap-4 mt-8"
                          >
                            <Button
                              onClick={() => setClaimsPage(claimsPage - 1)}
                              disabled={claimsPage === 1}
                              variant="outline"
                              className="group relative overflow-hidden border-2 border-purple-500/30 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm hover:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <svg
                                className="w-5 h-5 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 19l-7-7 7-7"
                                />
                              </svg>
                              Previous
                            </Button>

                            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20">
                              <span className="font-semibold text-purple-700 dark:text-purple-300">
                                {claimsPage}
                              </span>
                              <span className="text-gray-500 dark:text-gray-400">
                                /
                              </span>
                              <span className="text-gray-600 dark:text-gray-300">
                                {totalPages}
                              </span>
                            </div>

                            <Button
                              onClick={() => setClaimsPage(claimsPage + 1)}
                              disabled={claimsPage === totalPages}
                              variant="outline"
                              className="group relative overflow-hidden border-2 border-purple-500/30 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm hover:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Next
                              <svg
                                className="w-5 h-5 ml-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </Button>
                          </motion.div>
                        )}
                      </>
                    );
                  })()}
                </div>
              )}

              {/* PRODUCTS */}
              {activeTab === "products" && (
                <>
                  {/* Search Bar */}
                  <div className="flex justify-end mb-4">
                    <Input
                      type="text"
                      placeholder="Search Products..."
                      value={searchProduct}
                      onChange={(e) =>
                        setSearchProduct(e.target.value.toLowerCase())
                      }
                      className="max-w-sm bg-gray-100 dark:bg-gray-800"
                    />
                  </div>

                  {/* Product Items */}
                  {userProducts && userProducts.length > 0 ? (
                    (() => {
                      const filteredItems = userProducts.filter(
                        (i: any) =>
                          i.title.toLowerCase().includes(searchProduct) ||
                          i.category.toLowerCase().includes(searchProduct) ||
                          i.condition.toLowerCase().includes(searchProduct),
                      );
                      const totalPages = Math.ceil(
                        filteredItems.length / itemsPerPage,
                      );
                      const startIndex = (productsPage - 1) * itemsPerPage;
                      const paginatedItems = filteredItems.slice(
                        startIndex,
                        startIndex + itemsPerPage,
                      );

                      return paginatedItems.length > 0 ? (
                        <>
                          {paginatedItems.map((i: any) => (
                            <div
                              key={i.id}
                              className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-xl shadow border-b border-gray-200 dark:border-gray-700 flex flex-col sm:grid sm:grid-cols-4 sm:items-center sm:gap-4 space-y-4 sm:space-y-0"
                            >
                              {/* Title */}
                              <span className="font-medium text-gray-900 dark:text-gray-100 text-lg truncate">
                                {i.title}
                              </span>

                              {/* Details */}
                              <div className="text-sm text-gray-600 dark:text-gray-300 flex flex-col space-y-1">
                                <span className="capitalize">
                                  <strong>Category: </strong> {i.category}
                                </span>
                                <span>
                                  <strong>Price: </strong> ₹{i.price}
                                </span>
                                <span>
                                  <strong>Condition: </strong> {i.condition}
                                </span>
                              </div>

                              {/* Status */}
                              <Badge
                                className={`w-fit mx-auto text-white rounded-full px-3 py-1 ${
                                  i.isSold ? "bg-red-500" : "bg-green-500"
                                }`}
                              >
                                {i.isSold ? "Sold" : "Available"}
                              </Badge>

                              {/* Actions */}
                              <div className="flex justify-end">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreVertical className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                                    </Button>
                                  </DropdownMenuTrigger>

                                  <DropdownMenuContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                                    <DropdownMenuItem
                                      onClick={() => handleProductUpdate(i)}
                                    >
                                      Update Item
                                    </DropdownMenuItem>
                                    {!i.isSold ? (
                                      <DropdownMenuItem
                                        onClick={() => MarkasSold(i)}
                                      >
                                        Mark as Sold
                                      </DropdownMenuItem>
                                    ) : (
                                      <DropdownMenuItem
                                        onClick={() => MarkasAvailable(i)}
                                      >
                                        Mark as Available
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem
                                      onClick={() => handleProductDeleteItem(i)}
                                    >
                                      Delete Item
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          ))}

                          {/* Pagination Controls */}
                          {totalPages > 1 && (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 }}
                              className="flex items-center justify-center gap-4 mt-8"
                            >
                              <Button
                                onClick={() =>
                                  setProductsPage(productsPage - 1)
                                }
                                disabled={productsPage === 1}
                                variant="outline"
                                className="group relative overflow-hidden border-2 border-purple-500/30 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm hover:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <svg
                                  className="w-5 h-5 mr-2"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                  />
                                </svg>
                                Previous
                              </Button>

                              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20">
                                <span className="font-semibold text-purple-700 dark:text-purple-300">
                                  {productsPage}
                                </span>
                                <span className="text-gray-500 dark:text-gray-400">
                                  /
                                </span>
                                <span className="text-gray-600 dark:text-gray-300">
                                  {totalPages}
                                </span>
                              </div>

                              <Button
                                onClick={() =>
                                  setProductsPage(productsPage + 1)
                                }
                                disabled={productsPage === totalPages}
                                variant="outline"
                                className="group relative overflow-hidden border-2 border-purple-500/30 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm hover:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Next
                                <svg
                                  className="w-5 h-5 ml-2"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                  />
                                </svg>
                              </Button>
                            </motion.div>
                          )}
                        </>
                      ) : (
                        // No Search Match
                        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                          <p className="text-lg font-medium">
                            No products match your search.
                          </p>
                          <p className="text-sm">
                            Try using a different keyword.
                          </p>
                        </div>
                      );
                    })()
                  ) : (
                    // Empty State (No Products)
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                      <p className="text-lg font-semibold">
                        No products added yet.
                      </p>
                      <p className="text-sm">
                        Start by listing an item for sale.
                      </p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Dialogue Boxes */}

          {/* Lost Items Dialogue boxes */}
          <Dialog open={openUpdate} onOpenChange={setOpenUpdate}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Update Lost Item</DialogTitle>
              </DialogHeader>

              <div className="space-y-3">
                {["title", "description", "category", "location"].map(
                  (field) => (
                    <div key={field}>
                      <Label className="capitalize">{field}</Label>
                      <Input
                        value={formData[field]}
                        onChange={(e) =>
                          setFormData({ ...formData, [field]: e.target.value })
                        }
                      />
                    </div>
                  ),
                )}

                <div>
                  <Label>Category</Label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Documents">Documents</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <Label>Date Lost</Label>
                  <Input
                    type="date"
                    value={formData.dateLost}
                    onChange={(e) =>
                      setFormData({ ...formData, dateLost: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label>Upload New Image (optional)</Label>
                  <Input
                    type="file"
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.files[0] })
                    }
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="ghost" onClick={() => setOpenUpdate(false)}>
                  Cancel
                </Button>
                <Button onClick={async () => await submitUpdate()}>
                  {LostLoading ? "Saving Changes..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Lost item founder Dialog box */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Finder Information</DialogTitle>
                <DialogDescription>
                  Person who found this item
                </DialogDescription>
              </DialogHeader>

              {selectedFinder ? (
                <div className="space-y-2">
                  <p>
                    <strong>Name:</strong> {selectedFinder.fullName}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedFinder.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {selectedFinder.phone}
                  </p>
                </div>
              ) : (
                <p className="text-center text-gray-500 py-4">
                  🚫 This item has not been found yet.
                </p>
              )}

              <DialogFooter>
                <DialogClose className="btn">Close</DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Found Items Dialogue Boxes */}

          <Dialog open={openFoundUpdate} onOpenChange={setOpenFoundUpdate}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Update Found Item</DialogTitle>
              </DialogHeader>

              <div className="space-y-3">
                {["title", "description", "location"].map((field) => (
                  <div key={field}>
                    <Label className="capitalize">{field}</Label>
                    <Input
                      value={foundFormData[field]}
                      onChange={(e) =>
                        setfoundFormData({
                          ...foundFormData,
                          [field]: e.target.value,
                        })
                      }
                    />
                  </div>
                ))}

                <div>
                  <Label>Category</Label>
                  <select
                    name="category"
                    value={foundFormData.category}
                    onChange={(e) =>
                      setfoundFormData({
                        ...foundFormData,
                        category: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Documents">Documents</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <Label>Date Found</Label>
                  <Input
                    type="date"
                    value={foundFormData.dateFound}
                    onChange={(e) =>
                      setfoundFormData({
                        ...foundFormData,
                        dateFound: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <Label>Upload New Image (optional)</Label>
                  <Input
                    type="file"
                    onChange={(e) =>
                      setfoundFormData({
                        ...foundFormData,
                        image: e.target.files[0],
                      })
                    }
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="ghost"
                  onClick={() => setOpenFoundUpdate(false)}
                >
                  Cancel
                </Button>
                <Button onClick={async () => await submitFoundUpdate()}>
                  {FoundLoading ? "Saving changes..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Found Item Claimer Dialogue Box */}
          <Dialog open={openClaimerInfo} onOpenChange={setOpenClaimerInfo}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Claimer's Information</DialogTitle>
                <DialogDescription>
                  Person who claimed this item
                </DialogDescription>
              </DialogHeader>

              {selectedClaimer ? (
                <div className="space-y-2">
                  <p>
                    <strong>Name:</strong> {selectedClaimer.fullName}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedClaimer.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {selectedClaimer.phone}
                  </p>
                </div>
              ) : (
                <p className="text-center text-gray-500 py-4">
                  🚫 This item has not been claimed yet.
                </p>
              )}

              <DialogFooter>
                <DialogClose className="btn">Close</DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Claims activity Dialogue boxes */}

          <Dialog open={openReporter} onOpenChange={setOpenReporter}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reporter's Information</DialogTitle>
                <DialogDescription>
                  Person who reported this lost item
                </DialogDescription>
              </DialogHeader>

              {selectedReporter ? (
                <div className="space-y-2">
                  <p>
                    <strong>Name:</strong> {selectedReporter.fullName}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedReporter.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {selectedReporter.phone}
                  </p>
                </div>
              ) : (
                <p className="text-center text-gray-500 py-4">
                  🚫 This item has not reported yet.
                </p>
              )}

              <DialogFooter>
                <DialogClose className="btn">Close</DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={openOwner} onOpenChange={setOpenOwner}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reporter's Information</DialogTitle>
                <DialogDescription>
                  Person who reported this lost item
                </DialogDescription>
              </DialogHeader>

              {selectedOwner ? (
                <div className="space-y-2">
                  <p>
                    <strong>Name:</strong> {selectedOwner.fullName}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedOwner.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {selectedOwner.phone}
                  </p>
                </div>
              ) : (
                <p className="text-center text-gray-500 py-4">
                  🚫 This item has not reported yet.
                </p>
              )}

              <DialogFooter>
                <DialogClose className="btn">Close</DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Product Update Dialog Box */}
          <Dialog open={openProductUpdate} onOpenChange={setOpenProductUpdate}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Update Your Product</DialogTitle>
              </DialogHeader>

              <div className="space-y-3">
                {/* Title */}
                <div>
                  <Label>Title</Label>
                  <Input
                    name="title"
                    value={userProductForm.title}
                    onChange={handleuserProductFormChange}
                    placeholder="Enter product title"
                  />
                </div>

                {/* Description */}
                <div>
                  <Label>Description</Label>
                  <Input
                    name="description"
                    value={userProductForm.description}
                    onChange={handleuserProductFormChange}
                    placeholder="Enter product description"
                  />
                </div>

                {/* Category Dropdown */}
                <div>
                  <Label>Category</Label>
                  <select
                    name="category"
                    value={userProductForm.category}
                    onChange={handleuserProductFormChange}
                    className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Books">Books</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Home">Home</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Condition Dropdown */}
                <div>
                  <Label>Condition</Label>
                  <select
                    name="condition"
                    value={userProductForm.condition}
                    onChange={handleuserProductFormChange}
                    className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="new">New</option>
                    <option value="like_new">Like New</option>
                    <option value="very_good">Very Good</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="for_parts">For Parts</option>
                  </select>
                </div>

                {/* Price */}
                <div>
                  <Label>Price</Label>
                  <Input
                    type="number"
                    name="price"
                    value={userProductForm.price}
                    onChange={handleuserProductFormChange}
                    placeholder="Enter price"
                  />
                </div>

                {/* Upload Images */}
                <div>
                  <Label>Upload New Images (optional)</Label>
                  <Input
                    type="file"
                    name="images"
                    multiple
                    accept="image/*"
                    onChange={(e) =>
                      setUserProductForm((prev) => ({
                        ...prev,
                        images: Array.from(e.target.files), // ✅ ensures multiple files are stored
                      }))
                    }
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="ghost"
                  onClick={() => setOpenProductUpdate(false)}
                >
                  Cancel
                </Button>
                <Button onClick={submitProductUpdate}>
                  {saveLoading ? "Saving Changes..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Profile;
