import { Link } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import AutoSlider from "@/components/AutoSlider";
import usefetchRecentActiivties from "@/hooks/Activty/usefetchRecentActiivties.tsx";
import { Facebook, Instagram, Github, Linkedin } from "lucide-react";
import GetStartedSection from "@/auth/getStarted";
import { UseSelector } from "react-redux";

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

const Home = () => {
  usefetchRecentActiivties();
  const user = useSelector((store:any)=>store.auth.user)
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
      <section className="relative h-[90vh] w-full flex items-center justify-center text-white bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="z-10 text-center px-4"
        >
          <motion.h1
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1 }}
            className="text-5xl md:text-7xl font-extrabold leading-tight"
          >
            Find, Buy & Recover <br />
            <span className="text-yellow-300">Campus Essentials</span>
          </motion.h1>

          <p className="mt-6 text-lg md:text-xl text-white/90 max-w-xl mx-auto">
            Lost something? Want affordable student deals? This campus community
            has you.
          </p>

          <div className="mt-8 flex gap-4 justify-center flex-wrap">
            <Button asChild size="lg" variant="secondary">
              <Link to="/lost">Report Lost</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link to="/found">Report Found</Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-yellow-400 hover:bg-yellow-500 text-black"
            >
              <Link to="/marketplace" className="flex items-center gap-2">
                Marketplace <ArrowRight size={18} />
              </Link>
            </Button>
          </div>
        </motion.div>
        <motion.div className="absolute inset-0 opacity-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
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
      <section className="py-24 px-6 bg-gradient-to-b from-white to-purple-50  dark:from-gray-900 dark:to-purple-950 transition-colors duration-500">
        <div className="max-w-6xl mx-auto text-center space-y-12">
          {/* Title & Description */}
          <div className="space-y-6 mb-20 ">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-purple-700 dark:text-purple-300">
              Your Campus Exchange Hub
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              A trusted platform for students to{" "}
              <span className="font-semibold">recover lost belongings</span>,{" "}
              <span className="font-semibold">exchange essentials</span>, and{" "}
              <span className="font-semibold">help each other</span>. Foster a
              community where every item finds its way back 🤝
            </p>
          </div>

          {/* LOST ITEMS SECTION */}
          <section className=" py-18 px-6 transition-colors duration-500">
            <div className="max-w-6xl mx-auto text-center space-y-12">
              <h2 className="mt-5 text-3xl md:text-4xl font-extrabold tracking-tight text-red-600 dark:text-red-400">
                Reporting a Lost Item
              </h2>
              <div className="flex flex-col md:flex-row items-center justify-center gap-8 mt-12">
                <div className="w-64 md:w-80">
                  <ItemLost />
                  <p className="mt-4 text-gray-700 dark:text-gray-300 font-medium">
                    Lost Item
                  </p>
                </div>
                <div className="w-64 md:w-80">
                  <ReportItem />
                  <p className="mt-4 text-gray-700 dark:text-gray-300 font-medium">
                    Report Item
                  </p>
                </div>
                <div className="w-64 md:w-80">
                  <Searching />
                  <p className="mt-4 text-gray-700 dark:text-gray-300 font-medium">
                    Searching Item
                  </p>
                </div>
                <div className="w-64 md:w-80">
                  <ItemFound />

                  <p className="mt-4 text-gray-700 dark:text-gray-300 font-medium">
                    Item Found & Returned
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* FOUND ITEMS SECTION */}
          <section className="py-20 px-6 transition-colors duration-500">
            <div className="max-w-6xl mx-auto text-center space-y-12">
              <h2 className="mt-5 text-3xl md:text-4xl font-extrabold tracking-tight text-green-600 dark:text-green-400">
                Reporting a Found Item
              </h2>
              <div className="flex flex-col md:flex-row items-center justify-center gap-8 mt-12">
                <div className="w-64 md:w-80">
                  <ItemFounded />
                  <p className="mt-4 text-gray-700 dark:text-gray-300 font-medium">
                    Found Item
                  </p>
                </div>
                <div className="w-64 md:w-80">
                  <FoundItemReport />
                  <p className="mt-4 text-gray-700 dark:text-gray-300 font-medium">
                    Report Found Item
                  </p>
                </div>
                <div className="w-64 md:w-80">
                  <Searchowner />
                  <p className="mt-4 text-gray-700 dark:text-gray-300 font-medium">
                    Searching Owner on Claims
                  </p>
                </div>
                <div className="w-64 md:w-80">
                  <Returnitem />
                  <p className="mt-4 text-gray-700 dark:text-gray-300 font-medium">
                    Return Item
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* MARKETPLACE SECTION */}
          <section className="py-18 px-6 transition-colors duration-500">
            <div className="max-w-6xl mx-auto text-center space-y-12">
              <h2 className="mt-5 text-3xl md:text-4xl font-extrabold tracking-tight text-blue-600 dark:text-blue-400">
                Marketplace
              </h2>
              <div className="flex flex-col md:flex-row items-center justify-center gap-8 mt-12">
                <div className="w-64 md:w-80">
                  <BuyItems />
                  <p className="mt-4 text-gray-700 dark:text-gray-300 font-medium">
                    Buy Items
                  </p>
                </div>
                <div className="w-64 md:w-80">
                  <SellItems />
                  <p className="mt-4 text-gray-700 dark:text-gray-300 font-medium">
                    Sell Items
                  </p>
                </div>
                <div className="w-64 md:w-80">
                  <SearchItems />
                  <p className="mt-4 text-gray-700 dark:text-gray-300 font-medium">
                    Search Items
                  </p>
                </div>
                <div className="w-64 md:w-80">
                  <ExchangeItems />
                  <p className="mt-4 text-gray-700 dark:text-gray-300 font-medium">
                    Exchange Items
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>

      {/* Trending Marketplace /RECENT LOST / FOUND ITEMS */}

      <section className="py-24 bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
        {/* TRENDING DEALS */}

        <div className="flex flex-col items-center text-center mb-28 px-6">
          {/* Gradient Heading */}
          <h2 className="relative flex items-center justify-center gap-2 text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 text-transparent bg-clip-text mb-6 tracking-tight leading-tight py-2">
            <Sparkles className="w-8 h-8 text-indigo-400 animate-pulse" />
            Trending Deals
          </h2>

          {/* Subtext - balanced & breathable */}
          <p className="text-gray-500 dark:text-gray-400 mb-14 text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
            Discover what’s catching everyone’s attention right now — premium
            deals that are trending across the marketplace.
          </p>

          {/* Auto Slider */}
          <AutoSlider
            type="trend"
            items={products}
            getImageUrl={(item) =>
              item.images?.[0]?.url || "/default-product.png"
            }
          />

          {/* View All Link */}
          <Link
            to="/marketplace"
            className="mt-10 inline-block text-sm font-medium text-indigo-500 hover:text-pink-500 transition-colors"
          >
            View All →
          </Link>
        </div>

        {/* LOST SECTION */}
        <div className="flex flex-col items-center mb-28 px-6 text-center">
          <h2 className="relative text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 text-transparent bg-clip-text mb-6 tracking-tight leading-tight py-2">
            Recent Lost Items
          </h2>

          {/* Description (clean, centered, with breathing room) */}
          <p className="text-gray-500 dark:text-gray-400 mb-14 text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
            Recently reported missing items — help bring them back to their
            owners.
          </p>

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
        </div>

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

          <Link
            to="/found"
            className="mt-10 inline-block text-sm font-medium text-teal-400 hover:text-cyan-400 transition-colors"
          >
            View All →
          </Link>
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
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-8 text-center">
            Campus Tips & News
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {Tips.map((tip, i) => (
              <motion.div
                key={tip.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2, duration: 0.6 }}
                className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg hover:shadow-2xl transition cursor-pointer"
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
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-10">
            Frequently Asked Questions
          </h2>
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
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow hover:shadow-lg transition cursor-pointer"
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
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-10">
            Trusted By Campus Clubs
          </h2>
          <div className="flex flex-wrap justify-center gap-8 items-center">
            {["Club A", "Club B", "Club C", "Club D"].map((c, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md hover:shadow-xl transition w-36"
              >
                <span className="font-bold text-lg">{c}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-indigo-700 text-white">
        <div className="max-w-3xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-extrabold">Stay Updated!</h2>
          <p className="text-lg text-white/90">
            Subscribe to get the latest lost & found alerts and marketplace
            deals.
          </p>
          <form className="flex gap-2 flex-col sm:flex-row">
            <input
              type="email"
              placeholder="Enter your email"
              className="p-3 rounded-lg flex-1 text-black"
            />
            <Button className="bg-yellow-400 hover:bg-yellow-500 text-black">
              Subscribe
            </Button>
          </form>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-center text-3xl font-bold mb-8">
            What Our Students Say
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2, duration: 0.6 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border hover:shadow-2xl transition"
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

      <footer className="relative bg-gradient-to-b from-gray-900 via-gray-950 to-black text-gray-400 border-t border-gray-800 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
            {/* Brand Section */}
            <div className="space-y-3 text-center md:text-left">
              <h2 className="text-2xl font-bold text-white tracking-wide">
                Lost & Listed
              </h2>
              <p className="text-sm text-gray-400 leading-relaxed">
                A student-powered platform to report lost and found items,
                exchange goods, and stay connected on campus.
              </p>
            </div>

            {/* Quick Links */}
            <div className="text-center md:text-left">
              <h3 className="text-white font-semibold text-lg mb-3">
                Quick Links
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/"
                    className="hover:text-white transition-colors duration-300"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/report-lost"
                    className="hover:text-white transition-colors duration-300"
                  >
                    Report Lost Item
                  </Link>
                </li>
                <li>
                  <Link
                    to="/report-found"
                    className="hover:text-white transition-colors duration-300"
                  >
                    Report Found Item
                  </Link>
                </li>
                <li>
                  <Link
                    to="/marketplace"
                    className="hover:text-white transition-colors duration-300"
                  >
                    Marketplace
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social Media */}
            <div className="text-center md:text-right space-y-3">
              <h3 className="text-white font-semibold text-lg mb-3">
                Connect With Us
              </h3>
              <div className="flex justify-center md:justify-end gap-4">
                <a
                  href="#"
                  className="hover:text-white transition-transform transform hover:scale-110"
                >
                  <Facebook size={20} />
                </a>
                <a
                  href="#"
                  className="hover:text-white transition-transform transform hover:scale-110"
                >
                  <Instagram size={20} />
                </a>
                <a
                  href="#"
                  className="hover:text-white transition-transform transform hover:scale-110"
                >
                  <Linkedin size={20} />
                </a>
                <a
                  href="https://github.com/"
                  className="hover:text-white transition-transform transform hover:scale-110"
                >
                  <Github size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Lost & Listed — Made with{" "}
            <span className="text-red-500">❤️</span> by{" "}
            <span className="font-semibold">team CodeSpire</span>
          </div>
        </div>

        {/* Subtle glow effect */}
        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-70" />
      </footer>
    </div>
  );
};

export default Home;
