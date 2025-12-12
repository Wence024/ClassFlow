import { FlaskConical, AlertCircle, CheckCircle } from "lucide-react";
import { StatCard } from "../StatCard";
import { WidgetCard } from "../WidgetCard";
import { EmptyWidget } from "../EmptyWidget";
import { LoadingWidget, LoadingStatCard } from "../LoadingWidget";
import { DashboardHeader } from "../DashboardHeader";
import { useLabTechDashboard } from "@/hooks/dashboard/useStaffDashboard";
import { format } from "date-fns";

/**
 *
 */
export function LabTechDashboard() {
  const { stats, pendingRequests, isLoading, loadingRequests } = useLabTechDashboard();

  return (
    <div className="space-y-6">
      <DashboardHeader role="lab_tech" />

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <LoadingStatCard key={i} />)
        ) : (
          <>
            <StatCard
              title="Pending Requests"
              value={stats.pendingRequests}
              icon={FlaskConical}
              iconColor="text-primary"
              iconBgColor="bg-primary/10"
            />
            <StatCard
              title="Urgent Requests"
              value={stats.urgentRequests}
              icon={AlertCircle}
              iconColor="text-destructive"
              iconBgColor="bg-destructive/10"
            />
            <StatCard
              title="Completed Today"
              value={stats.completedToday}
              icon={CheckCircle}
              iconColor="text-success"
              iconBgColor="bg-success/10"
            />
          </>
        )}
      </div>

      {/* Pending Lab Requests */}
      <div className="grid gap-6 lg:grid-cols-2">
        {loadingRequests ? (
          <LoadingWidget />
        ) : (
          <WidgetCard
            title="Pending Lab Requests"
            description="Tests awaiting processing"
            icon={FlaskConical}
            iconColor="text-primary"
          >
            {pendingRequests.length === 0 ? (
              <EmptyWidget
                icon={FlaskConical}
                title="No pending requests"
                description="All lab tests have been processed"
              />
            ) : (
              <div className="space-y-4">
                {pendingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        req.priority === "urgent" ? "bg-destructive/10" : "bg-primary/10"
                      }`}>
                        <FlaskConical className={`h-4 w-4 ${
                          req.priority === "urgent" ? "text-destructive" : "text-primary"
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium">
                          {req.patients?.first_name} {req.patients?.last_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(req.requested_date), "MMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      req.priority === "urgent" 
                        ? "bg-destructive/10 text-destructive" 
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {req.priority}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </WidgetCard>
        )}

        <WidgetCard
          title="Urgent Requests"
          description="High priority lab tests"
          icon={AlertCircle}
          iconColor="text-destructive"
        >
          <EmptyWidget
            icon={AlertCircle}
            title="No urgent requests"
            description="No high priority tests pending"
          />
        </WidgetCard>
      </div>
    </div>
  );
}
