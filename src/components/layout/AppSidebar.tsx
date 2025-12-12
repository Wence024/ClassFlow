import {
  Activity,
  Calendar,
  ClipboardList,
  CreditCard,
  FileText,
  FlaskConical,
  Home,
  Pill,
  Settings,
  Users,
  UserCog,
  Building2,
  LucideIcon,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { getRoleDisplayName, hasRouteAccess, type AppRole } from "@/types/roles";

interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

const mainNavItems: NavItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Patients", url: "/patients", icon: Users },
  { title: "Appointments", url: "/appointments", icon: Calendar },
  { title: "Medical Records", url: "/records", icon: FileText },
  { title: "Patient Queue", url: "/queue", icon: ClipboardList },
];

const clinicalItems: NavItem[] = [
  { title: "Prescriptions", url: "/prescriptions", icon: Pill },
  { title: "Lab Requests", url: "/lab", icon: FlaskConical },
  { title: "Pharmacy", url: "/pharmacy", icon: Pill },
];

const adminItems: NavItem[] = [
  { title: "Billing", url: "/billing", icon: CreditCard },
  { title: "Staff", url: "/staff", icon: UserCog },
  { title: "Departments", url: "/departments", icon: Building2 },
  { title: "Settings", url: "/settings", icon: Settings },
];

function filterItemsByRole(items: NavItem[], role: AppRole | null): NavItem[] {
  if (!role) return [];
  return items.filter((item) => hasRouteAccess(role, item.url));
}

export function AppSidebar() {
  const { state } = useSidebar();
  const { user, role } = useAuth();
  const isCollapsed = state === "collapsed";

  const filteredMainItems = filterItemsByRole(mainNavItems, role);
  const filteredClinicalItems = filterItemsByRole(clinicalItems, role);
  const filteredAdminItems = filterItemsByRole(adminItems, role);

  const userName = user?.user_metadata?.name || user?.email?.split("@")[0] || "User";
  const userEmail = user?.email || "";
  const roleDisplay = role ? getRoleDisplayName(role) : "Loading...";

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Activity className="h-5 w-5" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold">HMIS</span>
              <span className="text-xs text-muted-foreground">Healthcare System</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {filteredMainItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Main</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredMainItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <NavLink
                        to={item.url}
                        className="flex items-center gap-3 text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50 transition-colors"
                        activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {filteredClinicalItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Clinical</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredClinicalItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <NavLink
                        to={item.url}
                        className="flex items-center gap-3 text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50 transition-colors"
                        activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {filteredAdminItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Administration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredAdminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <NavLink
                        to={item.url}
                        className="flex items-center gap-3 text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50 transition-colors"
                        activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-medium text-primary">
              {userName.charAt(0).toUpperCase()}
            </span>
          </div>
          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium truncate">{userName}</span>
              <span className="text-xs text-muted-foreground truncate">{roleDisplay}</span>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
