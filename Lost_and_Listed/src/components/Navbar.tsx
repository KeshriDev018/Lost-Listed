import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  Package,
  ShoppingBag,
  User,
  LogOut,
  Moon,
  Sun,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "@/redux/authSlice";
import axios from "axios";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import NotificationBell from "./NotificationBell";
import GlobalSearch from "./GlobalSearch";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((store: any) => store.auth);

  const isActive = (path: any) => location.pathname === path;

  // --- Dark mode state ---
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved === "true" ? true : false;
  });

  // --- Search dialog state ---
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  const handleLogout = async () => {
    try {
      await axios.post(`/api/v1/user/logout`, {}, { withCredentials: true });
      dispatch(setUser(null));
      navigate("/");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // --- Mobile Menu State ---
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/*Logo */}
          <Link to="/" className="flex items-center gap-3">
            <motion.div className="h-12 w-12 flex items-center justify-center rounded-xl bg-purple-700 shadow-lg">
              <Search className="h-6 w-6 text-white" />
              {/* Lost item animation */}
              <motion.div
                className="h-3 w-3 bg-pink-400 rounded-full absolute"
                initial={{ x: -30, y: 0, opacity: 0 }}
                animate={{ x: 0, y: 0, opacity: 1 }}
                transition={{
                  repeat: Infinity,
                  repeatType: "mirror",
                  duration: 2,
                }}
              />
            </motion.div>
            <span className="text-2xl font-extrabold text-purple-700 drop-shadow-lg">
              Lost & Listed
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="ghost"
              className={`
      px-4 py-2 rounded-md flex items-center gap-2 transition-all duration-200
      ${
        isActive("/lost")
          ? "bg-purple-600 hover:bg-purple-500 text-white shadow-md"
          : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-100 hover:text-black dark:hover:bg-gray-700"
      }
    `}
              asChild
            >
              <Link to="/lost" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Lost Items
              </Link>
            </Button>

            <Button
              variant="ghost"
              className={`
      px-4 py-2 rounded-md flex items-center gap-2 transition-all duration-200
      ${
        isActive("/found")
          ? "bg-purple-600 hover:bg-purple-500 text-white shadow-md"
          : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-100 hover:text-black dark:hover:bg-gray-700"
      }
    `}
              asChild
            >
              <Link to="/found" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Found Items
              </Link>
            </Button>

            <Button
              variant="ghost"
              className={`
      px-4 py-2 rounded-md flex items-center gap-2 transition-all duration-200
      ${
        isActive("/marketplace")
          ? "bg-purple-600 hover:bg-purple-500 text-white shadow-md"
          : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-100 hover:text-black dark:hover:bg-gray-700"
      }
    `}
              asChild
            >
              <Link to="/marketplace" className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                Marketplace
              </Link>
            </Button>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Global Search Button */}
            {
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(true)}
                title="Search"
              >
                <Search className="h-5 w-5" />
              </Button>
            }

            {/* Notifications */}
            {user && <NotificationBell />}

            {/* Dark Mode Toggle */}
            <motion.button
              onClick={() => setDarkMode(!darkMode)}
              className="relative w-16 h-8 rounded-full flex items-center transition-colors duration-300 bg-gradient-to-r from-blue-400 to-blue-500 dark:from-indigo-600 dark:to-purple-700 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Sliding toggle */}
              <motion.div
                className="absolute w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center"
                animate={{
                  x: darkMode ? 32 : 2,
                }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                }}
              >
                {darkMode ? (
                  <Moon className="w-4 h-4 text-indigo-600" />
                ) : (
                  <Sun className="w-4 h-4 text-yellow-500" />
                )}
              </motion.div>

              {/* Background icons */}
              <motion.div
                className="absolute left-2"
                animate={{ opacity: darkMode ? 0 : 1 }}
                transition={{ duration: 0.2 }}
              >
                <Sun className="w-4 h-4 text-yellow-100" />
              </motion.div>
              <motion.div
                className="absolute right-2"
                animate={{ opacity: darkMode ? 1 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <Moon className="w-4 h-4 text-purple-200" />
              </motion.div>
            </motion.button>

            {/* Avatar always visible */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-2 py-1 rounded-lg transition">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border border-gray-300 dark:border-gray-600">
                      <img
                        src={user.avatar?.url || "/default-avatar.png"}
                        alt="avatar"
                        className="w-full h-full object-cover select-none"
                        draggable="false"
                      />
                    </div>
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-40 mt-2">
                  <DropdownMenuItem
                    onClick={() => navigate("/profile")}
                    className="cursor-pointer"
                  >
                    <User className="h-4 w-4 mr-2" />
                    View Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-red-500 focus:text-red-500"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-accent"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Desktop Login/Signup */}
            {!user && (
              <div className="hidden md:flex gap-2">
                <Button variant="outline" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Content */}
        {menuOpen && (
          <div className="flex flex-col gap-2 pb-4 md:hidden animate-slideDown mt-2">
            <Button
              variant="ghost"
              className={`
      px-4 py-2 rounded-md flex items-center gap-2 transition-all duration-200
      ${
        isActive("/lost")
          ? "bg-purple-600 hover:bg-purple-500 text-white shadow-md"
          : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-100 hover:text-black dark:hover:bg-gray-700"
      }
    `}
              asChild
            >
              <Link to="/lost" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Lost Items
              </Link>
            </Button>

            <Button
              variant="ghost"
              className={`
      px-4 py-2 rounded-md flex items-center gap-2 transition-all duration-200
      ${
        isActive("/found")
          ? "bg-purple-600 hover:bg-purple-500 text-white shadow-md"
          : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-100 hover:text-black dark:hover:bg-gray-700"
      }
    `}
              asChild
            >
              <Link to="/found" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Found Items
              </Link>
            </Button>

            <Button
              variant="ghost"
              className={`
      px-4 py-2 rounded-md flex items-center gap-2 transition-all duration-200
      ${
        isActive("/marketplace")
          ? "bg-purple-600 hover:bg-purple-500 text-white shadow-md"
          : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-100 hover:text-black dark:hover:bg-gray-700"
      }
    `}
              asChild
            >
              <Link to="/marketplace" className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                Marketplace
              </Link>
            </Button>

            {/* Only Login/Signup collapse on mobile */}
            {!user && (
              <div className="flex flex-col gap-2 mt-2">
                <Button variant="outline" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Global Search Dialog */}
      <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </nav>
  );
};

export default Navbar;
