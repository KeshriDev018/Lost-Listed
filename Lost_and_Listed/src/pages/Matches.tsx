import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Navbar from "@/components/Navbar";
import MatchCard from "@/components/MatchCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface Match {
  _id: string;
  lostItem: any;
  foundItem: any;
  matchScore: number;
  matchReasons: string[];
  createdAt: string;
}

const Matches = () => {
  const { user } = useSelector((store: any) => store.auth);
  const [myMatches, setMyMatches] = useState<Match[]>([]);
  const [allMatches, setAllMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("my-matches");

  useEffect(() => {
    if (user) {
      loadMatches();
    }
  }, [user, activeTab]);

  const loadMatches = async () => {
    setLoading(true);
    try {
      const endpoint =
        activeTab === "my-matches"
          ? "/api/v1/matches/my-matches"
          : "/api/v1/matches/all";

      const response = await axios.get(endpoint, { withCredentials: true });

      if (response.data.success) {
        if (activeTab === "my-matches") {
          setMyMatches(response.data.data);
        } else {
          setAllMatches(response.data.data);
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load matches");
    } finally {
      setLoading(false);
    }
  };

  const handleViewMatch = (match: Match) => {
    // Navigate to a detail view or open dialog
    console.log("View match:", match);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-purple-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Smart Matches
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            AI-powered matching between lost and found items based on category,
            location, time, and description similarity
          </p>
        </motion.div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="my-matches">My Matches</TabsTrigger>
            <TabsTrigger value="all-matches">All Matches</TabsTrigger>
          </TabsList>

          <TabsContent value="my-matches">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
              </div>
            ) : myMatches.length === 0 ? (
              <div className="text-center py-20">
                <Sparkles className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-20" />
                <h3 className="text-xl font-semibold mb-2">No matches yet</h3>
                <p className="text-muted-foreground">
                  We'll notify you when we find potential matches for your items
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {myMatches.map((match, index) => (
                  <motion.div
                    key={match._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <MatchCard
                      lostItem={match.lostItem}
                      foundItem={match.foundItem}
                      matchScore={match.matchScore}
                      onViewMatch={() => handleViewMatch(match)}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="all-matches">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
              </div>
            ) : allMatches.length === 0 ? (
              <div className="text-center py-20">
                <Sparkles className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-20" />
                <h3 className="text-xl font-semibold mb-2">
                  No matches available
                </h3>
                <p className="text-muted-foreground">
                  Check back later for new potential matches
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {allMatches.map((match, index) => (
                  <motion.div
                    key={match._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <MatchCard
                      lostItem={match.lostItem}
                      foundItem={match.foundItem}
                      matchScore={match.matchScore}
                      onViewMatch={() => handleViewMatch(match)}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Matches;
