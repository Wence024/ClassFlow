import { useParams, useNavigate } from "react-router-dom";
import { format, differenceInYears } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  FileText,
  Pill,
  FlaskConical,
  Receipt,
  User,
  Phone,
  Mail,
  MapPin,
  Shield,
  AlertTriangle,
  UserCheck,
  Pencil,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyWidget } from "@/components/dashboard/EmptyWidget";
import { PatientFormDialog } from "@/components/patients/PatientFormDialog";
import { usePatient } from "@/hooks/usePatients";
import { useState } from "react";

export default function PatientDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: patient, isLoading, error } = usePatient(id);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid gap-6 md:grid-cols-3">
            <Skeleton className="h-64 md:col-span-1" />
            <Skeleton className="h-64 md:col-span-2" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !patient) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground mb-4">Patient not found</p>
          <Button variant="outline" onClick={() => navigate("/patients")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Patients
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const age = differenceInYears(new Date(), new Date(patient.date_of_birth));
  const initials = `${patient.first_name[0]}${patient.last_name[0]}`.toUpperCase();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/patients")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">
                {patient.first_name} {patient.last_name}
              </h1>
              <p className="text-muted-foreground">Patient Profile</p>
            </div>
          </div>
          <Button onClick={() => setEditDialogOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Patient
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile Card */}
          <Card className="md:col-span-1">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-20 w-20 mb-4">
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold">
                  {patient.first_name} {patient.last_name}
                </h2>
                <p className="text-muted-foreground mb-2">
                  {age} years • {patient.gender || "Unknown"}
                </p>
                <Badge variant={patient.is_active ? "default" : "secondary"}>
                  {patient.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>

              <Separator className="my-6" />

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-muted-foreground">Date of Birth</p>
                    <p className="font-medium">
                      {format(new Date(patient.date_of_birth), "MMMM d, yyyy")}
                    </p>
                  </div>
                </div>

                {patient.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-muted-foreground">Phone</p>
                      <p className="font-medium">{patient.phone}</p>
                    </div>
                  </div>
                )}

                {patient.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-muted-foreground">Email</p>
                      <p className="font-medium">{patient.email}</p>
                    </div>
                  </div>
                )}

                {patient.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-muted-foreground">Address</p>
                      <p className="font-medium">{patient.address}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Emergency Contact */}
              {patient.emergency_contact_name && (
                <>
                  <Separator className="my-6" />
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <UserCheck className="h-4 w-4" />
                      Emergency Contact
                    </h4>
                    <p className="text-sm">{patient.emergency_contact_name}</p>
                    {patient.emergency_contact_phone && (
                      <p className="text-sm text-muted-foreground">
                        {patient.emergency_contact_phone}
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* Insurance */}
              {patient.insurance_provider && (
                <>
                  <Separator className="my-6" />
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Insurance
                    </h4>
                    <p className="text-sm">{patient.insurance_provider}</p>
                    {patient.insurance_policy_number && (
                      <p className="text-sm text-muted-foreground">
                        Policy: {patient.insurance_policy_number}
                      </p>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Tabs Section */}
          <Card className="md:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <CardHeader className="pb-0">
                <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="appointments">Appointments</TabsTrigger>
                  <TabsTrigger value="records">Records</TabsTrigger>
                  <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
                  <TabsTrigger value="lab">Lab</TabsTrigger>
                  <TabsTrigger value="billing">Billing</TabsTrigger>
                </TabsList>
              </CardHeader>

              <CardContent className="pt-6">
                <TabsContent value="overview" className="mt-0 space-y-4">
                  {/* Allergies */}
                  {patient.allergies ? (
                    <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                      <div className="flex items-center gap-2 text-destructive mb-2">
                        <AlertTriangle className="h-5 w-5" />
                        <h4 className="font-semibold">Allergies</h4>
                      </div>
                      <p className="text-sm">{patient.allergies}</p>
                    </div>
                  ) : (
                    <div className="p-4 rounded-lg bg-muted">
                      <h4 className="font-medium mb-1">Allergies</h4>
                      <p className="text-sm text-muted-foreground">No allergies recorded</p>
                    </div>
                  )}

                  {/* Medical History */}
                  <div className="p-4 rounded-lg bg-muted">
                    <h4 className="font-medium mb-2">Medical History</h4>
                    <p className="text-sm text-muted-foreground">
                      {patient.medical_history || "No medical history recorded"}
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="appointments" className="mt-0">
                  <EmptyWidget
                    icon={Calendar}
                    title="No Appointments"
                    description="Appointments will appear here once the module is implemented."
                  />
                </TabsContent>

                <TabsContent value="records" className="mt-0">
                  <EmptyWidget
                    icon={FileText}
                    title="No Medical Records"
                    description="Medical records will appear here once the module is implemented."
                  />
                </TabsContent>

                <TabsContent value="prescriptions" className="mt-0">
                  <EmptyWidget
                    icon={Pill}
                    title="No Prescriptions"
                    description="Prescriptions will appear here once the module is implemented."
                  />
                </TabsContent>

                <TabsContent value="lab" className="mt-0">
                  <EmptyWidget
                    icon={FlaskConical}
                    title="No Lab Results"
                    description="Lab results will appear here once the module is implemented."
                  />
                </TabsContent>

                <TabsContent value="billing" className="mt-0">
                  <EmptyWidget
                    icon={Receipt}
                    title="No Billing Records"
                    description="Billing records will appear here once the module is implemented."
                  />
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>
      </div>

      {/* Edit Dialog */}
      <PatientFormDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        patient={patient}
      />
    </DashboardLayout>
  );
}
