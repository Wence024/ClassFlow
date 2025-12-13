import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AppointmentFilters,
  AppointmentFormDialog,
  AppointmentTable,
} from "@/components/appointments";
import { useAppointments, useTodaysAppointments, useUpcomingAppointments } from "@/hooks/useAppointments";
import type { AppointmentFilters as Filters } from "@/types/appointment";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function Appointments() {
  const [activeTab, setActiveTab] = useState("all");
  const [filters, setFilters] = useState<Filters>({});
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Queries
  const allAppointments = useAppointments(filters, page);
  const todaysAppointments = useTodaysAppointments();
  const upcomingAppointments = useUpcomingAppointments(50);

  // Get current data based on active tab
  const getCurrentData = () => {
    switch (activeTab) {
      case "today":
        return {
          appointments: todaysAppointments.data || [],
          isLoading: todaysAppointments.isLoading,
          totalPages: 1,
        };
      case "upcoming":
        return {
          appointments: upcomingAppointments.data || [],
          isLoading: upcomingAppointments.isLoading,
          totalPages: 1,
        };
      default:
        return {
          appointments: allAppointments.data?.data || [],
          isLoading: allAppointments.isLoading,
          totalPages: allAppointments.data?.totalPages || 1,
        };
    }
  };

  const { appointments, isLoading, totalPages } = getCurrentData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
          <p className="text-muted-foreground">
            Manage patient appointments and schedules
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Appointment
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          </TabsList>

          {activeTab === "all" && (
            <AppointmentFilters filters={filters} onFiltersChange={setFilters} />
          )}
        </div>

        <TabsContent value="all" className="mt-6">
          <AppointmentTable appointments={appointments} isLoading={isLoading} />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className={page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  {[...Array(totalPages)].map((_, i) => (
                    <PaginationItem key={i + 1}>
                      <PaginationLink
                        onClick={() => setPage(i + 1)}
                        isActive={page === i + 1}
                        className="cursor-pointer"
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      className={page >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </TabsContent>

        <TabsContent value="today" className="mt-6">
          <AppointmentTable
            appointments={appointments}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="upcoming" className="mt-6">
          <AppointmentTable
            appointments={appointments}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>

      {/* New Appointment Dialog */}
      <AppointmentFormDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
