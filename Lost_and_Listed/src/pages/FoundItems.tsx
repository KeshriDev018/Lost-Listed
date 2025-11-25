import React, { useState } from "react";
import { Plus, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDispatch, useSelector } from "react-redux";
import useFetchAllFoundItems from "@/hooks/usefetchallFoundItems.tsx";
import axios from "axios";
import { MapPin } from "lucide-react";
import { formatDistanceToNow } from "date-fns";


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
   const {refetchItems} = useFetchAllFoundItems();
   const [showFilters, setShowFilters] = useState(false);

  const filterItems = useFilterFoundItems()

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
    >
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
      const res = await axios.get(`/api/v1/found-item/${id}`, {
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

  const [claimloading,setclaimloading]= useState(false);
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
    setSavedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
    toast.success(
      savedItems.includes(itemId) 
        ? "Removed from saved items" 
        : "Added to saved items"
    );
  };

  const claimHandler = async (id: any) => {
    setclaimloading(true);
    try {
     const res = await axios.put(`/api/v1/found-item/claim/${id}`,{}, {
        withCredentials: true,
      });
       
      if(res.data.success){

        refetchItems()
        setitem(res.data.data);
        toast.success("Item claimed successfully and Founder notified");

      }
      
      

    } catch (error) {
     toast.error(error.response?.data?.message || "Something went wrong");
    }
    finally{
      setclaimloading(false);
    }
  };
   const[loadingReport,setloadingReport] = useState(false)
   

  // 🚀 Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setloadingReport(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      const res = await axios.post("/api/v1/found-item/create", formData, {
        withCredentials: true,
      });

      if (res.data.success) {
        await refetchItems()
        toast.success("Found item reported successfully!");
        setShowAddModal(false);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
    finally{
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

  return (
    <div className="min-h-screen bg-background bg-green-50 dark:bg-gray-900">
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
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-green-600">
              Found Items
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Report items found by you and help others find them.
            </p>
          </div>

          <Button
            onClick={() => setShowAddModal(true)}
            className="gap-2 bg-green-500 hover:bg-green-600 text-white w-full sm:w-auto transition-colors duration-300"
          >
            <Plus className="h-4 w-4" />
            Report Found Item
          </Button>
        </div>
        {/* Filters Section */}
        <div className="mb-6">
          {/* Toggle Button for All Screens */}
          <div className="mb-4 flex justify-between items-center">
            <Button
              variant="outline"
              size="sm"
              className="text-green-600 border-green-400 hover:bg-green-500 dark:hover:bg-gray-800"
              onClick={() => setShowFilters((prev) => !prev)}
            >
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          </div>

          {/* Filters Grid (Animated for Found Items) */}
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: showFilters ? 1 : 0,
              height: showFilters ? "auto" : 0,
            }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 overflow-hidden"
          >
            {/* Title Input */}
            <input
              name="title"
              placeholder="Search Title"
              onChange={handleFilterChange}
              value={filters.title}
              className="border p-2 rounded text-sm bg-white dark:bg-gray-800 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-300 transition-all duration-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />

            {/* Location Input */}
            <input
              name="location"
              placeholder="Location"
              onChange={handleFilterChange}
              value={filters.location}
              className="border p-2 rounded text-sm bg-white dark:bg-gray-800 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-300 transition-all duration-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />

            {/* Category Select */}
            <div className="relative">
              <select
                name="category"
                onChange={handleFilterChange}
                value={filters.category}
                className="w-full border p-2 rounded text-sm bg-white dark:bg-gray-800 text-black dark:text-white appearance-none pr-8 transition-all duration-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              >
                <option value="">All Categories</option>
                <option value="Electronics">Electronics</option>
                <option value="Documents">Documents</option>
                <option value="Clothing">Clothing</option>
                <option value="Accessories">Accessories</option>
                <option value="Other">Other</option>
              </select>
              <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300">
                ▼
              </span>
            </div>

            {/* Date From */}
            <input
              type="date"
              name="dateFrom"
              onChange={handleFilterChange}
              value={filters.dateFrom}
              className="border p-2 rounded text-sm bg-white dark:bg-gray-800 text-black dark:text-white transition-all duration-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />

            {/* Date To */}
            <input
              type="date"
              name="dateTo"
              onChange={handleFilterChange}
              value={filters.dateTo}
              className="border p-2 rounded text-sm bg-white dark:bg-gray-800 text-black dark:text-white transition-all duration-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />

            {/* Is Claimed Select */}
            <div className="relative">
              <select
                name="isClaimed"
                onChange={handleFilterChange}
                value={filters.isClaimed}
                className="w-full border p-2 rounded text-sm bg-white dark:bg-gray-800 text-black dark:text-white appearance-none pr-8 transition-all duration-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              >
                <option value="">All</option>
                <option value="true">Claimed</option>
                <option value="false">Not Claimed</option>
              </select>
              <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300">
                ▼
              </span>
            </div>
          </motion.div>
        </div>

        {/* Filter Buttons - hidden when filters collapsed */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: showFilters ? 1 : 0,
            height: showFilters ? "auto" : 0,
          }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="mb-4 flex flex-wrap gap-2 overflow-hidden"
        >
          <Button
            onClick={applyFilters}
            className="bg-green-500 hover:bg-green-400 text-white w-full sm:w-auto transition-colors duration-300"
          >
            Apply Filters
          </Button>

          <Button
            variant="secondary"
            className="bg-green-500 text-white hover:bg-green-400 w-full sm:w-auto transition-colors duration-300"
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
          >
            Reset Filters
          </Button>
        </motion.div>

        {/* Found Items Grid */}
        <div className="mt-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {foundItems?.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <div className="inline-block p-8 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                <MapPin className="h-16 w-16 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold mb-2 text-gray-700 dark:text-gray-300">No Found Items Yet</h3>
              <p className="text-gray-500 dark:text-gray-400">Be the first to report a found item!</p>
            </div>
          ) : (
            foundItems?.map((item: any, index: number) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card
                  className="cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:shadow-lg h-[370px] flex flex-col relative group"
                  onClick={() => cardClickHandler(item._id)}
                >
                  <Badge 
                    className={`absolute bottom-3 right-3 z-10 ${
                      item.isClaimed 
                        ? "bg-green-500 hover:bg-green-600 text-white" 
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                    }`}
                  >
                    {item.isClaimed ? "Claimed" : "Not Claimed"}
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

                  <CardContent className="p-4 sm:p-6 flex flex-col flex-grow">
                    <img
                      src={item.image?.url}
                      alt={item.title}
                      className="w-full h-48 object-cover rounded-lg mb-4 transition-transform duration-300 hover:scale-105"
                    />
                    <div className="flex flex-col flex-grow">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-lg sm:text-xl font-semibold transition-colors duration-300 hover:text-blue-600 truncate flex-1">
                          {item.title}
                        </h3>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 mb-2 text-sm overflow-hidden text-ellipsis line-clamp-2">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mt-auto">
                        <MapPin size={16} className="text-blue-500" />
                        <span className="truncate">
                          <strong>Found at: </strong>
                          {item.location}
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
    </div>
  );
};

export default FoundItems;
