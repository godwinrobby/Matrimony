import { useState } from "react";
import { Button } from "@/admin/components/ui/button";
import { ScrollArea } from "@/admin/components/ui/scroll-area";
import { Separator } from "@/admin/components/ui/separator";
import { Badge } from "@/admin/components/ui/badge";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Heart,
  MessageSquare,
  Shield,
  Star,
  CreditCard,
  Settings,
  BarChart3,
  FileText,
  MapPin,
  Book,
  Calendar,
  Crown,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/admin/lib/utils";

const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin/dashboard",
      badge: null
    },
    {
      title: "User Management",
      icon: Users,
      path: "/admin/users",
      badge: "1,234"
    },
    {
      title: "Profile Verification",
      icon: UserCheck,
      path: "/admin/verification",
      badge: "23"
    },
    {
      title: "Interest Management",
      icon: Heart,
      path: "/admin/interests",
      badge: "156"
    },
    {
      title: "Messages",
      icon: MessageSquare,
      path: "/admin/messages",
      badge: "45"
    },
    {
      title: "Success Stories",
      icon: Star,
      path: "/admin/success-stories",
      badge: null
    },
    {
      title: "Membership Plans",
      icon: CreditCard,
      path: "/admin/membership",
      badge: null
    },
    {
      title: "Reports & Analytics",
      icon: BarChart3,
      path: "/admin/reports",
      badge: null
    },
    {
      title: "Complaints",
      icon: Shield,
      path: "/admin/complaints",
      badge: "12"
    }
  ];

  const configMenuItems = [
    {
      title: "Caste Management",
      icon: Book,
      path: "/admin/caste-management",
      badge: null
    },
    {
      title: "Location Management",
      icon: MapPin,
      path: "/admin/locations",
      badge: null
    },
    {
      title: "Horoscope Settings",
      icon: Calendar,
      path: "/admin/horoscope",
      badge: null
    },
    {
      title: "Premium Features",
      icon: Crown,
      path: "/admin/premium",
      badge: null
    },
    {
      title: "System Settings",
      icon: Settings,
      path: "/admin/settings",
      badge: null
    }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={cn(
      "relative bg-card border-r border-border h-screen transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!collapsed && (
          <div>
            <h2 className="text-lg font-bold bg-gradient-romantic bg-clip-text text-transparent">
              Admin Panel
            </h2>
            <p className="text-xs text-muted-foreground">Matrimony Management</p>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="p-2"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <ScrollArea className="flex-1 p-2">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.path}
                variant={isActive(item.path) ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  collapsed ? "px-2" : "px-4",
                  isActive(item.path) && "bg-primary text-primary-foreground"
                )}
                onClick={() => navigate(item.path)}
              >
                <Icon className="h-4 w-4" />
                {!collapsed && (
                  <>
                    <span className="ml-3">{item.title}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </Button>
            );
          })}
        </div>

        <Separator className="my-4" />
        
        {!collapsed && (
          <p className="text-xs font-semibold text-muted-foreground px-4 mb-2">
            CONFIGURATION
          </p>
        )}
        
        <div className="space-y-2">
          {configMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.path}
                variant={isActive(item.path) ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  collapsed ? "px-2" : "px-4",
                  isActive(item.path) && "bg-primary text-primary-foreground"
                )}
                onClick={() => navigate(item.path)}
              >
                <Icon className="h-4 w-4" />
                {!collapsed && (
                  <>
                    <span className="ml-3">{item.title}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </Button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default AdminSidebar;