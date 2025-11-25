import React, { useState, useEffect } from "react";
import { Plus, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import axios from "axios";
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

  const handleFormChange = (e:any) => {
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

      const res = await axios.post("/api/v1/products/create", formData, {
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
    seller:null,
    isSold:false
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
    setSavedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
    toast.success(
      savedItems.includes(itemId) 
        ? "Removed from saved items" 
        : "Saved to your collection"
    );
  };

  const handleCardClick = async (id: any) => {
    try {
      setshowCardDetails(true); //for dialogue box opening wha se hi close hoga
      const res = await axios.get(`/api/v1/products/${id}`);
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
        prev === selectedItem.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handlePrevImage = () => {
    if (selectedItem?.images?.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? selectedItem.images.length - 1 : prev - 1
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

      const res = await axios.get(
        `/api/v1/products/filter?${query.toString()}`,
        {
          withCredentials: true,
        }
      );

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


  return (
    <div className="min-h-screen bg-background bg-blue-50 dark:bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div
          className={`mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4
              transition-all duration-700 ease-out transform
              opacity-0 translate-y-4`}
          ref={(el) => {
            if (el)
              setTimeout(
                () => el.classList.remove("opacity-0", "translate-y-4"),
                50
              );
          }}
        >
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-blue-600">
              Marketplace
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Buy and sell second-hand items within your college community.
            </p>
          </div>
          <Button
            onClick={() => setShowAddModal(true)}
            className="gap-2 bg-blue-500 hover:bg-blue-600 text-white w-full sm:w-auto transition-colors duration-300"
          >
            <Plus className="h-4 w-4" />
            List an Item
          </Button>
        </div>

        {/* Filters Section */}
        <div className="mb-6">
          {/* Toggle Button for All Screens */}
          <div className="mb-4 flex justify-between items-center">
            <Button
              variant="outline"
              size="sm"
              className="  text-blue-700 border-blue-400 hover:bg-blue-500 hover:text-white dark:hover:bg-gray-800 transition-colors duration-300"
              onClick={() => setShowFilters((prev) => !prev)}
            >
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          </div>

          {/* Filters Grid (collapsible on all screens) */}
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: showFilters ? 1 : 0,
              height: showFilters ? "auto" : 0,
            }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 overflow-hidden"
          >
            <input
              name="title"
              placeholder="Search title"
              value={filters.title}
              onChange={handleFilterChange}
              className="border p-2 rounded text-sm bg-white dark:bg-gray-800 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-300 transition-all duration-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />

            <div className="relative">
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full border p-2 rounded text-sm bg-white dark:bg-gray-800 text-black dark:text-white appearance-none pr-8 transition-all duration-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              >
                <option value="">All Categories</option>
                <option value="Electronics">Electronics</option>
                <option value="Books">Books</option>
                <option value="Furniture">Accessories</option>
                <option value="Clothing">Clothing</option>
                <option value="Home">Home</option>
                <option value="Other">Other</option>
              </select>
              <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300">
                ▼
              </span>
            </div>

            <div className="relative">
              <select
                name="condition"
                value={filters.condition}
                onChange={handleFilterChange}
                className="w-full border p-2 rounded text-sm bg-white dark:bg-gray-800 text-black dark:text-white appearance-none pr-8 transition-all duration-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              >
                <option value="">All Conditions</option>
                <option value="new">New</option>
                <option value="like_new">Like New</option>
                <option value="very_good">Very Good</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="for_parts">For Parts</option>
              </select>
              <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300">
                ▼
              </span>
            </div>

            <input
              type="number"
              name="priceMin"
              placeholder="Min Price"
              value={filters.priceMin}
              onChange={handleFilterChange}
              className="border p-2 rounded text-sm bg-white dark:bg-gray-800 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-300 transition-all duration-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />

            <input
              type="number"
              name="priceMax"
              placeholder="Max Price"
              value={filters.priceMax}
              onChange={handleFilterChange}
              className="border p-2 rounded text-sm bg-white dark:bg-gray-800 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-300 transition-all duration-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </motion.div>

          {/* Filter Buttons - hidden when filters collapsed */}
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: showFilters ? 1 : 0,
              height: showFilters ? "auto" : 0,
            }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="flex flex-wrap gap-2 mt-4 overflow-hidden"
          >
            <Button
              onClick={applyFilters}
              className="bg-blue-500 hover:bg-blue-600 text-white w-full sm:w-auto transition-colors duration-300"
            >
              Apply Filters
            </Button>

            <Button
              onClick={resetFilters}
              variant="secondary"
              className="bg-blue-500 text-white hover:bg-blue-600 w-full sm:w-auto transition-colors duration-300"
            >
              Reset Filters
            </Button>
          </motion.div>
        </div>

        {/* Items Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
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
            <h3 className="text-2xl font-semibold mb-2 text-gray-700 dark:text-gray-300">No Products Available</h3>
            <p className="text-gray-500 dark:text-gray-400">Be the first to list an item for sale!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {items?.map((item: any, index: number) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card
                  className="cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:shadow-lg h-[380px] flex flex-col relative group"
                  onClick={() => handleCardClick(item._id)}
                >
                  <Badge 
                    className={`absolute bottom-3 right-3 z-10 ${
                      item.isSold 
                        ? "bg-red-500 hover:bg-red-600 text-white" 
                        : "bg-green-500 hover:bg-green-600 text-white"
                    }`}
                  >
                    {item.isSold ? "Sold" : "Available"}
                  </Badge>
                  
                  {/* Action Buttons */}
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8 bg-white/90 hover:bg-white shadow-lg"
                      onClick={(e) => handleSaveItem(item._id, e)}
                    >
                      <Heart 
                        className={`h-4 w-4 ${
                          savedItems.includes(item._id) 
                            ? "fill-red-500 text-red-500" 
                            : "text-gray-600"
                        }`} 
                      />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8 bg-white/90 hover:bg-white shadow-lg"
                      onClick={(e) => handleShare(item, e)}
                    >
                      <Share2 className="h-4 w-4 text-gray-600" />
                    </Button>
                  </div>

                  <CardContent className="p-4 sm:p-6 flex flex-col justify-between h-full">
                    <div>
                      <img
                        src={item.images[0]?.url}
                        alt={item.title}
                        className="w-full h-48 object-cover rounded-lg mb-4 transition-transform duration-300 hover:scale-105"
                      />
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-lg sm:text-xl font-semibold transition-colors duration-300 hover:text-blue-600 truncate flex-1">
                          {item.title}
                        </h3>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                      </p>
                      <p
                        className="text-gray-600 dark:text-gray-400 mb-2 text-sm line-clamp-2"
                        title={item.description}
                      >
                        {item.description}
                      </p>
                    </div>

                    <p className="text-blue-600 font-semibold transition-colors duration-300 hover:text-blue-700">
                      ₹{item.price}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
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
        <Footer/>
    </div>
  );
};

export default Marketplace;
