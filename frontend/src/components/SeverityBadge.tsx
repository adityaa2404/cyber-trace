import Chip from "@mui/material/Chip";
import { SEVERITY_COLORS, type SeverityLevel } from "../utils/constants";

export default function SeverityBadge({ severity }: { severity: SeverityLevel }) {
  return (
    <Chip
      label={severity}
      size="small"
      sx={{ bgcolor: SEVERITY_COLORS[severity], color: "#fff", fontWeight: 600 }}
    />
  );
}
