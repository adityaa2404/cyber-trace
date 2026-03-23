import { Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/app-layout";
import Dashboard from "./pages/dashboard";
import IncidentList from "./pages/incidents/incident-list";
import IncidentForm from "./pages/incidents/incident-form";
import UserList from "./pages/users/user-list";
import UserForm from "./pages/users/user-form";
import SystemList from "./pages/systems/system-list";
import SystemForm from "./pages/systems/system-form";
import AlertList from "./pages/alerts/alert-list";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/incidents" element={<IncidentList />} />
        <Route path="/incidents/new" element={<IncidentForm />} />
        <Route path="/incidents/:id/edit" element={<IncidentForm />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/users/new" element={<UserForm />} />
        <Route path="/users/:id/edit" element={<UserForm />} />
        <Route path="/systems" element={<SystemList />} />
        <Route path="/systems/new" element={<SystemForm />} />
        <Route path="/systems/:id/edit" element={<SystemForm />} />
        <Route path="/alerts" element={<AlertList />} />
      </Route>
    </Routes>
  );
}
