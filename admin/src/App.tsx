import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AdminShell />}>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/profiles" element={<Profiles />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/verification" element={<VerificationPage />} />
            <Route path="/interests" element={<InterestsPage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/membership" element={<Membership />} />
            <Route path="/success-stories" element={<SuccessStoriesPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/complaints" element={<ComplaintsPage />} />
            <Route path="/caste" element={<CasteManagement />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
