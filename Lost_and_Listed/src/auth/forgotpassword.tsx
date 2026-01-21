import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { api } from "@/config/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, Mail, Home } from "lucide-react";
import designimage from "../../public/customimage.png";
import { motion } from "framer-motion";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await api.post("/user/forgot-password", { email });
      if (res.data.success) {
        toast.success("Recovery link sent to your email!");
        setEmail(""); // clear input on success
      } else {
        toast.error(res.data.message || "Failed to send recovery link.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send recovery link.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen flex flex-col md:flex-row bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 overflow-hidden">
      {/* ANIMATED BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Gradient Orbs */}
        <motion.div
          className="absolute top-20 left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-20 left-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.4, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* BACK TO HOME BUTTON */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-6 left-6 z-50"
      >
        <Button
          onClick={() => navigate("/")}
          className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-xl"
          size="icon"
        >
          <Home className="w-5 h-5" />
        </Button>
      </motion.div>

      {/* LEFT IMAGE (only on desktop) */}
      <div className="relative w-full md:w-[45%] h-1/3 md:h-full hidden md:flex items-center justify-center z-10">
        <motion.img
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          src={designimage}
          alt="Forgot Poster"
          className="w-full h-full object-contain"
        />
      </div>

      {/* RIGHT SECTION */}
      <div className="relative w-full md:w-[55%] h-full flex items-center justify-center px-6 md:px-14 z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md md:max-w-lg bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl p-6 md:p-8 shadow-2xl border border-white/20 dark:border-gray-700/50 mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Forgot Password
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Enter your email and get a password recovery link.
          </p>
          <form onSubmit={handleForgotPassword} className="flex flex-col gap-4">
            {/* EMAIL WITH ICON */}
            <div className="relative mb-4">
              <Label className="text-gray-700 dark:text-gray-300 text-sm">
                Email
              </Label>
              <span
                style={{
                  position: "absolute",
                  left: 12,
                  top: "65%",
                  transform: "translateY(-50%)",
                  color: "#aaa",
                }}
              >
                <Mail size={18} />
              </span>
              <Input
                type="email"
                placeholder="you@example.com"
                className="pl-10 dark:bg-gray-800/50 dark:border-gray-600 mt-1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Recovery Link"}
            </Button>
            <p className="text-center text-gray-600 dark:text-gray-400 mt-4">
              <span
                className="text-indigo-600 dark:text-indigo-400 cursor-pointer hover:text-indigo-500 dark:hover:text-indigo-300 font-medium"
                onClick={() => navigate("/login")}
              >
                Back to login
              </span>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
