import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, Home } from "lucide-react";
import designimage from "../../public/customimage.png";
import { api } from "@/config/api";
import { motion } from "framer-motion";

const Signup = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [avatar, setAvatar] = useState<File | null>(null);

  const [signupData, setSignupData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    location: "",
  });

  const Spinner = () => (
    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
  );

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (signupData.password !== signupData.confirmPassword)
      return toast.error("Passwords do not match");

    if (signupData.password.length < 6)
      return toast.error("Password must be at least 6 characters");

    if (!avatar) return toast.error("Please upload a profile picture");

    setIsLoading(true);
    try {
      const formData = new FormData();
      Object.entries(signupData).forEach(([k, v]) =>
        formData.append(k, v as string),
      );
      formData.append("avatar", avatar);

      const res = await api.post(`/user/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success("Account created!");
        navigate("/login");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Signup failed");
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
          alt="Signup Poster"
          className="w-full h-full object-contain"
        />
      </div>
      {/* Back to Home Button - Fixed Position */}
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

      {/* Right section */}
      <div className="flex-1 flex items-center justify-center px-4 md:px-14 py-8 md:py-8">
        {/* Form wrapper */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md md:max-w-lg rounded-2xl p-6 md:p-8 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-2xl border border-white/20"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="mb-4 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <h2 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Sign Up
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm md:text-base">
            Join Lost & Listed today
          </p>

          <form
            onSubmit={handleSignup}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <div>
              <Label className="text-gray-700 dark:text-gray-200 text-sm mb-2 block">
                Full Name
              </Label>
              <Input
                placeholder="John Doe"
                value={signupData.fullName}
                onChange={(e) =>
                  setSignupData({ ...signupData, fullName: e.target.value })
                }
                className="text-sm dark:bg-gray-800/50 dark:border-gray-600"
              />
            </div>

            <div>
              <Label className="text-gray-700 dark:text-gray-200 text-sm mb-2 block">
                Username
              </Label>
              <Input
                placeholder="john123"
                value={signupData.username}
                onChange={(e) =>
                  setSignupData({ ...signupData, username: e.target.value })
                }
                className="text-sm dark:bg-gray-800/50 dark:border-gray-600"
              />
            </div>

            <div>
              <Label className="text-gray-700 dark:text-gray-200 text-sm mb-2 block">
                Email
              </Label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={signupData.email}
                onChange={(e) =>
                  setSignupData({ ...signupData, email: e.target.value })
                }
                className="text-sm dark:bg-gray-800/50 dark:border-gray-600"
              />
            </div>

            <div>
              <Label className="text-gray-700 dark:text-gray-200 text-sm mb-2 block">
                Phone
              </Label>
              <Input
                placeholder="+91 XXXXX XXXXX"
                value={signupData.phone}
                onChange={(e) =>
                  setSignupData({ ...signupData, phone: e.target.value })
                }
                className="text-sm dark:bg-gray-800/50 dark:border-gray-600"
              />
            </div>

            <div className="sm:col-span-2">
              <Label className="text-gray-700 dark:text-gray-200 text-sm mb-2 block">
                Location
              </Label>
              <Input
                placeholder="Hostel / City"
                value={signupData.location}
                onChange={(e) =>
                  setSignupData({ ...signupData, location: e.target.value })
                }
                className="text-sm dark:bg-gray-800/50 dark:border-gray-600"
              />
            </div>

            <div className="sm:col-span-2">
              <Label className="text-gray-700 dark:text-gray-200 text-sm mb-2 block">
                Profile Picture
              </Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setAvatar(e.target.files?.[0] || null)}
                className="text-sm dark:bg-gray-800/50 dark:border-gray-600"
              />
            </div>

            <div>
              <Label className="text-gray-700 dark:text-gray-200 text-sm mb-2 block">
                Password
              </Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={signupData.password}
                onChange={(e) =>
                  setSignupData({ ...signupData, password: e.target.value })
                }
                className="text-sm dark:bg-gray-800/50 dark:border-gray-600"
              />
            </div>

            <div>
              <Label className="text-gray-700 dark:text-gray-200 text-sm mb-2 block">
                Confirm Password
              </Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={signupData.confirmPassword}
                onChange={(e) =>
                  setSignupData({
                    ...signupData,
                    confirmPassword: e.target.value,
                  })
                }
                className="text-sm dark:bg-gray-800/50 dark:border-gray-600"
              />
            </div>

            <div className="sm:col-span-2 mt-4">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm shadow-lg"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Spinner />
                    Creating...
                  </div>
                ) : (
                  "Create Account"
                )}
              </Button>

              <p className="text-center text-gray-600 dark:text-gray-300 mt-4 text-xs md:text-sm">
                Already have an account?{" "}
                <span
                  className="text-indigo-600 dark:text-indigo-400 cursor-pointer hover:text-indigo-500 dark:hover:text-indigo-300 font-medium"
                  onClick={() => navigate("/login")}
                >
                  Login here
                </span>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
