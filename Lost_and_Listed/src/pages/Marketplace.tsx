import React, { useState, useEffect } from "react";
import {
  Plus,
  Heart,
  Share2,
  Search,
  Filter,
  X,
  MapPin,
  Calendar,
  Tag,
  Clock,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { api } from "@/config/api";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import Footer from "@/components/Footer.tsx";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog.tsx";

import useFetchAllProducts from "@/hooks/MarketPlace/usefetchallProducts";
import { useDispatch, useSelector } from "react-redux";
import { setproducts } from "@/redux/productSlice";

const Marketplace = () => {
  const { refetchProducts } = useFetchAllProducts();
  const items = useSelector((store: any) => store.product.products);
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const Spinner = () => (
    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
  );

  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setloading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Other",
    price: "",
    condition: "new",
    images: [],
  });

  const handleFormChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, images: Array.from(e.target.files) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setloading(true);

    try {
      const formData = new FormData();
      for (const key in form) {
        if (key === "images") {
          form.images.forEach((file) => formData.append("images", file));
        } else {
          formData.append(key, form[key]);
        }
      }

      const res = await api.post("/products/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      await refetchProducts();
      toast.success("Product listed successfully!");
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Failed to create item");
    } finally {
      setShowAddModal(false);
      setloading(false);
      setForm({
        title: "",
        description: "",
        category: "Other",
        price: "",
        condition: "",
        images: [],
      });
    }
  };

  const [showCardDetails, setshowCardDetails] = useState(false);
  const [selectedItem, setSelectedItem] = useState({
    title: "",
    description: "",
    category: "Other",
    price: "",
    condition: "",
    images: [],
    seller: null,
    isSold: false,
  });

  const [savedItems, setSavedItems] = useState<string[]>([]);

  const handleShare = async (item: any, e: React.MouseEvent) => {
    e.stopPropagation();
    const itemUrl = `${window.location.origin}/marketplace/${item._id}`;
    const shareData = {
      title: item.title,
      text: `Check out this product: ${item.title} - ₹${item.price}`,
      url: itemUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast.success("Shared successfully!");
      } else {
        await navigator.clipboard.writeText(itemUrl);
        toast.success("Link copied to clipboard!");
      }
    } catch (error: any) {
      if (error.name !== "AbortError") {
        toast.error("Failed to share");
      }
    }
  };

  const handleSaveItem = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId],
    );
    toast.success(
      savedItems.includes(itemId)
        ? "Removed from saved items"
        : "Saved to your collection",
    );
  };

  const handleCardClick = async (id: any) => {
    try {
      setshowCardDetails(true); //for dialogue box opening wha se hi close hoga
      const res = await api.get(`/products/${id}`);
      setSelectedItem(res.data.product);
    } catch (err) {
      console.error("Failed to fetch item details:", err);
    }
  };

  //for showing multiple images in details card

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextImage = () => {
    if (selectedItem?.images?.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === selectedItem.images.length - 1 ? 0 : prev + 1,
      );
    }
  };

  const handlePrevImage = () => {
    if (selectedItem?.images?.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? selectedItem.images.length - 1 : prev - 1,
      );
    }
  };

  useEffect(() => {
    if (showCardDetails) setCurrentImageIndex(0);
  }, [showCardDetails]);

  //Filters section
  const [filters, setFilters] = useState({
    title: "",
    category: "",
    condition: "",
    priceMin: "",
    priceMax: "",
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = async () => {
    try {
      const query = new URLSearchParams();

      Object.keys(filters).forEach((key) => {
        if (filters[key]) query.append(key, filters[key]);
      });

      const res = await api.get(`/products/filter?${query.toString()}`, {
        withCredentials: true,
      });

      dispatch(setproducts(res.data.products));
    } catch (error) {
      console.error("Error fetching filtered products:", error);
    }
  };
  const resetFilters = async () => {
    setFilters({
      title: "",
      category: "",
      condition: "",
      priceMin: "",
      priceMax: "",
    });
    refetchProducts();
  };
  const [showFilters, setShowFilters] = useState(false);

  // Pagination calculations
  const totalPages = Math.ceil((items?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items?.slice(startIndex, endIndex) || [];

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [items]);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <Navbar />

      {/* Professional Header Section */}
      <div className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 border border-blue-100 dark:border-gray-700 shadow-2xl rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 pointer-events-none" />
              <CardContent className="relative p-8">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                        <ShoppingBag className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                          Marketplace
                        </h1>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" />
                          <TrendingUp className="h-4 w-4 text-blue-500" />
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl leading-relaxed">
                      A campus marketplace to trade all your unused or pre-loved
                      items safely and affordably
                    </p>

                    {/* Statistics */}
                    <div className="flex flex-wrap gap-6 pt-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                          <ShoppingBag className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {items?.length || 0}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Total Products
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                          <Tag className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {items?.filter((item) => !item.isSold).length || 0}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Available
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => setShowAddModal(true)}
                    size="lg"
                    className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-6 text-lg rounded-xl"
                  >
                    <Plus className="h-5 w-5" />
                    List an Item
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Professional Filters Section */}
      <div className="pb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="backdrop-blur-lg bg-white/60 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 shadow-lg rounded-xl overflow-hidden">
              <CardContent className="p-6">
                {/* Filter Toggle Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                      <Filter className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Filter Products
                    </h3>
                  </div>
                  <Button
                    onClick={() => setShowFilters((prev) => !prev)}
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  >
                    {showFilters ? (
                      <>
                        <X className="h-4 w-4 mr-2" /> Hide
                      </>
                    ) : (
                      <>
                        <Filter className="h-4 w-4 mr-2" /> Show
                      </>
                    )}
                  </Button>
                </div>

                {/* Collapsible Filter Grid */}
                <motion.div
                  initial={false}
                  animate={{
                    height: showFilters ? "auto" : 0,
                    opacity: showFilters ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                      {/* Search Input */}
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          name="title"
                          placeholder="Search products..."
                          value={filters.title}
                          onChange={handleFilterChange}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>

                      {/* Category Select */}
                      <div className="relative">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none z-10" />
                        <select
                          name="category"
                          value={filters.category}
                          onChange={handleFilterChange}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                          <option value="">All Categories</option>
                          <option value="Electronics">Electronics</option>
                          <option value="Books">Books</option>
                          <option value="Accessories">Accessories</option>
                          <option value="Clothing">Clothing</option>
                          <option value="Home">Home</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      {/* Condition Select */}
                      <div className="relative">
                        <ShoppingBag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none z-10" />
                        <select
                          name="condition"
                          value={filters.condition}
                          onChange={handleFilterChange}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                          <option value="">All Conditions</option>
                          <option value="new">New</option>
                          <option value="like_new">Like New</option>
                          <option value="very_good">Very Good</option>
                          <option value="good">Good</option>
                          <option value="fair">Fair</option>
                          <option value="for_parts">For Parts</option>
                        </select>
                      </div>

                      {/* Min Price */}
                      <input
                        type="number"
                        name="priceMin"
                        placeholder="Min Price (₹)"
                        value={filters.priceMin}
                        onChange={handleFilterChange}
                        className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />

                      {/* Max Price */}
                      <input
                        type="number"
                        name="priceMax"
                        placeholder="Max Price (₹)"
                        value={filters.priceMax}
                        onChange={handleFilterChange}
                        className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 pt-2">
                      <Button
                        onClick={applyFilters}
                        className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all"
                      >
                        <Search className="h-4 w-4" />
                        Apply Filters
                      </Button>
                      <Button
                        onClick={resetFilters}
                        variant="outline"
                        className="gap-2 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      >
                        <X className="h-4 w-4" />
                        Reset
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Items Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(itemsPerPage)].map((_, i) => (
              <Card key={i} className="h-[380px] animate-pulse">
                <CardContent className="p-4 sm:p-6">
                  <div className="w-full h-48 bg-gray-300 dark:bg-gray-700 rounded-lg mb-4"></div>
                  <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : items?.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-block p-8 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
              <span className="text-6xl">🛒</span>
            </div>
            <h3 className="text-2xl font-semibold mb-2 text-gray-700 dark:text-gray-300">
              No Products Available
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Be the first to list an item for sale!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentItems?.map((item: any, index: number) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Card
                  className="group cursor-pointer h-[400px] overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border-0 bg-white dark:bg-gray-800 shadow-lg"
                  onClick={() => handleCardClick(item._id)}
                >
                  {/* Action Buttons */}
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-9 w-9 bg-white/95 hover:bg-white backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-600 dark:bg-gray-800/95 dark:hover:bg-gray-800"
                      onClick={(e) => handleSaveItem(item._id, e)}
                    >
                      <Heart
                        className={`h-4 w-4 transition-all ${
                          savedItems.includes(item._id)
                            ? "fill-red-500 text-red-500 scale-110"
                            : "text-gray-600 dark:text-gray-300"
                        }`}
                      />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-9 w-9 bg-white/95 hover:bg-white backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-600 dark:bg-gray-800/95 dark:hover:bg-gray-800"
                      onClick={(e) => handleShare(item, e)}
                    >
                      <Share2 className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                    </Button>
                  </div>

                  <CardContent className="p-0 h-full flex flex-col">
                    {/* Image Section */}
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={item.images[0]?.url}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Status Badge */}
                      <Badge
                        className={`absolute top-3 left-3 z-20 font-semibold shadow-lg ${
                          item.isSold
                            ? "bg-gradient-to-r from-red-500 to-orange-500 text-white border-0"
                            : "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0"
                        }`}
                      >
                        {item.isSold ? "Sold" : "Available"}
                      </Badge>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 p-5 space-y-3">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <Clock className="h-4 w-4" />
                          <span>
                            {formatDistanceToNow(new Date(item.createdAt), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="secondary"
                              className="gap-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-700 font-medium"
                            >
                              <Tag className="h-3 w-3" />
                              {item.category}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                              ₹{item.price}
                            </p>
                          </div>
                        </div>
                      </div>

                      {item.condition && (
                        <Badge
                          variant="outline"
                          className="gap-1 text-xs text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600"
                        >
                          <ShoppingBag className="h-3 w-3" />
                          {item.condition.replace("_", " ")}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Professional Pagination */}
        {items?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 flex justify-center items-center gap-4"
          >
            <Button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              variant="outline"
              size="lg"
              className="px-8 py-3 disabled:opacity-40 disabled:cursor-not-allowed border-2 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 font-semibold shadow-sm hover:shadow-md"
            >
              <svg
                className="h-5 w-5 mr-2"
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

            <div className="bg-white dark:bg-gray-800 px-6 py-3 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Page{" "}
                <span className="text-blue-600 dark:text-blue-400 text-lg mx-1">
                  {currentPage}
                </span>{" "}
                of{" "}
                <span className="text-gray-900 dark:text-gray-100">
                  {totalPages}
                </span>
              </span>
            </div>

            <Button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              variant="outline"
              size="lg"
              className="px-8 py-3 disabled:opacity-40 disabled:cursor-not-allowed border-2 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 font-semibold shadow-sm hover:shadow-md"
            >
              Next
              <svg
                className="h-5 w-5 ml-2"
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
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-6 rounded-xl shadow-xl w-full max-w-md space-y-4"
          >
            <h2 className="text-2xl font-semibold mb-4">List New Item</h2>

            <input
              name="title"
              placeholder="Item Title"
              value={form.title}
              onChange={handleFormChange}
              className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              required
            />

            <textarea
              name="description"
              placeholder="Item Description"
              value={form.description}
              onChange={handleFormChange}
              className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />

            <select
              name="condition"
              value={form.condition}
              onChange={handleFormChange}
              className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="new">New</option>
              <option value="like_new">Like New</option>
              <option value="very_good">Very Good</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="for_parts">For Parts</option>
            </select>

            <input
              type="number"
              name="price"
              placeholder="Price (₹)"
              value={form.price}
              onChange={handleFormChange}
              required
              className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />

            <select
              name="category"
              value={form.category}
              onChange={handleFormChange}
              className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option>Electronics</option>
              <option>Books</option>
              <option>Accessories</option>
              <option>Clothing</option>
              <option>Home</option>
              <option>Other</option>
            </select>

            <input
              type="file"
              accept="image/*"
              multiple
              className="text-gray-900 dark:text-gray-100"
              onChange={handleFileChange}
            />

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                onClick={() => setShowAddModal(false)}
                variant="secondary"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white"
              >
                {loading && <Spinner />} {loading ? "Listing..." : "List Item"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Item Detail Modal */}
      {selectedItem && (
        <Dialog
          open={showCardDetails}
          onOpenChange={() => setshowCardDetails(false)}
        >
          <DialogContent className="max-w-xl w-[90%] max-h-[80vh] overflow-y-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-gray-900 dark:text-white">
                {selectedItem?.title}
              </DialogTitle>
              <DialogDescription className="text-gray-700 dark:text-gray-300">
                {selectedItem?.description}
              </DialogDescription>
            </DialogHeader>

            {/* Image Carousel */}
            {selectedItem?.images?.length > 0 && (
              <div className="relative w-full flex items-center justify-center">
                <img
                  src={selectedItem?.images[currentImageIndex]?.url}
                  alt={selectedItem?.title}
                  className="w-full rounded-lg my-4 object-contain"
                />

                {/* Left Button */}
                <button
                  onClick={handlePrevImage}
                  className="absolute left-2 bg-black bg-opacity-40 text-white p-2 rounded-full hover:bg-opacity-60"
                >
                  ‹
                </button>

                {/* Right Button */}
                <button
                  onClick={handleNextImage}
                  className="absolute right-2 bg-black bg-opacity-40 text-white p-2 rounded-full hover:bg-opacity-60"
                >
                  ›
                </button>

                {/* Image Counter */}
                <div className="absolute bottom-3 bg-black bg-opacity-50 text-white text-xs px-3 py-1 rounded-full">
                  {currentImageIndex + 1} / {selectedItem.images.length}
                </div>
              </div>
            )}

            <p className="my-2">
              <Badge
                className={`px-5 py-1 text-sm font-semibold rounded-full shadow-md ${
                  selectedItem.isSold
                    ? "bg-red-500 text-white dark:bg-red-600"
                    : "bg-green-500 text-white dark:bg-green-600"
                }`}
              >
                {selectedItem.isSold ? "Sold" : "Available"}
              </Badge>
            </p>

            <p className="text-gray-800 dark:text-gray-100">
              <strong>Price:</strong> ₹{selectedItem?.price}
            </p>
            <p className="text-gray-800 dark:text-gray-100">
              <strong>Category:</strong> {selectedItem?.category}
            </p>
            <p className="text-gray-800 dark:text-gray-100">
              <strong>Condition:</strong> {selectedItem?.condition}
            </p>

            {/* Seller Information Section */}
            <div className="border-t border-gray-300 dark:border-gray-700 pt-4">
              <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">
                <strong>Seller's Info:</strong>
              </p>

              <div className="flex items-center gap-3">
                <img
                  src={
                    selectedItem.seller?.avatar?.url || "/default-avatar.png"
                  }
                  alt={selectedItem.seller?.fullName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-sm text-gray-800 dark:text-gray-100">
                    {selectedItem.seller?.fullName || "Unknown Seller"}
                  </p>
                  <p className="text-gray-500 dark:text-gray-300 text-sm">
                    📧 {selectedItem.seller?.email || "No email provided"}
                  </p>
                  <p className="text-gray-500 dark:text-gray-300 text-sm">
                    📞 {selectedItem.seller?.phone || "No phone available"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 my-4">
              <div className="flex-1 border-t border-gray-300 dark:border-gray-700"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                🛍️ Contact the seller to purchase this item
              </p>
              <div className="flex-1 border-t border-gray-300 dark:border-gray-700"></div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600">
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      <Footer />
    </div>
  );
};

export default Marketplace;
