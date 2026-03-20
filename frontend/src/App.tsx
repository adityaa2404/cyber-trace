import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Dashboard from "./pages/Dashboard/Dashboard";
import IncidentList from "./pages/Incidents/IncidentList";
import IncidentForm from "./pages/Incidents/IncidentForm";
import UserList from "./pages/Users/UserList";
import UserForm from "./pages/Users/UserForm";
import SystemList from "./pages/Systems/SystemList";
import SystemForm from "./pages/Systems/SystemForm";
import AlertList from "./pages/Alerts/AlertList";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
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
