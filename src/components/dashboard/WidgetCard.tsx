import { LucideIcon } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { cn } from "@/lib/utils";

interface WidgetCardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  iconColor?: string;
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
}

/**
 *
 * @param root0
 * @param root0.title
 * @param root0.description
 * @param root0.icon
 * @param root0.iconColor
 * @param root0.children
 * @param root0.className
 * @param root0.headerAction
 */
export function WidgetCard({
  title,
  description,
  icon: Icon,
  iconColor = "text-primary",
  children,
  className,
  headerAction,
}: WidgetCardProps) {
  return (
    <Card className={cn("glass-card", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {Icon && <Icon className={cn("h-5 w-5", iconColor)} />}
            {title}
          </CardTitle>
          {headerAction}
        </div>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
