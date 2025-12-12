import { useState } from "react";
import { format } from "date-fns";
import { MoreHorizontal, Pencil, Trash2, Eye, Mail, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PatientFormDialog } from "./PatientFormDialog";
import { DeletePatientDialog } from "./DeletePatientDialog";
import type { Patient } from "@/types/patient";

interface PatientTableProps {
  patients: Patient[];
  isLoading?: boolean;
}

export function PatientTable({ patients, isLoading }: PatientTableProps) {
  const [editingPatient, setEditingPatient] = useState<Patient | undefined>();
  const [deletingPatient, setDeletingPatient] = useState<Patient | null>(null);
  const [viewingPatient, setViewingPatient] = useState<Patient | null>(null);

  if (isLoading) {
    return (
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Date of Birth</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-40 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-5 w-16 bg-muted animate-pulse rounded-full" />
                </TableCell>
                <TableCell>
                  <div className="h-8 w-8 bg-muted animate-pulse rounded" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (patients.length === 0) {
    return (
      <div className="border rounded-lg p-8 text-center">
        <p className="text-muted-foreground">No patients found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Date of Birth</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell className="font-medium">
                  {patient.first_name} {patient.last_name}
                </TableCell>
                <TableCell>
                  {format(new Date(patient.date_of_birth), "MMM d, yyyy")}
                </TableCell>
                <TableCell className="capitalize">
                  {patient.gender || "—"}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1 text-sm">
                    {patient.email && (
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {patient.email}
                      </span>
                    )}
                    {patient.phone && (
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {patient.phone}
                      </span>
                    )}
                    {!patient.email && !patient.phone && "—"}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={patient.is_active ? "default" : "secondary"}>
                    {patient.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setViewingPatient(patient)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setEditingPatient(patient)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setDeletingPatient(patient)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Deactivate
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <PatientFormDialog
        open={!!editingPatient}
        onOpenChange={(open) => !open && setEditingPatient(undefined)}
        patient={editingPatient}
      />

      {/* Delete Dialog */}
      <DeletePatientDialog
        open={!!deletingPatient}
        onOpenChange={(open) => !open && setDeletingPatient(null)}
        patient={deletingPatient}
      />

      {/* View Details Dialog */}
      <Dialog open={!!viewingPatient} onOpenChange={(open) => !open && setViewingPatient(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Patient Details</DialogTitle>
            <DialogDescription>
              {viewingPatient?.first_name} {viewingPatient?.last_name}
            </DialogDescription>
          </DialogHeader>
          {viewingPatient && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Date of Birth</p>
                  <p className="font-medium">
                    {format(new Date(viewingPatient.date_of_birth), "MMMM d, yyyy")}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Gender</p>
                  <p className="font-medium capitalize">{viewingPatient.gender || "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium">{viewingPatient.email || "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Phone</p>
                  <p className="font-medium">{viewingPatient.phone || "—"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground">Address</p>
                  <p className="font-medium">{viewingPatient.address || "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Emergency Contact</p>
                  <p className="font-medium">{viewingPatient.emergency_contact_name || "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Emergency Phone</p>
                  <p className="font-medium">{viewingPatient.emergency_contact_phone || "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Insurance Provider</p>
                  <p className="font-medium">{viewingPatient.insurance_provider || "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Policy Number</p>
                  <p className="font-medium">{viewingPatient.insurance_policy_number || "—"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground">Allergies</p>
                  <p className="font-medium">{viewingPatient.allergies || "None recorded"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground">Medical History</p>
                  <p className="font-medium">{viewingPatient.medical_history || "None recorded"}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
