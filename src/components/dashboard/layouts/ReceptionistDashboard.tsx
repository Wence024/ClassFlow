import { Calendar, Users, UserPlus, Clock } from "lucide-react";
import { StatCard } from "../StatCard";
import { WidgetCard } from "../WidgetCard";
import { EmptyWidget } from "../EmptyWidget";
import { LoadingWidget, LoadingStatCard } from "../LoadingWidget";
import { DashboardHeader } from "../DashboardHeader";
import { useReceptionistDashboard } from "@/hooks/dashboard/useStaffDashboard";

export function ReceptionistDashboard() {
  const { stats, todayAppointments, isLoading, loadingAppointments } = useReceptionistDashboard();

  return (
    <div className="space-y-6">
      <DashboardHeader role="receptionist" />

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
              title="Patients Waiting"
              value={stats.patientsWaiting}
              icon={Users}
              iconColor="text-warning"
              iconBgColor="bg-warning/10"
            />
            <StatCard
              title="Total Patients"
              value={stats.totalPatients}
              icon={UserPlus}
              iconColor="text-info"
              iconBgColor="bg-info/10"
            />
          </>
        )}
      </div>

      {/* Appointments & Queue */}
      <div className="grid gap-6 lg:grid-cols-2">
        {loadingAppointments ? (
          <LoadingWidget />
        ) : (
          <WidgetCard
            title="Today's Appointments"
            description="Scheduled for today"
            icon={Calendar}
            iconColor="text-primary"
          >
            {todayAppointments.length === 0 ? (
              <EmptyWidget
                icon={Calendar}
                title="No appointments today"
                description="Schedule is clear for today"
              />
            ) : (
              <div className="space-y-4">
                {todayAppointments.map((apt: any) => (
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
                        <p className="text-sm text-muted-foreground">{apt.appointment_time}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      apt.status === "scheduled" 
                        ? "bg-primary/10 text-primary" 
                        : apt.status === "completed"
                        ? "bg-success/10 text-success"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {apt.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </WidgetCard>
        )}

        <WidgetCard
          title="Patient Queue"
          description="Current waiting list"
          icon={Users}
          iconColor="text-warning"
        >
          <EmptyWidget
            icon={Users}
            title="No patients waiting"
            description="The queue is currently empty"
          />
        </WidgetCard>
      </div>
    </div>
  );
}
