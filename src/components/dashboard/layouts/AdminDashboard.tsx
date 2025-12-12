import { Users, Calendar, Building2, UserCog, Clock } from "lucide-react";
import { StatCard } from "../StatCard";
import { WidgetCard } from "../WidgetCard";
import { EmptyWidget } from "../EmptyWidget";
import { LoadingWidget, LoadingStatCard } from "../LoadingWidget";
import { DashboardHeader } from "../DashboardHeader";
import { useAdminDashboard } from "@/hooks/dashboard/useAdminDashboard";
import { formatDistanceToNow } from "date-fns";

export function AdminDashboard() {
  const { stats, recentPatients, isLoading, loadingPatients } = useAdminDashboard();

  return (
    <div className="space-y-6">
      <DashboardHeader role="admin" />

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <LoadingStatCard key={i} />)
        ) : (
          <>
            <StatCard
              title="Total Patients"
              value={stats.totalPatients}
              icon={Users}
              iconColor="text-primary"
              iconBgColor="bg-primary/10"
            />
            <StatCard
              title="Pending Appointments"
              value={stats.pendingAppointments}
              icon={Calendar}
              iconColor="text-info"
              iconBgColor="bg-info/10"
            />
            <StatCard
              title="Medical Staff"
              value={stats.totalStaff}
              icon={UserCog}
              iconColor="text-warning"
              iconBgColor="bg-warning/10"
            />
            <StatCard
              title="Departments"
              value={stats.totalDepartments}
              icon={Building2}
              iconColor="text-success"
              iconBgColor="bg-success/10"
            />
          </>
        )}
      </div>

      {/* Recent Patients */}
      <div className="grid gap-6 lg:grid-cols-2">
        {loadingPatients ? (
          <LoadingWidget />
        ) : (
          <WidgetCard
            title="Recent Patients"
            description="Newly registered patients"
            icon={Users}
            iconColor="text-primary"
          >
            {recentPatients.length === 0 ? (
              <EmptyWidget
                icon={Users}
                title="No patients yet"
                description="Patients will appear here when registered"
              />
            ) : (
              <div className="space-y-4">
                {recentPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {patient.first_name[0]}{patient.last_name[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{patient.first_name} {patient.last_name}</p>
                        <p className="text-sm text-muted-foreground">
                          Registered {formatDistanceToNow(new Date(patient.created_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </WidgetCard>
        )}

        <WidgetCard
          title="System Overview"
          description="Quick actions and status"
          icon={Clock}
          iconColor="text-info"
        >
          <EmptyWidget
            icon={Clock}
            title="System running smoothly"
            description="All services are operational"
          />
        </WidgetCard>
      </div>
    </div>
  );
}
