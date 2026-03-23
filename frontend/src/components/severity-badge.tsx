import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import { SEVERITY_COLORS, type SeverityLevel } from "@/lib/constants";

export function SeverityBadge({ severity }: { severity: SeverityLevel }) {
  return (
    <Badge className={cn(SEVERITY_COLORS[severity])}>{severity}</Badge>
  );
}
