import { Receipt, DollarSign, AlertTriangle, Clock } from "lucide-react";
import { StatCard } from "../StatCard";
import { WidgetCard } from "../WidgetCard";
import { EmptyWidget } from "../EmptyWidget";
import { LoadingWidget, LoadingStatCard } from "../LoadingWidget";
import { DashboardHeader } from "../DashboardHeader";
import { useBillingClerkDashboard } from "@/hooks/dashboard/useStaffDashboard";
import { format } from "date-fns";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

/**
 *
 */
export function BillingClerkDashboard() {
  const { stats, pendingBills, isLoading, loadingBills } = useBillingClerkDashboard();

  return (
    <div className="space-y-6">
      <DashboardHeader role="billing_clerk" />

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <LoadingStatCard key={i} />)
        ) : (
          <>
            <StatCard
              title="Pending Bills"
              value={stats.pendingBills}
              icon={Receipt}
              iconColor="text-primary"
              iconBgColor="bg-primary/10"
            />
            <StatCard
              title="Pending Amount"
              value={formatCurrency(stats.pendingAmount)}
              icon={AlertTriangle}
              iconColor="text-warning"
              iconBgColor="bg-warning/10"
            />
            <StatCard
              title="Total Collected"
              value={formatCurrency(stats.collectedAmount)}
              icon={DollarSign}
              iconColor="text-success"
              iconBgColor="bg-success/10"
            />
          </>
        )}
      </div>

      {/* Pending Bills */}
      <div className="grid gap-6 lg:grid-cols-2">
        {loadingBills ? (
          <LoadingWidget />
        ) : (
          <WidgetCard
            title="Pending Bills"
            description="Bills awaiting payment"
            icon={Receipt}
            iconColor="text-primary"
          >
            {pendingBills.length === 0 ? (
              <EmptyWidget
                icon={Receipt}
                title="No pending bills"
                description="All bills have been settled"
              />
            ) : (
              <div className="space-y-4">
                {pendingBills.map((bill) => (
                  <div
                    key={bill.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Receipt className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {bill.patients?.first_name} {bill.patients?.last_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(bill.bill_date), "MMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-warning">
                        {formatCurrency(bill.amount_due ?? bill.total_amount)}
                      </p>
                      <span className="text-xs text-muted-foreground">{bill.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </WidgetCard>
        )}

        <WidgetCard
          title="Recent Payments"
          description="Today's collections"
          icon={DollarSign}
          iconColor="text-success"
        >
          <EmptyWidget
            icon={DollarSign}
            title="No payments today"
            description="Payments will appear here when received"
          />
        </WidgetCard>
      </div>
    </div>
  );
}
