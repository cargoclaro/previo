import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Index from "./pages/Index";
import PedimentoSelection from "./pages/PedimentoSelection";
import GoodsCondition from "./pages/GoodsCondition";
import ProductVerification from "./pages/ProductVerification";
import NotFound from "./pages/NotFound";
import RegisterPrevio from "./pages/RegisterPrevio";
import EmbalajePrevio from "./pages/EmbalajePrevio";
import PrevioComplete from "./pages/PrevioComplete";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-center" closeButton />
      <BrowserRouter>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/pedimento-selection" element={<PedimentoSelection />} />
            <Route path="/register-previo" element={<RegisterPrevio />} />
            <Route path="/embalaje-previo" element={<EmbalajePrevio />} />
            <Route path="/product-verification" element={<ProductVerification />} />
            <Route path="/previo-complete" element={<PrevioComplete />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
