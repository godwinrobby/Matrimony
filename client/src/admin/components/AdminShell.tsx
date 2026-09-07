import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/admin/components/ui/sidebar";
import { AppSidebar } from "@/admin/components/AppSidebar";
import { Button } from "@/admin/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/admin/components/ui/avatar";
import { Badge } from "@/admin/components/ui/badge";
import { Bell, LogOut, Search } from "lucide-react";
import { Input } from "@/admin/components/ui/input";
import { useAdminAuth } from "../AdminAuth";

export default function AdminShell() {
  const { session, logout } = useAdminAuth();

  const handleLogout = () => {
    // Clearing the session re-renders the admin route tree into the
    // login screen via the guard in AdminRoutes — no navigation needed.
    logout();
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="min-h-screen flex flex-col w-full min-w-0 bg-background">
          <header className="h-14 flex items-center justify-between border-b border-border bg-card px-4 sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <div className="hidden md:flex items-center relative">
                <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search profiles, users, plans..."
                  className="pl-9 w-80 h-9"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-1 -right-1 h-4 min-w-4 px-1 text-[10px] bg-primary">
                  12
                </Badge>
              </Button>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-gradient-romantic text-primary-foreground text-xs">
                    {(session?.username ?? 'ad').slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <div className="text-sm font-medium leading-tight capitalize">
                    {session?.username ?? 'Admin User'}
                  </div>
                  <div className="text-[11px] text-muted-foreground leading-tight">
                    {session?.role ?? 'Super Admin'}
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  title="Sign out"
                  aria-label="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </header>
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
