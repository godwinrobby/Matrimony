import * as React from "react";
import { Route } from "react-router-dom";
import { Toaster } from "@/admin/components/ui/toaster";
import { Toaster as Sonner } from "@/admin/components/ui/sonner";
import { TooltipProvider } from "@/admin/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AdminShell from "./components/AdminShell";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import CasteManagement from "./pages/admin/CasteManagement";
import Profiles from "./pages/Profiles";
import EditProfile from "./pages/EditProfile";
import Membership from "./pages/Membership";
import NotFound from "./pages/NotFound";
import {
  InterestsPage,
  MessagesPage,
  VerificationPage,
  SuccessStoriesPage,
  ReportsPage,
  ComplaintsPage,
  SettingsPage,
} from "./pages/admin/AdminModules";

const queryClient = new QueryClient();

/** Wraps the admin section with its own providers + toasters. */
export function AdminProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {children}
      </TooltipProvider>
    </QueryClientProvider>
  );
}

/** Admin routes mounted under /admin in the main app. */
export function AdminRoutes() {
  return (
    <Route path="admin" element={<AdminShell />}>
      <Route index element={<AdminDashboard />} />
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="profiles" element={<Profiles />} />
      <Route path="users" element={<UserManagement />} />
      <Route path="verification" element={<VerificationPage />} />
      <Route path="interests" element={<InterestsPage />} />
      <Route path="messages" element={<MessagesPage />} />
      <Route path="membership" element={<Membership />} />
      <Route path="success-stories" element={<SuccessStoriesPage />} />
      <Route path="reports" element={<ReportsPage />} />
      <Route path="complaints" element={<ComplaintsPage />} />
      <Route path="caste" element={<CasteManagement />} />
      <Route path="caste-management" element={<CasteManagement />} />
      <Route path="edit-profile" element={<EditProfile />} />
      <Route path="settings" element={<SettingsPage />} />
      {/* Sidebar links without dedicated pages yet */}
      <Route path="locations" element={<SettingsPage />} />
      <Route path="horoscope" element={<SettingsPage />} />
      <Route path="premium" element={<SettingsPage />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  );
}
