import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Calendar, Users, FileText, TrendingUp, Clock } from "lucide-react";

const stats = [
  {
    title: "Total Patients",
    value: "1,248",
    change: "+12%",
    icon: Users,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    title: "Appointments Today",
    value: "42",
    change: "+5%",
    icon: Calendar,
    color: "text-info",
    bgColor: "bg-info/10",
  },
  {
    title: "Active Cases",
    value: "89",
    change: "-3%",
    icon: Activity,
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  {
    title: "Pending Reports",
    value: "23",
    change: "+8%",
    icon: FileText,
    color: "text-success",
    bgColor: "bg-success/10",
  },
];

const recentPatients = [
  { name: "John Doe", id: "P-001", status: "In Treatment", time: "10 min ago" },
  { name: "Jane Smith", id: "P-002", status: "Discharged", time: "25 min ago" },
  { name: "Robert Johnson", id: "P-003", status: "Waiting", time: "1 hour ago" },
  { name: "Emily Davis", id: "P-004", status: "In Treatment", time: "2 hours ago" },
];

const upcomingAppointments = [
  { patient: "Sarah Wilson", doctor: "Dr. Adams", time: "09:00 AM", type: "Check-up" },
  { patient: "Mike Brown", doctor: "Dr. Chen", time: "10:30 AM", type: "Follow-up" },
  { patient: "Lisa Anderson", doctor: "Dr. Adams", time: "11:00 AM", type: "Consultation" },
  { patient: "Tom Martinez", doctor: "Dr. Patel", time: "02:00 PM", type: "Lab Review" },
];

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your healthcare system.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="h-3 w-3 text-success" />
                      <span className="text-xs text-success">{stat.change}</span>
                      <span className="text-xs text-muted-foreground">vs last month</span>
                    </div>
                  </div>
                  <div className={`h-12 w-12 rounded-full ${stat.bgColor} flex items-center justify-center`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Patients */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Recent Patients
              </CardTitle>
              <CardDescription>Latest patient activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {patient.name.split(" ").map((n) => n[0]).join("")}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{patient.name}</p>
                        <p className="text-sm text-muted-foreground">{patient.id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          patient.status === "In Treatment"
                            ? "bg-warning/10 text-warning"
                            : patient.status === "Discharged"
                            ? "bg-success/10 text-success"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {patient.status}
                      </span>
                      <p className="text-xs text-muted-foreground mt-1">{patient.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Appointments */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-info" />
                Upcoming Appointments
              </CardTitle>
              <CardDescription>Today's scheduled appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingAppointments.map((apt, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-info/10 flex items-center justify-center">
                        <Clock className="h-4 w-4 text-info" />
                      </div>
                      <div>
                        <p className="font-medium">{apt.patient}</p>
                        <p className="text-sm text-muted-foreground">{apt.doctor}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{apt.time}</p>
                      <span className="text-xs text-muted-foreground">{apt.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
