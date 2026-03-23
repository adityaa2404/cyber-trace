import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShieldAlert,
  Users,
  Server,
  Bell,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUnacknowledgedCount } from "@/lib/hooks/use-alerts";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/incidents", label: "Incidents", icon: ShieldAlert },
  { to: "/users", label: "Users", icon: Users },
  { to: "/systems", label: "Systems", icon: Server },
  { to: "/alerts", label: "Alerts", icon: Bell },
];

export function Sidebar() {
  const location = useLocation();
  const { data: alertCount } = useUnacknowledgedCount();

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-border px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 border border-primary/25">
          <Shield className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-base font-bold text-foreground tracking-tight">
            CyberTrace
          </h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            SIEM Platform
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive =
            item.to === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.to);
          const Icon = item.icon;

          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground border border-transparent"
              )}
            >
              <Icon size={18} />
              <span>{item.label}</span>
              {item.label === "Alerts" &&
                alertCount != null &&
                alertCount > 0 && (
                  <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-destructive px-1.5 text-[10px] font-bold text-white">
                    {alertCount}
                  </span>
                )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border px-6 py-4">
        <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">
          Security Incident Logging
        </p>
        <p className="text-[10px] text-muted-foreground/60">
          & Analysis System v0.1
        </p>
      </div>
    </aside>
  );
}
