import { LucideIcon, Inbox } from "lucide-react";

import { cn } from "@/lib/utils";

interface EmptyWidgetProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

/**
 *
 * @param root0
 * @param root0.icon
 * @param root0.title
 * @param root0.description
 * @param root0.action
 * @param root0.className
 */
export function EmptyWidget({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
}: EmptyWidgetProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-8 text-center", className)}>
      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-muted-foreground" />
      </div>
      <h4 className="font-medium text-foreground">{title}</h4>
      {description && (
        <p className="text-sm text-muted-foreground mt-1 max-w-xs">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
