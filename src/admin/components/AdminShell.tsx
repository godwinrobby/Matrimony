import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/admin/components/ui/sidebar";
import { AppSidebar } from "@/admin/components/AppSidebar";
import { Button } from "@/admin/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/admin/components/ui/avatar";
import { Badge } from "@/admin/components/ui/badge";
import { Bell, Search } from "lucide-react";
import { Input } from "@/admin/components/ui/input";

export default function AdminShell() {
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
                  <AvatarFallback className="bg-gradient-romantic text-primary-foreground text-xs">AD</AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <div className="text-sm font-medium leading-tight">Admin User</div>
                  <div className="text-[11px] text-muted-foreground leading-tight">Super Admin</div>
                </div>
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
