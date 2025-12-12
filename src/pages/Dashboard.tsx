import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useUserRole } from "@/hooks/useUserRole";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AdminDashboard,
  DoctorDashboard,
  NurseDashboard,
  PharmacistDashboard,
  LabTechDashboard,
  BillingClerkDashboard,
  ReceptionistDashboard,
  StaffDashboard,
  PatientDashboard,
} from "@/components/dashboard/layouts";

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    </div>
  );
}

function RoleDashboard({ role }: { role: string | null }) {
  switch (role) {
    case "admin":
      return <AdminDashboard />;
    case "doctor":
      return <DoctorDashboard />;
    case "nurse":
      return <NurseDashboard />;
    case "pharmacist":
      return <PharmacistDashboard />;
    case "lab_tech":
      return <LabTechDashboard />;
    case "billing_clerk":
      return <BillingClerkDashboard />;
    case "receptionist":
      return <ReceptionistDashboard />;
    case "staff":
      return <StaffDashboard />;
    case "patient":
      return <PatientDashboard />;
    default:
      return <PatientDashboard />;
  }
}

export default function Dashboard() {
  const { role, isLoading } = useUserRole();

  return (
    <DashboardLayout>
      {isLoading ? <DashboardSkeleton /> : <RoleDashboard role={role} />}
    </DashboardLayout>
  );
}
