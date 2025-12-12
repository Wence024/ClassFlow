import { Calendar, Pill, Receipt, Clock } from "lucide-react";
import { StatCard } from "../StatCard";
import { WidgetCard } from "../WidgetCard";
import { EmptyWidget } from "../EmptyWidget";
import { LoadingWidget, LoadingStatCard } from "../LoadingWidget";
import { DashboardHeader } from "../DashboardHeader";
import { usePatientDashboard } from "@/hooks/dashboard/usePatientDashboard";
import { format } from "date-fns";

export function PatientDashboard() {
  const { stats, upcomingAppointments, isLoading, loadingAppointments } = usePatientDashboard();

  return (
    <div className="space-y-6">
      <DashboardHeader role="patient" />

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <LoadingStatCard key={i} />)
        ) : (
          <>
            <StatCard
              title="Upcoming Appointments"
              value={stats.upcomingAppointments}
              icon={Calendar}
              iconColor="text-primary"
              iconBgColor="bg-primary/10"
            />
            <StatCard
              title="Active Prescriptions"
              value={stats.activePrescriptions}
              icon={Pill}
              iconColor="text-info"
              iconBgColor="bg-info/10"
            />
            <StatCard
              title="Pending Bills"
              value={stats.pendingBills}
              icon={Receipt}
              iconColor="text-warning"
              iconBgColor="bg-warning/10"
            />
          </>
        )}
      </div>

      {/* Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {loadingAppointments ? (
          <LoadingWidget />
        ) : (
          <WidgetCard
            title="Upcoming Appointments"
            description="Your scheduled appointments"
            icon={Calendar}
            iconColor="text-primary"
          >
            {upcomingAppointments.length === 0 ? (
              <EmptyWidget
                icon={Calendar}
                title="No upcoming appointments"
                description="Schedule an appointment with your doctor"
              />
            ) : (
              <div className="space-y-4">
                {upcomingAppointments.map((apt: any) => (
                  <div
                    key={apt.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-info/10 flex items-center justify-center">
                        <Clock className="h-4 w-4 text-info" />
                      </div>
                      <div>
                        <p className="font-medium">{apt.reason || "Appointment"}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(apt.appointment_date), "MMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{apt.appointment_time}</p>
                      <span className="text-xs text-muted-foreground">{apt.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </WidgetCard>
        )}

        <WidgetCard
          title="Active Prescriptions"
          description="Your current medications"
          icon={Pill}
          iconColor="text-info"
        >
          <EmptyWidget
            icon={Pill}
            title="No active prescriptions"
            description="Your prescriptions will appear here"
          />
        </WidgetCard>
      </div>
    </div>
  );
}
