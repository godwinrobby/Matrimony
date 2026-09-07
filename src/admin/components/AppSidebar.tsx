import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Heart,
  MessageSquare,
  CreditCard,
  Star,
  BookOpen,
  BarChart3,
  Shield,
  Settings,
  UserCog,
} from "lucide-react";
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
  useSidebar,
} from "@/admin/components/ui/sidebar";

const mainItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Profiles", url: "/profiles", icon: Users },
  { title: "User Management", url: "/users", icon: UserCog },
  { title: "Verification Queue", url: "/verification", icon: UserCheck },
  { title: "Interests", url: "/interests", icon: Heart },
  { title: "Messages", url: "/messages", icon: MessageSquare },
];

const businessItems = [
  { title: "Membership Plans", url: "/membership", icon: CreditCard },
  { title: "Success Stories", url: "/success-stories", icon: Star },
  { title: "Reports & Analytics", url: "/reports", icon: BarChart3 },
  { title: "Complaints", url: "/complaints", icon: Shield },
];

const configItems = [
  { title: "Caste Management", url: "/caste", icon: BookOpen },
  { title: "Edit Profile", url: "/edit-profile", icon: UserCog },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();
  const isActive = (path: string) => (path === "/" ? pathname === "/" : pathname.startsWith(path));

  const renderGroup = (label: string, items: typeof mainItems) => (
    <SidebarGroup>
      {!collapsed && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                <NavLink to={item.url} className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  {!collapsed && <span>{item.title}</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-romantic flex items-center justify-center">
            <Heart className="h-4 w-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div>
              <div className="text-sm font-bold bg-gradient-romantic bg-clip-text text-transparent">
                SoulMate Admin
              </div>
              <div className="text-[10px] text-muted-foreground">Matrimony Panel</div>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        {renderGroup("Management", mainItems)}
        {renderGroup("Business", businessItems)}
        {renderGroup("Configuration", configItems)}
      </SidebarContent>
    </Sidebar>
  );
}
