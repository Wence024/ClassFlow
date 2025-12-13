import { Users, Calendar, Clock, Activity } from "lucide-react";

import { DashboardHeader } from "../DashboardHeader";
import { EmptyWidget } from "../EmptyWidget";
import { StatCard } from "../StatCard";
import { WidgetCard } from "../WidgetCard";

/**
 *
 */
export function StaffDashboard() {
  return (
    <div className="space-y-6">
      <DashboardHeader role="staff" />

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Active Patients"
          value="0"
          icon={Users}
          iconColor="text-primary"
          iconBgColor="bg-primary/10"
        />
        <StatCard
          title="Today's Tasks"
          value="0"
          icon={Calendar}
          iconColor="text-info"
          iconBgColor="bg-info/10"
        />
        <StatCard
          title="Pending Actions"
          value="0"
          icon={Clock}
          iconColor="text-warning"
          iconBgColor="bg-warning/10"
        />
      </div>

      {/* Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        <WidgetCard
          title="Today's Tasks"
          description="Your assigned tasks"
          icon={Calendar}
          iconColor="text-primary"
        >
          <EmptyWidget
            icon={Calendar}
            title="No tasks assigned"
            description="Tasks will appear here when assigned"
          />
        </WidgetCard>

        <WidgetCard
          title="Recent Activity"
          description="Latest updates"
          icon={Activity}
          iconColor="text-info"
        >
          <EmptyWidget
            icon={Activity}
            title="No recent activity"
            description="Activity will be shown here"
          />
        </WidgetCard>
      </div>
    </div>
  );
}
