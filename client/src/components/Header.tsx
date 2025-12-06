import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { Logo } from "./Logo";
import { isExpoMode } from "@/lib/config";
import { usePricingStore } from "@/lib/pricingState";
import { PricingDialog } from "./PricingDialog";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/convert", label: "Convert Video" },
  { href: "/studio", label: "Voice Studio" },
  { href: "/languages", label: "Languages" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { isOpen, openPricing, closePricing } = usePricingStore();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Logo showText={true} />

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={location === item.href ? "secondary" : "ghost"}
                  size="sm"
                  data-testid={`link-nav-${item.label.toLowerCase().replace(" ", "-")}`}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
            {!isExpoMode() && (
              <Button
                variant="ghost"
                size="sm"
                onClick={openPricing}
                data-testid="button-nav-pricing"
              >
                Pricing
              </Button>
            )}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {!isExpoMode() && (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" data-testid="button-login">
                    Log in
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" data-testid="button-signup">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border/40">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={location === item.href ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid={`link-mobile-${item.label.toLowerCase().replace(" ", "-")}`}
                  >
                    {item.label}
                  </Button>
                </Link>
              ))}
              {!isExpoMode() && (
                <>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openPricing();
                    }}
                    data-testid="button-mobile-pricing"
                  >
                    Pricing
                  </Button>
                  <div className="pt-2 mt-2 border-t border-border/40 flex flex-col gap-2">
                    <Link href="/login">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setMobileMenuOpen(false)}
                        data-testid="button-mobile-login"
                      >
                        Log in
                      </Button>
                    </Link>
                    <Link href="/signup">
                      <Button
                        className="w-full"
                        onClick={() => setMobileMenuOpen(false)}
                        data-testid="button-mobile-signup"
                      >
                        Sign up
                      </Button>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
      
      <PricingDialog open={isOpen} onOpenChange={closePricing} />
    </header>
  );
}
