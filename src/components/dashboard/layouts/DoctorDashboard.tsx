import { Calendar, FileText, FlaskConical, Clock } from "lucide-react";
import { StatCard } from "../StatCard";
import { WidgetCard } from "../WidgetCard";
import { EmptyWidget } from "../EmptyWidget";
import { LoadingWidget, LoadingStatCard } from "../LoadingWidget";
import { DashboardHeader } from "../DashboardHeader";
import { useDoctorDashboard } from "@/hooks/dashboard/useDoctorDashboard";

/**
 *
 */
export function DoctorDashboard() {
  const { stats, todayAppointments, isLoading, loadingAppointments } = useDoctorDashboard();

  return (
    <div className="space-y-6">
      <DashboardHeader role="doctor" />

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <LoadingStatCard key={i} />)
        ) : (
          <>
            <StatCard
              title="Today's Appointments"
              value={stats.todayAppointments}
              icon={Calendar}
              iconColor="text-primary"
              iconBgColor="bg-primary/10"
            />
            <StatCard
              title="Medical Records"
              value={stats.totalRecords}
              icon={FileText}
              iconColor="text-info"
              iconBgColor="bg-info/10"
            />
            <StatCard
              title="Pending Lab Requests"
              value={stats.pendingLabRequests}
              icon={FlaskConical}
              iconColor="text-warning"
              iconBgColor="bg-warning/10"
            />
          </>
        )}
      </div>

      {/* Appointments */}
      <div className="grid gap-6 lg:grid-cols-2">
        {loadingAppointments ? (
          <LoadingWidget />
        ) : (
          <WidgetCard
            title="Today's Schedule"
            description="Your appointments for today"
            icon={Calendar}
            iconColor="text-primary"
          >
            {todayAppointments.length === 0 ? (
              <EmptyWidget
                icon={Calendar}
                title="No appointments today"
                description="Your schedule is clear for today"
              />
            ) : (
              <div className="space-y-4">
                {todayAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-info/10 flex items-center justify-center">
                        <Clock className="h-4 w-4 text-info" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {apt.patients?.first_name} {apt.patients?.last_name}
                        </p>
                        <p className="text-sm text-muted-foreground">{apt.reason || "Check-up"}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{apt.appointment_time}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        apt.status === "scheduled" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                      }`}>
                        {apt.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </WidgetCard>
        )}

        <WidgetCard
          title="Pending Lab Results"
          description="Lab results awaiting review"
          icon={FlaskConical}
          iconColor="text-warning"
        >
          <EmptyWidget
            icon={FlaskConical}
            title="No pending results"
            description="All lab results have been reviewed"
          />
        </WidgetCard>
      </div>
    </div>
  );
}
