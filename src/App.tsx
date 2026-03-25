import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Signup from "./pages/Signup.tsx";
import Login from "./pages/Login.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Home from "./pages/Home.tsx";
import Main from "./pages/Main.tsx";
import Profile from "./pages/Profile.tsx";
import EarnMore from "./pages/EarnMore.tsx";
import History from "./pages/History.tsx";
import Support from "./pages/Support.tsx";
import Channel from "./pages/Channel.tsx";
import Withdraw from "./pages/Withdraw.tsx";
import BuyCode from "./pages/BuyCode.tsx";
import Payment from "./pages/Payment.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/home" element={<Home />} />
            <Route path="/main" element={<Main />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/earn-more" element={<EarnMore />} />
            <Route path="/history" element={<History />} />
            <Route path="/support" element={<Support />} />
            <Route path="/channel" element={<Channel />} />
            <Route path="/withdraw" element={<Withdraw />} />
            <Route path="/buy-code" element={<BuyCode />} />
            <Route path="/payment" element={<Payment />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
