import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Building2, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isActive = (path: string) => location === path;

  return (
    <header className="sticky top-0 z-50 border-b bg-card">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 hover-elevate active-elevate-2 px-3 py-2 rounded-md -ml-3" data-testid="link-home">
            <Building2 className="h-8 w-8 text-primary" />
            <div className="flex flex-col">
              <span className="font-heading font-bold text-base leading-tight">Masvingo City Council</span>
              <span className="text-xs text-muted-foreground">Rate Clearance System</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            <Link href="/" data-testid="link-nav-home">
              <Button 
                variant={isActive("/") ? "secondary" : "ghost"}
                className={isActive("/") ? "toggle-elevate toggle-elevated" : ""}
              >
                Home
              </Button>
            </Link>
            <Link href="/apply" data-testid="link-nav-apply">
              <Button 
                variant={isActive("/apply") ? "secondary" : "ghost"}
                className={isActive("/apply") ? "toggle-elevate toggle-elevated" : ""}
              >
                Apply
              </Button>
            </Link>
            <Link href="/track" data-testid="link-nav-track">
              <Button 
                variant={isActive("/track") ? "secondary" : "ghost"}
                className={isActive("/track") ? "toggle-elevate toggle-elevated" : ""}
              >
                Track Application
              </Button>
            </Link>
            <a href="/admin" data-testid="link-nav-admin">
              <Button variant="outline">
                Admin Login
              </Button>
            </a>
          </nav>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden py-4 space-y-2 border-t" data-testid="nav-mobile-menu">
            <Link href="/" className="block" data-testid="link-mobile-home">
              <Button 
                variant={isActive("/") ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Button>
            </Link>
            <Link href="/apply" className="block" data-testid="link-mobile-apply">
              <Button 
                variant={isActive("/apply") ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setMobileMenuOpen(false)}
              >
                Apply
              </Button>
            </Link>
            <Link href="/track" className="block" data-testid="link-mobile-track">
              <Button 
                variant={isActive("/track") ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setMobileMenuOpen(false)}
              >
                Track Application
              </Button>
            </Link>
            <Link href="/admin" className="block" data-testid="link-mobile-admin">
              <Button 
                variant="outline"
                className="w-full justify-start"
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin Login
              </Button>
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
