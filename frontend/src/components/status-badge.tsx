import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import { STATUS_COLORS, type StatusOption } from "@/lib/constants";

export function StatusBadge({ status }: { status: StatusOption }) {
  return <Badge className={cn(STATUS_COLORS[status])}>{status}</Badge>;
}
