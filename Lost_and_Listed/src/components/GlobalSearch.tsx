import { useState, useEffect, useRef } from "react";
import { Search, X, Clock, TrendingUp, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

interface SearchResult {
  _id: string;
  title: string;
  category: string;
  type: "lost" | "found" | "product";
  image?: string;
  location?: string;
  createdAt: string;
}

interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const GlobalSearch = ({ open, onOpenChange }: GlobalSearchProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const categories = [
    { value: "all", label: "All" },
    { value: "lost", label: "Lost Items" },
    { value: "found", label: "Found Items" },
    { value: "product", label: "Marketplace" },
  ];

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    if (query.length > 2) {
      const debounce = setTimeout(() => {
        performSearch();
      }, 300);
      return () => clearTimeout(debounce);
    } else {
      setResults([]);
    }
  }, [query, selectedCategory]);

  const performSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/v1/search/global`, {
        params: { q: query, category: selectedCategory },
        withCredentials: true,
      });

      if (response.data.success) {
        setResults(response.data.data);
      }
    } catch (error: any) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveRecentSearch = (searchQuery: string) => {
    const updated = [
      searchQuery,
      ...recentSearches.filter((s) => s !== searchQuery),
    ].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const handleResultClick = (result: SearchResult) => {
    saveRecentSearch(query);
    onOpenChange(false);
    setQuery("");

    switch (result.type) {
      case "lost":
        navigate("/lost");
        break;
      case "found":
        navigate("/found");
        break;
      case "product":
        navigate("/marketplace");
        break;
    }
  };

  const handleRecentSearchClick = (search: string) => {
    setQuery(search);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0">
        <DialogHeader className="p-4 pb-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              ref={inputRef}
              placeholder="Search lost items, found items, products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-10 h-12 text-base"
            />
            {query && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2"
                onClick={() => setQuery("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </DialogHeader>

        {/* Category Filters */}
        <div className="flex gap-2 px-4 py-3 border-b overflow-x-auto">
          {categories.map((cat) => (
            <Badge
              key={cat.value}
              variant={selectedCategory === cat.value ? "default" : "outline"}
              className="cursor-pointer whitespace-nowrap"
              onClick={() => setSelectedCategory(cat.value)}
            >
              {cat.label}
            </Badge>
          ))}
        </div>

        {/* Results */}
        <ScrollArea className="max-h-96">
          <div className="p-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : query.length > 2 && results.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground mb-3">
                  Found {results.length} results
                </p>
                <AnimatePresence>
                  {results.map((result, index) => (
                    <motion.div
                      key={result._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors"
                      onClick={() => handleResultClick(result)}
                    >
                      {result.image && (
                        <img
                          src={result.image}
                          alt={result.title}
                          className="w-12 h-12 object-cover rounded"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{result.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {result.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {result.category}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : query.length > 2 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p>No results found</p>
              </div>
            ) : recentSearches.length > 0 ? (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Clock className="h-4 w-4" />
                    Recent Searches
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearRecentSearches}
                    className="h-7 text-xs"
                  >
                    Clear
                  </Button>
                </div>
                <div className="space-y-1">
                  {recentSearches.map((search, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 rounded hover:bg-accent cursor-pointer"
                      onClick={() => handleRecentSearchClick(search)}
                    >
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{search}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p className="text-sm">Start typing to search...</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default GlobalSearch;
