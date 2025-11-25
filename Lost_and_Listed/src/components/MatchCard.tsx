import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

interface MatchCardProps {
  lostItem: any;
  foundItem: any;
  matchScore: number;
  onViewMatch: () => void;
}

const MatchCard = ({ lostItem, foundItem, matchScore, onViewMatch }: MatchCardProps) => {
  const getMatchColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-orange-500";
  };

  const getMatchLabel = (score: number) => {
    if (score >= 80) return "High Match";
    if (score >= 60) return "Good Match";
    return "Possible Match";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group"
    >
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-2 border-purple-100 dark:border-purple-900">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className={`h-5 w-5 ${getMatchColor(matchScore)}`} />
              <span className={`font-semibold ${getMatchColor(matchScore)}`}>
                {getMatchLabel(matchScore)}
              </span>
            </div>
            <Badge variant="outline" className="font-mono">
              {matchScore}% Match
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-center">
            {/* Lost Item */}
            <div className="space-y-2">
              <Badge variant="destructive" className="mb-2">
                Lost
              </Badge>
              <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                {lostItem.images?.[0] ? (
                  <img
                    src={lostItem.images[0]}
                    alt={lostItem.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    No Image
                  </div>
                )}
              </div>
              <h4 className="font-semibold line-clamp-1">{lostItem.title}</h4>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {lostItem.location}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDistanceToNow(new Date(lostItem.createdAt), {
                    addSuffix: true,
                  })}
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex items-center justify-center">
              <motion.div
                animate={{ x: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <ArrowRight className="h-8 w-8 text-purple-500" />
              </motion.div>
            </div>

            {/* Found Item */}
            <div className="space-y-2">
              <Badge variant="default" className="mb-2 bg-green-500">
                Found
              </Badge>
              <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                {foundItem.images?.[0] ? (
                  <img
                    src={foundItem.images[0]}
                    alt={foundItem.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    No Image
                  </div>
                )}
              </div>
              <h4 className="font-semibold line-clamp-1">{foundItem.title}</h4>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {foundItem.location}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDistanceToNow(new Date(foundItem.createdAt), {
                    addSuffix: true,
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Match Details */}
          <div className="mt-4 pt-4 border-t space-y-2">
            <p className="text-sm font-medium">Match Reasons:</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-xs">
                Same Category
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Similar Location
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Close Time Frame
              </Badge>
            </div>
          </div>

          {/* Action Button */}
          <Button
            onClick={onViewMatch}
            className="w-full mt-4 group-hover:bg-purple-600"
          >
            View Details & Contact
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MatchCard;
