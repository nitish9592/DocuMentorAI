import { useState } from "react";
import Sidebar from "./Sidebar";
import MobileNavigation from "./MobileNavigation";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <MobileNavigation 
        isOpen={isMobileMenuOpen}
        onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />
      
      <div className="flex pt-16 lg:pt-0">
        <Sidebar />
        <div className="flex-1 lg:ml-64">
          {children}
        </div>
      </div>
    </div>
  );
}
