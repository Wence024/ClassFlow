import { Pill, AlertTriangle, Package } from "lucide-react";
import { StatCard } from "../StatCard";
import { WidgetCard } from "../WidgetCard";
import { EmptyWidget } from "../EmptyWidget";
import { LoadingWidget, LoadingStatCard } from "../LoadingWidget";
import { DashboardHeader } from "../DashboardHeader";
import { usePharmacistDashboard } from "@/hooks/dashboard/useStaffDashboard";

/**
 *
 */
export function PharmacistDashboard() {
  const { stats, lowStockItems, isLoading, loadingInventory } = usePharmacistDashboard();

  return (
    <div className="space-y-6">
      <DashboardHeader role="pharmacist" />

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        {isLoading ? (
          Array.from({ length: 2 }).map((_, i) => <LoadingStatCard key={i} />)
        ) : (
          <>
            <StatCard
              title="Pending Prescriptions"
              value={stats.pendingPrescriptions}
              icon={Pill}
              iconColor="text-primary"
              iconBgColor="bg-primary/10"
            />
            <StatCard
              title="Low Stock Alerts"
              value={stats.lowStockCount}
              icon={AlertTriangle}
              iconColor="text-warning"
              iconBgColor="bg-warning/10"
            />
          </>
        )}
      </div>

      {/* Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        <WidgetCard
          title="Pending Prescriptions"
          description="Prescriptions to dispense"
          icon={Pill}
          iconColor="text-primary"
        >
          <EmptyWidget
            icon={Pill}
            title="No pending prescriptions"
            description="All prescriptions have been dispensed"
          />
        </WidgetCard>

        {loadingInventory ? (
          <LoadingWidget />
        ) : (
          <WidgetCard
            title="Low Stock Items"
            description="Medications below minimum level"
            icon={AlertTriangle}
            iconColor="text-warning"
          >
            {lowStockItems.length === 0 ? (
              <EmptyWidget
                icon={Package}
                title="Stock levels normal"
                description="All medications are adequately stocked"
              />
            ) : (
              <div className="space-y-4">
                {lowStockItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-warning/10 flex items-center justify-center">
                        <Package className="h-4 w-4 text-warning" />
                      </div>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Min: {item.minimum_stock_level}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-destructive">
                      {item.quantity_available} left
                    </span>
                  </div>
                ))}
              </div>
            )}
          </WidgetCard>
        )}
      </div>
    </div>
  );
}
