import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/auth/AuthProvider";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Shoots from "./pages/Shoots";
import BookShoot from "./pages/BookShoot";
import Photographers from "./pages/Photographers";
import Clients from "./pages/Clients";
import Media from "./pages/Media";
import Invoices from "./pages/Invoices";
import Settings from "./pages/Settings";
import Accounts from "./pages/Accounts";
import Availability from "./pages/Availability";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";
import { ShootsProvider } from './context/ShootsContext';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <ShootsProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/shoots" element={<Shoots />} />
                <Route path="/book-shoot" element={<BookShoot />} />
                <Route path="/photographers" element={<Photographers />} />
                <Route path="/clients" element={<Clients />} />
                <Route path="/media" element={<Media />} />
                <Route path="/invoices" element={<Invoices />} />
                <Route path="/accounts" element={<Accounts />} />
                <Route path="/availability" element={<Availability />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ShootsProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
