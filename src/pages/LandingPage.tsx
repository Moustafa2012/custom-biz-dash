import { useNavigate } from "react-router-dom";
import { ShoppingCart, Landmark, Package, ArrowRight, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";

const apps = [
  {
    id: "sales",
    title: "Sales",
    description: "Manage orders, customers, quotations, invoices, and returns in one place.",
    icon: ShoppingCart,
    gradient: "erp-gradient-sales",
    color: "text-erp-sales",
    route: "/sales",
  },
  {
    id: "finance",
    title: "Finance",
    description: "General ledger, chart of accounts, journal entries, payables, and receivables.",
    icon: Landmark,
    gradient: "erp-gradient-finance",
    color: "text-erp-finance",
    route: "/finance",
  },
  {
    id: "inventory",
    title: "Inventory & Manufacturing",
    description: "Items, warehouses, stock transfers, bill of materials, and production orders.",
    icon: Package,
    gradient: "erp-gradient-inventory",
    color: "text-erp-inventory",
    route: "/inventory",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setIntendedRoute = useAuthStore((s) => s.setIntendedRoute);

  const handleAppClick = (route: string) => {
    if (isAuthenticated) {
      navigate(route);
    } else {
      setIntendedRoute(route);
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
              <Layers className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-heading font-bold tracking-tight text-foreground">ERP Suite</span>
          </div>
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <Button size="sm" onClick={() => navigate("/sales")}>
                Open App <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            ) : (
              <Button size="sm" variant="outline" onClick={() => navigate("/login")}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold tracking-tight text-foreground mb-5 opacity-0 animate-fade-up">
            Your Business,{" "}
            <span className="text-primary">Unified</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto opacity-0 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            A modular ERP system for sales, finance, and inventory management. Choose an app to get started.
          </p>
        </div>

        {/* App cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full px-4">
          {apps.map((app, i) => (
            <button
              key={app.id}
              onClick={() => handleAppClick(app.route)}
              className={cn(
                "group relative flex flex-col items-start p-6 rounded-2xl border border-border/50",
                "bg-card hover:bg-card/80 transition-all duration-300",
                "hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1",
                "text-left opacity-0 animate-fade-up focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              )}
              style={{ animationDelay: `${0.2 + i * 0.1}s` }}
            >
              <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl mb-4", app.gradient)}>
                <app.icon className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-lg font-heading font-semibold text-foreground mb-2">{app.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">{app.description}</p>
              <div className="flex items-center gap-1.5 mt-4 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {isAuthenticated ? "Open" : "Get Started"} <ArrowRight className="h-4 w-4" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-6">
        <div className="container text-center">
          <p className="text-xs text-muted-foreground">ERP Suite — Modular Enterprise Resource Planning</p>
        </div>
      </footer>
    </div>
  );
}
