import { Link, useLocation } from "wouter";
import { Menu, X, Home, FileIcon, Bot, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileNavigationProps {
  isOpen: boolean;
  onToggle: () => void;
}

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Documents", href: "/documents", icon: FileIcon },
  { name: "AI Summarizer", href: "/ai", icon: Bot },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function MobileNavigation({ isOpen, onToggle }: MobileNavigationProps) {
  const [location] = useLocation();

  return (
    <div className="lg:hidden fixed top-0 left-0 right-0 bg-background shadow-sm z-50 border-b border-border">
      <div className="flex items-center justify-between p-4">
        <h1 className="text-xl font-semibold text-foreground">DocuMentor</h1>
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors touch-target"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      
      {isOpen && (
        <div className="border-t border-border bg-background">
          <nav className="p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors touch-target",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                  onClick={onToggle}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </div>
  );
}
