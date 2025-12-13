import { Users, Calendar, Activity, Clock } from "lucide-react";

import { useNurseDashboard } from "@/hooks/dashboard/useStaffDashboard";

import { DashboardHeader } from "../DashboardHeader";
import { EmptyWidget } from "../EmptyWidget";
import { LoadingWidget, LoadingStatCard } from "../LoadingWidget";
import { StatCard } from "../StatCard";
import { WidgetCard } from "../WidgetCard";


/**
 *
 */
export function NurseDashboard() {
  const { stats, queue, isLoading, loadingQueue } = useNurseDashboard();

  return (
    <div className="space-y-6">
      <DashboardHeader role="nurse" />

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        {isLoading ? (
          Array.from({ length: 2 }).map((_, i) => <LoadingStatCard key={i} />)
        ) : (
          <>
            <StatCard
              title="Patients in Queue"
              value={stats.patientsInQueue}
              icon={Users}
              iconColor="text-primary"
              iconBgColor="bg-primary/10"
            />
            <StatCard
              title="Today's Appointments"
              value={stats.todayAppointments}
              icon={Calendar}
              iconColor="text-info"
              iconBgColor="bg-info/10"
            />
          </>
        )}
      </div>

      {/* Patient Queue */}
      <div className="grid gap-6 lg:grid-cols-2">
        {loadingQueue ? (
          <LoadingWidget />
        ) : (
          <WidgetCard
            title="Patient Queue"
            description="Current waiting patients"
            icon={Users}
            iconColor="text-primary"
          >
            {queue.length === 0 ? (
              <EmptyWidget
                icon={Users}
                title="No patients waiting"
                description="The queue is currently empty"
              />
            ) : (
              <div className="space-y-4">
                {queue.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">{item.queue_number}</span>
                      </div>
                      <div>
                        <p className="font-medium">
                          {item.patients?.first_name} {item.patients?.last_name}
                        </p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          item.priority === "urgent" ? "bg-destructive/10 text-destructive" : "bg-muted"
                        }`}>
                          {item.priority}
                        </span>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      item.status === "waiting" ? "bg-warning/10 text-warning" : "bg-info/10 text-info"
                    }`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </WidgetCard>
        )}

        <WidgetCard
          title="Vitals to Record"
          description="Patients needing vitals"
          icon={Activity}
          iconColor="text-warning"
        >
          <EmptyWidget
            icon={Activity}
            title="All vitals recorded"
            description="No pending vital sign recordings"
          />
        </WidgetCard>
      </div>
    </div>
  );
}
