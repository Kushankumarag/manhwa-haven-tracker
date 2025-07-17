
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Statistics from "./pages/Statistics";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import ReadingSites from "./pages/ReadingSites";

const queryClient = new QueryClient();

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <SidebarProvider defaultOpen={false}>
          <div className="flex min-h-screen w-full">
            <AppSidebar />
            <SidebarInset className="flex-1">
              <header className="flex h-12 md:h-16 shrink-0 items-center gap-2 border-b px-3 md:px-4">
                <SidebarTrigger className="-ml-1" />
                <div className="flex items-center gap-2">
                  <h1 className="text-base md:text-lg font-semibold truncate">ManhwaVault</h1>
                </div>
              </header>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/stats" element={<Statistics />} />
                <Route path="/reading-sites/:type" element={<ReadingSites />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
