import { Shield, CheckCircle2, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface VerificationBadgeProps {
  verified: boolean;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const VerificationBadge = ({
  verified,
  size = "md",
  showLabel = false,
}: VerificationBadgeProps) => {
  if (!verified) return null;

  const iconSize = size === "sm" ? "h-3 w-3" : size === "md" ? "h-4 w-4" : "h-5 w-5";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-flex items-center gap-1">
            <div className="relative">
              <Shield className={`${iconSize} text-blue-500 fill-blue-500`} />
              <CheckCircle2
                className={`absolute -top-0.5 -right-0.5 ${
                  size === "sm" ? "h-2 w-2" : "h-2.5 w-2.5"
                } text-white`}
              />
            </div>
            {showLabel && (
              <span className="text-xs font-medium text-blue-500">Verified</span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Verified User</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

interface TrustScoreProps {
  score: number;
  totalReturns?: number;
  showDetails?: boolean;
}

export const TrustScore = ({
  score,
  totalReturns = 0,
  showDetails = false,
}: TrustScoreProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500";
    if (score >= 70) return "text-blue-500";
    if (score >= 50) return "text-yellow-500";
    return "text-orange-500";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 70) return "Good";
    if (score >= 50) return "Fair";
    return "New";
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className={`h-4 w-4 ${getScoreColor(score)} fill-current`} />
              <span className={`font-semibold ${getScoreColor(score)}`}>
                {score}
              </span>
            </div>
            {showDetails && (
              <Badge variant="outline" className="text-xs">
                {getScoreLabel(score)}
              </Badge>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            <p className="font-medium">Trust Score: {score}/100</p>
            <p className="text-xs text-muted-foreground">
              Based on {totalReturns} successful returns
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default VerificationBadge;
