import { Link } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import AutoSlider from "@/components/AutoSlider";
import usefetchRecentActiivties from "@/hooks/Activty/usefetchRecentActiivties.tsx";

import GetStartedSection from "@/auth/getStarted";

import ItemLost from "@/components/LostItems/ItemLost";
import ReportItem from "@/components/LostItems/ReportItem";
import Searching from "@/components/LostItems/Searching";
import ItemFound from "@/components/LostItems/ItemFound";

import ItemFounded from "@/components/FoundItemsAnimations/ItemFound";
import FoundItemReport from "@/components/FoundItemsAnimations/FoundItemReport";
import Searchowner from "@/components/FoundItemsAnimations/Searchowner";
import Returnitem from "@/components/FoundItemsAnimations/Returnitem";

import BuyItems from "@/components/MarketPlaceAnimations/BuyItems";
import SellItems from "@/components/MarketPlaceAnimations/SellItems";
import ExchangeItems from "@/components/MarketPlaceAnimations/ExchageItems";
import SearchItems from "@/components/MarketPlaceAnimations/SearchItems";
import Footer from "@/components/Footer";

const Home = () => {
  usefetchRecentActiivties();
  const user = useSelector((store: any) => store.auth.user);
  const activities = useSelector((store: any) => store.activity.activities);
  const lostItems = useSelector((store: any) => store.lostitem.lostItems);
  const foundItems = useSelector((store: any) => store.founditem.foundItems);
  const products = useSelector((store: any) => store.product.products);

  const Tips = [
    {
      id: 1,
      title: "Add Complete Details When Listing an Item",
      description:
        "When posting a lost or found item, always provide clear photos, specific details, and location info — such as the date, area, color, or brand. These details make it much easier for others to identify your item and help ensure faster matches. A complete post builds credibility and increases the chances of reuniting with your belongings.",
      icon: "📝",
    },
    {
      id: 2,
      title: "Before You Post, Check the 'Found' Section",
      description:
        "Before adding a lost item, take a quick look at the 'Found Items' section — someone might have already listed it! This small step saves time, avoids duplicate reports, and often leads to faster recoveries. Many users have found their items this way, so make it a habit to search before posting.",
      icon: "🔍",
    },
    {
      id: 3,
      title: "Always Verify Before Claiming an Item",
      description:
        "When you think you’ve found your lost item or someone reaches out to claim one, always verify the ownership carefully. Ask for unique identifiers, receipts, or clear descriptions. This ensures that the item reaches the right person and keeps our community safe, transparent, and trustworthy.",
      icon: "🔐",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-gray-900 dark:text-gray-100 transition-colors duration-500">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative h-[90vh] w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 dark:from-gray-950 dark:via-purple-950 dark:to-indigo-950">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Gradient Orbs */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-20 left-10 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-3xl"
          />

          {/* Floating Particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -30, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
              className="absolute w-1 h-1 bg-white/40 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8 mt-32 md:mt-0"
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span className="text-sm font-medium text-white">
              Campus Community Platform
            </span>
            <span className="px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-yellow-400 to-orange-400 text-black rounded-full">
              NEW
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl xs:text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold leading-tight mb-6 xs:mb-8"
          >
            <span className="inline-block bg-gradient-to-r from-white via-purple-100 to-white text-transparent bg-clip-text">
              Find What’s Lost
            </span>
            <br />
            <motion.span
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear",
              }}
              className="inline-block bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 text-transparent bg-clip-text bg-[length:200%_auto]"
            >
              Give What Still Matters.
            </motion.span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base xs:text-lg sm:text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-8 xs:mb-12 leading-relaxed"
          >
            Your all-in-one campus hub for{" "}
            <span className="font-semibold text-yellow-300">
              lost & found items
            </span>
            ,{" "}
            <span className="font-semibold text-pink-300">
              affordable deals
            </span>
            , and{" "}
            <span className="font-semibold text-purple-300">
              student exchanges
            </span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center mb-10 sm:mb-16"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                asChild
                size="lg"
                className="group relative overflow-hidden bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white border-0 px-5 py-3 xs:px-8 xs:py-6 text-base xs:text-lg font-bold shadow-2xl shadow-red-500/30"
              >
                <Link to="/lost" className="flex items-center gap-2">
                  <motion.span
                    animate={{ rotate: [0, 10, 0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🔍
                  </motion.span>
                  Report Lost
                </Link>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                asChild
                size="lg"
                className="group relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 px-5 py-3 xs:px-8 xs:py-6 text-base xs:text-lg font-bold shadow-2xl shadow-green-500/30"
              >
                <Link to="/found" className="flex items-center gap-2">
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    ✨
                  </motion.span>
                  Report Found
                </Link>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                asChild
                size="lg"
                className="group relative overflow-hidden bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 hover:from-yellow-500 hover:via-orange-500 hover:to-pink-500 text-black border-0 px-5 py-3 xs:px-8 xs:py-6 text-base xs:text-lg font-bold shadow-2xl shadow-yellow-500/40"
              >
                <Link to="/marketplace" className="flex items-center gap-2">
                  <motion.span
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    🛒
                  </motion.span>
                  Marketplace
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-wrap gap-8 justify-center items-center mb-28 sm:mb-0"
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
              <span className="text-3xl font-bold text-white">
                {lostItems?.length || 0}
              </span>
              <span className="text-sm text-white/70">Lost Items</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
              <span className="text-3xl font-bold text-white">
                {foundItems?.length || 0}
              </span>
              <span className="text-sm text-white/70">Found Items</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
              <span className="text-3xl font-bold text-white">
                {products?.length || 0}
              </span>
              <span className="text-sm text-white/70">Products</span>
            </div>
          </motion.div>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
      </section>

      {/* LIVE ACTIVITY TICKER */}
      <section className="w-full py-3 bg-purple-800/90 text-white border-y border-purple-600 overflow-hidden">
        <div className="flex gap-10 whitespace-nowrap animate-marquee px-4">
          {activities.map((log: any) => (
            <span key={log._id} className="text-sm flex items-center gap-2">
              🔔 {log.message} —{" "}
              <span className="text-yellow-300">
                {new Date(log.createdAt).toLocaleString("en-IN", {
                  timeZone: "Asia/Kolkata",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </span>
            </span>
          ))}
        </div>
      </section>

      {!user && <GetStartedSection />}

      {/* WHY SECTION */}
      <section className="relative py-24 px-6 bg-gradient-to-b from-white to-purple-50 dark:from-gray-900 dark:to-purple-950 transition-colors duration-500 overflow-hidden">
        {/* Animated Background Elements */}
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-0 right-0 w-96 h-96 bg-purple-300/10 dark:bg-purple-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            rotate: [360, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-300/10 dark:bg-indigo-500/10 rounded-full blur-3xl"
        />

        <div className="max-w-6xl mx-auto text-center space-y-12 relative z-10">
          {/* Title & Description */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6 mb-20"
          >
            <motion.h2
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent"
            >
              Your Campus Exchange Hub
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            >
              A trusted platform for students to{" "}
              <span className="font-semibold text-purple-600 dark:text-purple-400">
                recover lost belongings
              </span>
              ,{" "}
              <span className="font-semibold text-pink-600 dark:text-pink-400">
                exchange essentials
              </span>
              , and{" "}
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                help each other
              </span>
              . Foster a community where every item finds its way back 🤝
            </motion.p>
          </motion.div>

          {/* LOST ITEMS SECTION */}
          <section className="py-18 px-6 transition-colors duration-500">
            <div className="max-w-6xl mx-auto text-center space-y-12">
              <motion.h2
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="mt-5 text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-red-600 via-orange-500 to-red-600 bg-clip-text text-transparent"
              >
                Reporting a Lost Item
              </motion.h2>
              <div className="flex flex-col md:flex-row items-center justify-center gap-8 mt-12">
                {[
                  { component: <ItemLost />, label: "Lost Item" },
                  { component: <ReportItem />, label: "Report Item" },
                  { component: <Searching />, label: "Searching Item" },
                  { component: <ItemFound />, label: "Item Found & Returned" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.15 }}
                    viewport={{ once: true }}
                    whileHover={{
                      scale: 1.05,
                      rotate: [0, -2, 2, 0],
                      transition: { duration: 0.3 },
                    }}
                    className="w-64 md:w-80 p-4 rounded-2xl bg-gradient-to-br from-red-50/50 to-orange-50/50 dark:from-red-950/30 dark:to-orange-950/30 hover:shadow-2xl hover:shadow-red-200/50 dark:hover:shadow-red-900/30 transition-all duration-300 cursor-pointer"
                  >
                    {item.component}
                    <motion.p
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: i * 0.15 + 0.3 }}
                      className="mt-4 text-gray-700 dark:text-gray-300 font-medium"
                    >
                      {item.label}
                    </motion.p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* FOUND ITEMS SECTION */}
          <section className="py-20 px-6 transition-colors duration-500">
            <div className="max-w-6xl mx-auto text-center space-y-12">
              <motion.h2
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="mt-5 text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-green-600 via-emerald-500 to-teal-600 bg-clip-text text-transparent"
              >
                Reporting a Found Item
              </motion.h2>
              <div className="flex flex-col md:flex-row items-center justify-center gap-8 mt-12">
                {[
                  { component: <ItemFounded />, label: "Found Item" },
                  {
                    component: <FoundItemReport />,
                    label: "Report Found Item",
                  },
                  {
                    component: <Searchowner />,
                    label: "Searching Owner on Claims",
                  },
                  { component: <Returnitem />, label: "Return Item" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: i * 0.15 }}
                    viewport={{ once: true }}
                    whileHover={{
                      y: -10,
                      transition: { duration: 0.2 },
                    }}
                    className="w-64 md:w-80 p-4 rounded-2xl bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/30 dark:to-emerald-950/30 hover:shadow-2xl hover:shadow-green-200/50 dark:hover:shadow-green-900/30 transition-all duration-300 cursor-pointer"
                  >
                    {item.component}
                    <motion.p
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: i * 0.15 + 0.3 }}
                      className="mt-4 text-gray-700 dark:text-gray-300 font-medium"
                    >
                      {item.label}
                    </motion.p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* MARKETPLACE SECTION */}
          <section className="py-18 px-6 transition-colors duration-500">
            <div className="max-w-6xl mx-auto text-center space-y-12">
              <motion.h2
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="mt-5 text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent"
              >
                Marketplace
              </motion.h2>
              <div className="flex flex-col md:flex-row items-center justify-center gap-8 mt-12">
                {[
                  { component: <BuyItems />, label: "Buy Items" },
                  { component: <SellItems />, label: "Sell Items" },
                  { component: <SearchItems />, label: "Search Items" },
                  { component: <ExchangeItems />, label: "Exchange Items" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, rotateY: 90 }}
                    whileInView={{ opacity: 1, rotateY: 0 }}
                    transition={{ duration: 0.6, delay: i * 0.15 }}
                    viewport={{ once: true }}
                    whileHover={{
                      scale: 1.1,
                      boxShadow: "0 20px 40px rgba(79, 70, 229, 0.3)",
                      transition: { duration: 0.3 },
                    }}
                    className="w-64 md:w-80 p-4 rounded-2xl bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/30 dark:to-indigo-950/30 hover:shadow-2xl hover:shadow-blue-200/50 dark:hover:shadow-blue-900/30 transition-all duration-300 cursor-pointer"
                  >
                    {item.component}
                    <motion.p
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: i * 0.15 + 0.3 }}
                      className="mt-4 text-gray-700 dark:text-gray-300 font-medium"
                    >
                      {item.label}
                    </motion.p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </section>

      {/* Trending Marketplace /RECENT LOST / FOUND ITEMS */}

      <section className="py-24 bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
        {/* TRENDING DEALS */}

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-col items-center text-center mb-28 px-6"
        >
          {/* Gradient Heading */}
          <motion.h2
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative flex items-center justify-center gap-2 text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 text-transparent bg-clip-text mb-6 tracking-tight leading-tight py-2"
          >
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Sparkles className="w-8 h-8 text-indigo-400" />
            </motion.div>
            Trending Deals
          </motion.h2>

          {/* Subtext - balanced & breathable */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-gray-500 dark:text-gray-400 mb-14 text-base sm:text-lg leading-relaxed max-w-xl mx-auto"
          >
            Discover what's catching everyone's attention right now — premium
            deals that are trending across the marketplace.
          </motion.p>

          {/* Auto Slider */}
          <AutoSlider
            type="trend"
            items={products}
            getImageUrl={(item) =>
              item.images?.[0]?.url || "/default-product.png"
            }
          />

          {/* View All Link */}
          <motion.div
            whileHover={{ scale: 1.1, x: 5 }}
            transition={{ duration: 0.2 }}
          >
            <Link
              to="/marketplace"
              className="mt-10 inline-block text-sm font-medium text-indigo-500 hover:text-pink-500 transition-colors"
            >
              View All →
            </Link>
          </motion.div>
        </motion.div>

        {/* LOST SECTION */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-col items-center mb-28 px-6 text-center"
        >
          <motion.h2
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 text-transparent bg-clip-text mb-6 tracking-tight leading-tight py-2"
          >
            Recent Lost Items
          </motion.h2>

          {/* Description (clean, centered, with breathing room) */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-gray-500 dark:text-gray-400 mb-14 text-base sm:text-lg leading-relaxed max-w-xl mx-auto"
          >
            Recently reported missing items — help bring them back to their
            owners.
          </motion.p>

          <AutoSlider
            type="lost"
            items={lostItems}
            getImageUrl={(item) => item?.image?.url}
          />

          <Link
            to="/lost"
            className="mt-10 inline-block text-sm font-medium text-red-500 hover:text-pink-500 transition-colors"
          >
            View All →
          </Link>
        </motion.div>

        {/* FOUND SECTION */}
        <div className="flex flex-col items-center mt-28 px-6 text-center">
          <h2 className="relative text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 text-transparent bg-clip-text mb-6 tracking-tight leading-tight py-2">
            Recent Found Items
          </h2>

          <p className="text-gray-500 dark:text-gray-400 mb-14 text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
            Items recently found by kind users — let’s return them to their
            rightful owners.
          </p>

          <AutoSlider
            type="found"
            items={foundItems}
            getImageUrl={(item) => item?.image?.url}
          />

          <motion.div
            whileHover={{ scale: 1.1, x: 5 }}
            transition={{ duration: 0.2 }}
          >
            <Link
              to="/found"
              className="mt-10 inline-block text-sm font-medium text-teal-400 hover:text-cyan-400 transition-colors"
            >
              View All →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Join the campus community */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 text-white py-24 overflow-hidden">
        {/* Floating background light animation */}
        <motion.div
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.15),_transparent_60%)] pointer-events-none"
        />

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-4xl mx-auto text-center space-y-8 relative z-10"
        >
          <motion.h2
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight"
          >
            Join the Campus Exchange Community
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-lg text-white/90 max-w-2xl mx-auto"
          >
            Report lost/found items, browse deals, and connect safely with other
            students.
          </motion.p>

          {/* Animated Buttons */}
          <div className="flex justify-center gap-6 flex-wrap mt-12">
            {/* Lost Item */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/lost">
                <Button className="bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-rose-300/50 transition-all duration-300">
                  Report Lost Item
                </Button>
              </Link>
            </motion.div>

            {/* Found Item */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/found">
                <Button className="bg-gradient-to-r from-green-400 to-emerald-500 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-green-300/50 transition-all duration-300">
                  Report Found Item
                </Button>
              </Link>
            </motion.div>

            {/* Marketplace */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/marketplace">
                <Button className="bg-white text-purple-700 font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-purple-50 hover:shadow-purple-300/30 transition-all duration-300">
                  Marketplace
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Subtle texture overlay */}
        <motion.div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />
      </section>

      {/* 🌟 CAMPUS ACHIEVEMENTS & TOP RETURNERS */}
      <section className="py-24 bg-gradient-to-b from-gray-50 via-gray-100 to-white dark:from-gray-900 dark:via-gray-950 dark:to-black transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6 space-y-20">
          {/* 🏫 Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center space-y-4"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-500 bg-clip-text text-transparent">
              Campus Achievements
            </h2>
            <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed">
              Celebrating our community’s dedication — from reported items to
              top returners, every act of honesty strengthens our campus spirit.
            </p>
          </motion.div>

          {/* 📊 CAMPUS STATS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                icon: "🎒",
                value: 132,
                label: "Lost Items Reported",
                color: "from-red-500 to-pink-400",
              },
              {
                icon: "✅",
                value: 87,
                label: "Items Returned",
                color: "from-green-500 to-emerald-400",
              },
              {
                icon: "👥",
                value: 800,
                label: "Active Students",
                color: "from-blue-500 to-indigo-400",
              },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                viewport={{ once: true }}
                className="group relative p-10 rounded-3xl bg-white dark:bg-gray-800 border border-gray-200/30 dark:border-gray-700/40 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden"
              >
                {/* Gradient glow background */}
                <div
                  className={`absolute inset-0 opacity-10 bg-gradient-to-r ${stat.color} blur-2xl`}
                ></div>

                <div className="relative z-10 flex flex-col items-center">
                  <div className="text-5xl mb-4">{stat.icon}</div>
                  <motion.h3 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
                    {stat.value}
                  </motion.h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300 font-medium text-center">
                    {stat.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* 🏅 TOP RETURNERS */}
          <div className="space-y-12">
            <h3 className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-yellow-500 via-orange-400 to-red-500 bg-clip-text text-transparent">
              Top Returners of the Month
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                {
                  name: "Aman Verma",
                  items: 12,
                  avatar: "https://randomuser.me/api/portraits/men/32.jpg",
                  color: "yellow-400",
                },
                {
                  name: "Riya Sharma",
                  items: 9,
                  avatar: "https://randomuser.me/api/portraits/women/44.jpg",
                  color: "gray-400",
                },
                {
                  name: "Kunal Singh",
                  items: 7,
                  avatar: "https://randomuser.me/api/portraits/men/67.jpg",
                  color: "orange-400",
                },
              ].map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.2 }}
                  viewport={{ once: true }}
                  className="relative p-8 rounded-3xl bg-white dark:bg-gray-800 border border-gray-200/30 dark:border-gray-700/40 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-500 text-center overflow-hidden"
                >
                  {/* Gradient background glow */}
                  <div
                    className={`absolute inset-0 opacity-10 bg-gradient-to-br ${p.color} blur-2xl`}
                  ></div>

                  {/* Badge */}
                  <div
                    className={`relative w-14 h-14 bg-${p.color} rounded-full flex items-center justify-center text-2xl mb-5 mx-auto shadow-md`}
                  >
                    🏅
                  </div>

                  {/* Avatar */}
                  <img
                    src={p.avatar}
                    alt={p.name}
                    className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-white/20 shadow-md"
                  />

                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {p.name}
                  </h4>
                  <p className="mt-1 text-gray-600 dark:text-gray-300 font-medium">
                    {p.items} items returned
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-100 dark:bg-gray-800 transition-colors duration-500">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-8 text-center"
          >
            Campus Tips & News
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-6">
            {Tips.map((tip, i) => (
              <motion.div
                key={tip.id}
                initial={{ opacity: 0, y: 30, rotateX: -20 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: i * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{
                  y: -10,
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
                  transition: { duration: 0.3 },
                }}
                className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg hover:shadow-2xl transition cursor-pointer border-2 border-transparent hover:border-purple-500/30"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{tip.icon}</span>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {tip.title}
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-200 text-sm leading-relaxed">
                  {tip.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
        <div className="max-w-4xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-10"
          >
            Frequently Asked Questions
          </motion.h2>
          <div className="space-y-4">
            {[
              {
                q: "How do I report a lost item?",
                a: "Click on 'Report Lost' and fill out the form. It's that easy!",
              },
              {
                q: "Is my personal info safe?",
                a: "Yes, all your info is kept private and secure.",
              },
              {
                q: "Can I sell items to anyone?",
                a: "Marketplace is campus-only for safe exchanges.",
              },
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                viewport={{ once: true }}
                whileHover={{
                  scale: 1.02,
                  borderColor: "rgba(99, 102, 241, 0.5)",
                  transition: { duration: 0.2 },
                }}
                className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow hover:shadow-lg transition cursor-pointer border-2 border-transparent"
              >
                <h3 className="font-bold text-lg">{faq.q}</h3>
                <p className="text-gray-600 dark:text-gray-200 mt-2">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-100 dark:bg-gray-800 transition-colors duration-500">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-10"
          >
            Trusted By Campus Clubs
          </motion.h2>
          <div className="flex flex-wrap justify-center gap-8 items-center">
            {["Club A", "Club B", "Club C", "Club D"].map((c, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.5, opacity: 0, rotateY: -90 }}
                whileInView={{ scale: 1, opacity: 1, rotateY: 0 }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                viewport={{ once: true }}
                whileHover={{
                  scale: 1.15,
                  rotate: [0, -5, 5, 0],
                  transition: { duration: 0.3 },
                }}
                className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md hover:shadow-xl transition w-36"
              >
                <span className="font-bold text-lg">{c}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-16 bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 text-white overflow-hidden">
        {/* Animated Background */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
        />
        <div className="max-w-3xl mx-auto px-6 text-center space-y-6 relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-extrabold"
          >
            Stay Updated!
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-white/90"
          >
            Subscribe to get the latest lost & found alerts and marketplace
            deals.
          </motion.p>
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex gap-2 flex-col sm:flex-row"
          >
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="email"
              placeholder="Enter your email"
              className="p-3 rounded-lg flex-1 text-black"
            />
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="bg-yellow-400 hover:bg-yellow-500 text-black w-full sm:w-auto">
                Subscribe
              </Button>
            </motion.div>
          </motion.form>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-8"
          >
            What Our Students Say
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40, rotateY: -30 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                transition={{ delay: i * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{
                  y: -10,
                  scale: 1.03,
                  boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
                  transition: { duration: 0.3 },
                }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border hover:shadow-2xl transition border-transparent hover:border-purple-500/30"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-2xl">
                    👤
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                      Student Name
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                      Role / College
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-200 italic">
                  “Dummy testimonial text for now.”
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Home;
