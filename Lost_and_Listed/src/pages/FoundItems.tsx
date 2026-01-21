import React, { useState } from "react";
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
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDispatch, useSelector } from "react-redux";
import useFetchAllFoundItems from "@/hooks/usefetchallFoundItems.tsx";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import Footer from "@/components/Footer.tsx";
import { api } from "@/config/api.ts";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../components/ui/dialog.tsx";
import { toast } from "sonner";
import { setfoundItems } from "@/redux/founditemSlice.ts";
import { useEffect } from "react";
import { useFilterFoundItems } from "@/hooks/useFilterFoundItems.tsx";
import { motion } from "framer-motion";

const FoundItems = () => {
  const { refetchItems } = useFetchAllFoundItems();
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filterItems = useFilterFoundItems();

  const Spinner = () => (
    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
  );

  const dispatch = useDispatch();
  const [Dialogactive, setDialogactive] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [item, setitem] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Other",
    dateFound: "",
    location: "",
    image: null,
  });

  const [filters, setFilters] = useState({
    title: "",
    category: "",
    location: "",
    dateFrom: "",
    dateTo: "",
    isClaimed: "",
  });

  useEffect(() => {
    applyFilters();
  }, []);

  const handleFilterChange = (e: any) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const applyFilters = async () => {
    try {
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== "") params.append(key, value);
      });

      const finalstring = params.toString();
      const res = await filterItems(finalstring);

      if (res.data.success) {
        dispatch(setfoundItems(res.data.data));
        console.log("Filtered items:", res.data.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  // 🧾 Handle input change
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // 📸 Handle image file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setForm({ ...form, image: file });
  };

  const cardClickHandler = async (id: any) => {
    try {
      const res = await api.get(`/found-item/${id}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setitem(res.data.data);
        setDialogactive(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const [claimloading, setclaimloading] = useState(false);
  const [savedItems, setSavedItems] = useState<string[]>([]);

  const handleShare = async (item: any, e: React.MouseEvent) => {
    e.stopPropagation();
    const itemUrl = `${window.location.origin}/found/${item._id}`;
    const shareData = {
      title: item.title,
      text: `Check out this found item: ${item.title}`,
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
        : "Added to saved items",
    );
  };

  const claimHandler = async (id: any) => {
    setclaimloading(true);
    try {
      const res = await api.put(
        `/found-item/claim/${id}`,
        {},
        {
          withCredentials: true,
        },
      );

      if (res.data.success) {
        refetchItems();
        setitem(res.data.data);
        toast.success("Item claimed successfully and Founder notified");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setclaimloading(false);
    }
  };
  const [loadingReport, setloadingReport] = useState(false);

  // 🚀 Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setloadingReport(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      const res = await api.post("/found-item/create", formData, {
        withCredentials: true,
      });

      if (res.data.success) {
        await refetchItems();
        toast.success("Found item reported successfully!");
        setShowAddModal(false);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setloadingReport(false);
      setForm({
        title: "",
        description: "",
        category: "Other",
        dateFound: "",
        location: "",
        image: null,
      });
    }
  };

  const foundItems = useSelector((store: any) => store.founditem.foundItems);

  // Pagination calculations
  const totalPages = Math.ceil((foundItems?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = foundItems?.slice(startIndex, endIndex) || [];

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [foundItems]);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <Navbar />
      <div className="py-12">
        {/* Professional Header with Gradient Accent */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12 relative"
          >
            {/* Background Gradient Accent */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-green-500/10 rounded-3xl blur-3xl -z-10" />

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-green-100 dark:border-gray-700 p-8">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg">
                      <CheckCircle2 className="h-7 w-7 text-white" />
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-green-600 via-green-500 to-emerald-500 bg-clip-text text-transparent">
                      Found Items 
                    </h1>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl leading-relaxed">
                    Help reconnect found items with their rightful owners.
                    Report what you've found or browse to claim your belongings.
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {foundItems?.length || 0} active listings
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" />
                      {foundItems?.filter((item: any) => item.isClaimed)
                        .length || 0}{" "}
                      claimed
                    </span>
                  </div>
                </div>

                <Button
                  onClick={() => setShowAddModal(true)}
                  size="lg"
                  className="gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-6 text-base font-semibold rounded-xl"
                >
                  <Plus className="h-5 w-5" />
                  Report Found Item
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Professional Filters Section */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <Filter className="h-5 w-5 text-green-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Filter & Search
                </h3>
                {Object.values(filters).some((val) => val !== "") && (
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    Active
                  </Badge>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 font-medium"
                onClick={() => setShowFilters((prev) => !prev)}
              >
                {showFilters ? (
                  <>
                    <X className="h-4 w-4 mr-2" /> Hide
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" /> Show Filters
                  </>
                )}
              </Button>
            </div>

            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{
                opacity: showFilters ? 1 : 0,
                height: showFilters ? "auto" : 0,
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 pt-4">
                {/* Title Input with Icon */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    name="title"
                    placeholder="Search title..."
                    onChange={handleFilterChange}
                    value={filters.title}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm"
                  />
                </div>

                {/* Location Input with Icon */}
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    name="location"
                    placeholder="Location..."
                    onChange={handleFilterChange}
                    value={filters.location}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm"
                  />
                </div>

                {/* Category Select with Icon */}
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none z-10" />
                  <select
                    name="category"
                    onChange={handleFilterChange}
                    value={filters.category}
                    className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm cursor-pointer"
                  >
                    <option value="">All Categories</option>
                    <option value="Electronics">📱 Electronics</option>
                    <option value="Documents">📄 Documents</option>
                    <option value="Clothing">👕 Clothing</option>
                    <option value="Accessories">👜 Accessories</option>
                    <option value="Other">📦 Other</option>
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>

                {/* Date From with Icon */}
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  <input
                    type="date"
                    name="dateFrom"
                    onChange={handleFilterChange}
                    value={filters.dateFrom}
                    placeholder="From date"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm"
                  />
                </div>

                {/* Date To with Icon */}
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  <input
                    type="date"
                    name="dateTo"
                    onChange={handleFilterChange}
                    value={filters.dateTo}
                    placeholder="To date"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm"
                  />
                </div>

                {/* Status Select */}
                <div className="relative">
                  <CheckCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none z-10" />
                  <select
                    name="isClaimed"
                    onChange={handleFilterChange}
                    value={filters.isClaimed}
                    className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm cursor-pointer"
                  >
                    <option value="">All Status</option>
                    <option value="true">✅ Claimed</option>
                    <option value="false">❌ Not Claimed</option>
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{
                opacity: showFilters ? 1 : 0,
                height: showFilters ? "auto" : 0,
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
                <Button
                  onClick={applyFilters}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium px-6 shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Apply Filters
                </Button>

                <Button
                  variant="outline"
                  onClick={async () => {
                    setFilters({
                      title: "",
                      category: "",
                      location: "",
                      dateFrom: "",
                      dateTo: "",
                      isClaimed: "",
                    });

                    const res = await filterItems("");
                    if (res.data.success) {
                      dispatch(setfoundItems(res.data.data));
                    }
                  }}
                  className="border-green-300 text-green-600 hover:bg-green-50 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-900/20 font-medium"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear All
                </Button>

                {Object.values(filters).some((val) => val !== "") && (
                  <span className="flex items-center text-sm text-gray-500 dark:text-gray-400 ml-2">
                    <Filter className="h-4 w-4 mr-1" />
                    {
                      Object.values(filters).filter((val) => val !== "").length
                    }{" "}
                    filter(s) active
                  </span>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Found Items Grid */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentItems?.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <div className="inline-block p-8 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                  <MapPin className="h-16 w-16 text-gray-400" />
                </div>
                <h3 className="text-2xl font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  No Found Items Yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Be the first to report a found item!
                </p>
              </div>
            ) : (
              currentItems?.map((item: any, index: number) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <Card
                    className="cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl h-[400px] flex flex-col relative group overflow-hidden border-0 bg-white dark:bg-gray-800 shadow-lg"
                    onClick={() => cardClickHandler(item._id)}
                  >
                    {/* Gradient Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none" />

                    {/* Status Badge */}
                    <Badge
                      className={`absolute top-3 left-3 z-20 font-semibold shadow-lg ${
                        item.isClaimed
                          ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0"
                          : "bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0"
                      }`}
                    >
                      {item.isClaimed ? (
                        <>
                          <CheckCircle2 className="h-3 w-3 mr-1" /> Claimed
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-3 w-3 mr-1" /> Not Claimed
                        </>
                      )}
                    </Badge>

                    {/* Enhanced Action Buttons */}
                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
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

                    <CardContent className="p-0 flex flex-col h-full">
                      {/* Image with Overlay */}
                      <div className="relative overflow-hidden">
                        <img
                          src={item.image?.url}
                          alt={item.title}
                          className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        {/* Image Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      </div>

                      {/* Content Section */}
                      <div className="p-5 flex flex-col flex-grow space-y-3">
                        <div className="space-y-2">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 leading-tight group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                            {item.title}
                          </h3>

                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <Clock className="h-3.5 w-3.5" />
                            <span>
                              {formatDistanceToNow(new Date(item.createdAt), {
                                addSuffix: true,
                              })}
                            </span>
                          </div>
                        </div>

                        {/* Category Badge */}
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="text-xs font-medium border-green-200 text-green-700 dark:border-green-800 dark:text-green-400"
                          >
                            <Tag className="h-3 w-3 mr-1" />
                            {item.category}
                          </Badge>
                        </div>

                        {/* Location */}
                        <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300 mt-auto pt-2 border-t border-gray-100 dark:border-gray-700">
                          <MapPin className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="line-clamp-1 font-medium">
                            {item.location || "Location not specified"}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Professional Pagination */}
        {foundItems?.length > 0 && (
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
              className="px-8 py-3 disabled:opacity-40 disabled:cursor-not-allowed border-2 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-300 dark:hover:border-green-700 transition-all duration-300 font-semibold shadow-sm hover:shadow-md"
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
                <span className="text-green-600 dark:text-green-400 text-lg mx-1">
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
              className="px-8 py-3 disabled:opacity-40 disabled:cursor-not-allowed border-2 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-300 dark:hover:border-green-700 transition-all duration-300 font-semibold shadow-sm hover:shadow-md"
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

      {/* Simple Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-6 rounded-xl shadow-xl w-full max-w-md space-y-4"
          >
            <h2 className="text-2xl font-semibold mb-4">Report Found Item</h2>

            <input
              type="text"
              name="title"
              placeholder="Title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />

            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option>Electronics</option>
              <option>Documents</option>
              <option>Clothing</option>
              <option>Accessories</option>
              <option>Other</option>
            </select>

            <input
              type="date"
              name="dateFound"
              value={form.dateFound}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />

            <input
              type="text"
              name="location"
              placeholder="Location"
              value={form.location}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />

            <input
              type="file"
              accept="image/*"
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
                className="bg-green-500 hover:bg-green-400 text-white"
              >
                {loadingReport && <Spinner />}
                {loadingReport
                  ? "Reporting Found Item ..."
                  : "Report Found Item"}
              </Button>
            </div>
          </form>
        </div>
      )}

      <Dialog open={Dialogactive} onOpenChange={setDialogactive}>
        <DialogContent className="max-w-lg w-[90%] max-h-[80vh] overflow-y-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl">
          {item ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-gray-900 dark:text-white">
                  {item.title}
                </DialogTitle>
                <DialogDescription className="text-gray-700 dark:text-gray-300">
                  {item.description}
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col gap-4 mt-4">
                <img
                  src={item.image?.url}
                  alt={item.title}
                  className="w-full rounded-lg object-cover"
                />

                <div className="text-sm space-y-1">
                  <p className="text-gray-800 dark:text-gray-100">
                    <strong>Category:</strong> {item.category}
                  </p>
                  <p className="text-gray-800 dark:text-gray-100">
                    <strong>Date Found:</strong>{" "}
                    {new Date(item.dateFound).toDateString()}
                  </p>
                  <p className="text-gray-800 dark:text-gray-100">
                    <strong>Location:</strong> {item.location}
                  </p>

                  <div>
                    <Button
                      className="w-full p-1 mt-2 bg-green-500 hover:bg-green-400 dark:bg-green-600 dark:hover:bg-green-500 text-white"
                      onClick={() => claimHandler(item._id)}
                      disabled={item.isClaimed || claimloading}
                    >
                      {claimloading ? (
                        <>
                          <Spinner /> Claiming item...
                        </>
                      ) : item.isClaimed ? (
                        "Claimed!"
                      ) : (
                        "Claim Item"
                      )}
                    </Button>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">
                    <strong>Founder's Info:</strong>
                  </p>

                  <div className="flex items-center gap-3">
                    <img
                      src={item.user?.avatar?.url || "/default-avatar.png"}
                      alt={item.user?.username}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-sm text-gray-800 dark:text-gray-100">
                        {item.user?.fullName || "Unknown User"}
                      </p>
                      <p className="text-gray-500 dark:text-gray-300 text-sm">
                        📧 {item.user?.email || "No email provided"}
                      </p>
                      <p className="text-gray-500 dark:text-gray-300 text-sm">
                        📞 {item.user?.phone || "No phone available"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600">
                    Close
                  </Button>
                </DialogClose>
              </DialogFooter>
            </>
          ) : (
            <p className="text-center py-4 text-gray-700 dark:text-gray-300">
              Loading item details...
            </p>
          )}
        </DialogContent>
      </Dialog>
      <Footer />
    </div>
  );
};

export default FoundItems;
