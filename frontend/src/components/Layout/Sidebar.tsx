import { useNavigate, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import PeopleIcon from "@mui/icons-material/People";
import DnsIcon from "@mui/icons-material/Dns";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useUnacknowledgedCount } from "../../hooks/useAlerts";
import { ROUTES } from "../../utils/constants";

const DRAWER_WIDTH = 240;

const NAV_ITEMS = [
  { label: "Dashboard", icon: <DashboardIcon />, path: ROUTES.DASHBOARD },
  { label: "Incidents", icon: <ReportProblemIcon />, path: ROUTES.INCIDENTS },
  { label: "Users", icon: <PeopleIcon />, path: ROUTES.USERS },
  { label: "Systems", icon: <DnsIcon />, path: ROUTES.SYSTEMS },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { data: alertCount } = useUnacknowledgedCount();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": { width: DRAWER_WIDTH, boxSizing: "border-box", bgcolor: "background.paper" },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" fontWeight={700} color="primary">
          CyberTrace
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Security Incident Dashboard
        </Typography>
      </Box>
      <List>
        {NAV_ITEMS.map((item) => (
          <ListItemButton
            key={item.path}
            selected={pathname === item.path}
            onClick={() => navigate(item.path)}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
        <ListItemButton
          selected={pathname === ROUTES.ALERTS}
          onClick={() => navigate(ROUTES.ALERTS)}
        >
          <ListItemIcon sx={{ minWidth: 36 }}>
            <Badge badgeContent={alertCount || 0} color="error">
              <NotificationsIcon />
            </Badge>
          </ListItemIcon>
          <ListItemText primary="Alerts" />
        </ListItemButton>
      </List>
    </Drawer>
  );
}

export { DRAWER_WIDTH };
