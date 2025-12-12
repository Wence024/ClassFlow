import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
}

/**
 *
 * @param root0
 * @param root0.title
 * @param root0.value
 * @param root0.change
 * @param root0.changeType
 * @param root0.icon
 * @param root0.iconColor
 * @param root0.iconBgColor
 */
export function StatCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  iconColor = "text-primary",
  iconBgColor = "bg-primary/10",
}: StatCardProps) {
  return (
    <Card className="glass-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {change && (
              <div className="flex items-center gap-1 mt-1">
                {changeType === "positive" ? (
                  <TrendingUp className="h-3 w-3 text-success" />
                ) : changeType === "negative" ? (
                  <TrendingDown className="h-3 w-3 text-destructive" />
                ) : null}
                <span
                  className={cn(
                    "text-xs",
                    changeType === "positive" && "text-success",
                    changeType === "negative" && "text-destructive",
                    changeType === "neutral" && "text-muted-foreground"
                  )}
                >
                  {change}
                </span>
              </div>
            )}
          </div>
          <div
            className={cn(
              "h-12 w-12 rounded-full flex items-center justify-center",
              iconBgColor
            )}
          >
            <Icon className={cn("h-6 w-6", iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
