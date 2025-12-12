import { useState } from "react";
import { Plus, Users } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { PatientFilters } from "@/components/patients/PatientFilters";
import { PatientTable } from "@/components/patients/PatientTable";
import { PatientFormDialog } from "@/components/patients/PatientFormDialog";
import { usePatients } from "@/hooks/usePatients";
import type { PatientFilters as Filters } from "@/types/patient";

export default function Patients() {
  const [filters, setFilters] = useState<Filters>({ status: "active" });
  const [page, setPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data, isLoading } = usePatients(filters, page);

  const handleFiltersChange = (newFilters: Filters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page on filter change
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold">Patients</h1>
              <p className="text-sm text-muted-foreground">
                Manage patient records and information
              </p>
            </div>
          </div>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Patient
          </Button>
        </div>

        {/* Filters */}
        <PatientFilters filters={filters} onFiltersChange={handleFiltersChange} />

        {/* Table */}
        <PatientTable patients={data?.data || []} isLoading={isLoading} />

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              {Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      onClick={() => setPage(pageNum)}
                      isActive={page === pageNum}
                      className="cursor-pointer"
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                  className={
                    page === data.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}

        {/* Results count */}
        {data && (
          <p className="text-sm text-muted-foreground text-center">
            Showing {data.data.length} of {data.count} patients
          </p>
        )}
      </div>

      {/* Add Patient Dialog */}
      <PatientFormDialog open={isFormOpen} onOpenChange={setIsFormOpen} />
    </DashboardLayout>
  );
}
