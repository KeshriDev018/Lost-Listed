import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Home } from "lucide-react";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/authSlice";
import designimage from "../../public/customimage.png";
import { api } from "@/config/api";
import { motion } from "framer-motion";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const Spinner = () => (
    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
  );

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await api.post(`/user/login`, loginData);

      if (res.data.success) {
        toast.success("Login successful!");
        dispatch(setUser(res.data.data.user));
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  return (
    <div className="relative w-full h-screen flex flex-col md:flex-row bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 dark:from-gray-950 dark:via-purple-950 dark:to-indigo-950 overflow-hidden">
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

      {/* LEFT IMAGE (only on desktop) */}
      <div className="relative w-full md:w-[45%] h-1/3 md:h-full hidden md:flex items-center justify-center z-10">
        <motion.img
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          src={designimage}
          alt="Login Poster"
          className="w-full h-full object-contain"
        />
      </div>

      {/* RIGHT SECTION */}
      <div className="relative w-full md:w-[55%] h-full flex items-center justify-center px-6 md:px-14 z-10">
        {/* MOBILE CARD — visible only on mobile */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="md:hidden w-full max-w-md bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20 dark:border-gray-700/50 mx-auto mt-10"
        >
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1">
            Welcome Back
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Login to continue
          </p>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
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
                className="pl-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-300 dark:border-gray-700 text-sm"
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
                required
              />
            </div>

            {/* PASSWORD WITH ICON AND TOGGLE, ICONS EVEN LOWER */}
            <div className="relative mb-4">
              <Label className="text-gray-700 dark:text-gray-300 text-sm">
                Password
              </Label>
              <span
                style={{
                  position: "absolute",
                  left: 12,
                  top: "75%",
                  transform: "translateY(-50%)",
                  color: "#aaa",
                }}
              >
                <Lock size={18} />
              </span>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pl-10 pr-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-300 dark:border-gray-700 text-sm"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                required
              />
              {/* Eye toggle */}
              <span
                style={{
                  position: "absolute",
                  right: 12,
                  top: "75%",
                  transform: "translateY(-50%)",
                  color: "#aaa",
                  cursor: "pointer",
                }}
                onClick={handleTogglePassword}
                tabIndex={0}
                role="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>

            {/* REMEMBER ME & FORGOT PASSWORD */}
            <div className="flex justify-between items-center mb-2">
              <label className="flex items-center text-sm text-gray-600 dark:text-gray-400 cursor-pointer gap-1.5">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe((prev) => !prev)}
                  className="mr-1 accent-indigo-600"
                />
                Remember Me
              </label>
              <Link
                to="/forgotpassword"
                className="text-indigo-600 text-xs hover:underline dark:text-indigo-400"
              >
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm"
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>

            <p className="text-center text-gray-600 dark:text-gray-400 mt-4 text-xs">
              Don’t have an account?{" "}
              <span
                className="text-indigo-600 cursor-pointer dark:text-indigo-400"
                onClick={() => navigate("/signup")}
              >
                Sign up here
              </span>
            </p>
          </form>
        </motion.div>

        {/* DESKTOP FORM — mobile:hidden */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden md:block w-full max-w-lg bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/50"
        >
          <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Login to continue
          </p>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            {/* EMAIL WITH ICON */}
            <div className="relative mb-4">
              <Label className="text-gray-700 dark:text-gray-300">Email</Label>
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
                className="pl-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-300 dark:border-gray-700"
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
                required
              />
            </div>

            {/* PASSWORD WITH ICON AND TOGGLE, ICONS EVEN LOWER */}
            <div className="relative mb-4">
              <Label className="dark:text-gray-300">Password</Label>
              <span
                style={{
                  position: "absolute",
                  left: 12,
                  top: "75%",
                  transform: "translateY(-50%)",
                  color: "#aaa",
                }}
              >
                <Lock size={18} />
              </span>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pl-10 pr-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-300 dark:border-gray-700"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                required
              />
              {/* Eye toggle */}
              <span
                style={{
                  position: "absolute",
                  right: 12,
                  top: "75%",
                  transform: "translateY(-50%)",
                  color: "#aaa",
                  cursor: "pointer",
                }}
                onClick={handleTogglePassword}
                tabIndex={0}
                role="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>

            {/* REMEMBER ME & FORGOT PASSWORD */}
            <div className="flex justify-between items-center mb-2">
              <label className="flex items-center text-sm text-gray-600 dark:text-gray-400 cursor-pointer gap-1.5">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe((prev) => !prev)}
                  className="mr-1 accent-indigo-600"
                />
                Remember Me
              </label>
              <Link
                to="/forgotpassword"
                className="text-indigo-600 text-sm hover:underline dark:text-indigo-400"
              >
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Spinner />
                  Logging in...
                </div>
              ) : (
                "Login"
              )}
            </Button>

            <p className="text-center text-gray-600 dark:text-gray-300 mt-4">
              Don't have an account?{" "}
              <span
                className="text-indigo-600 dark:text-indigo-400 cursor-pointer font-semibold hover:underline"
                onClick={() => navigate("/signup")}
              >
                Sign up here
              </span>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
