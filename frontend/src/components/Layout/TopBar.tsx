import { Link } from "react-router-dom";
import { Bell, Shield } from "lucide-react";
import { useUnacknowledgedCount } from "@/lib/hooks/use-alerts";

export function TopBar() {
  const { data: alertCount } = useUnacknowledgedCount();

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card px-6">
      {/* Mobile logo */}
      <div className="flex items-center gap-3 lg:hidden">
        <Shield className="h-5 w-5 text-primary" />
        <span className="font-bold">CyberTrace</span>
      </div>

      <div className="hidden lg:block">
        <h2 className="text-sm text-muted-foreground">
          Security Incident Logging & Analysis
        </h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Live status */}
        <div className="hidden sm:flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          <span className="text-xs text-muted-foreground">Monitoring</span>
        </div>

        {/* Alert bell */}
        <Link
          to="/alerts"
          className="relative rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        >
          <Bell size={18} />
          {alertCount != null && alertCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white">
              {alertCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
