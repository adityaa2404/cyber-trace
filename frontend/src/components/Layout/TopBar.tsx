import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useNavigate } from "react-router-dom";
import { useUnacknowledgedCount } from "../../hooks/useAlerts";
import { DRAWER_WIDTH } from "./Sidebar";
import { ROUTES } from "../../utils/constants";

export default function TopBar() {
  const navigate = useNavigate();
  const { data: alertCount } = useUnacknowledgedCount();

  return (
    <AppBar position="fixed" sx={{ width: `calc(100% - ${DRAWER_WIDTH}px)`, ml: `${DRAWER_WIDTH}px` }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Security Incident Logging & Analysis
        </Typography>
        <IconButton color="inherit" onClick={() => navigate(ROUTES.ALERTS)}>
          <Badge badgeContent={alertCount || 0} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
