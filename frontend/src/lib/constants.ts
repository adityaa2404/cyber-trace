export const SEVERITY_LEVELS = ["Low", "Medium", "High", "Critical"] as const;
export type SeverityLevel = (typeof SEVERITY_LEVELS)[number];

export const STATUS_OPTIONS = [
  "Open",
  "Investigating",
  "Resolved",
  "Closed",
] as const;
export type StatusOption = (typeof STATUS_OPTIONS)[number];

export const SEVERITY_COLORS: Record<SeverityLevel, string> = {
  Low: "bg-green-500/15 text-green-400 border-green-500/25",
  Medium: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  High: "bg-red-500/15 text-red-400 border-red-500/25",
  Critical: "bg-red-700/20 text-red-300 border-red-600/30 animate-pulse-glow",
};

export const STATUS_COLORS: Record<StatusOption, string> = {
  Open: "bg-blue-500/15 text-blue-400 border-blue-500/25",
  Investigating: "bg-purple-500/15 text-purple-400 border-purple-500/25",
  Resolved: "bg-green-500/15 text-green-400 border-green-500/25",
  Closed: "bg-gray-500/15 text-gray-400 border-gray-500/25",
};

export const CHART_COLORS = [
  "#06b6d4",
  "#8b5cf6",
  "#f59e0b",
  "#ef4444",
  "#22c55e",
  "#ec4899",
  "#f97316",
  "#14b8a6",
  "#6366f1",
  "#84cc16",
];
