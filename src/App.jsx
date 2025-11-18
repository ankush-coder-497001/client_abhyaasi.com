import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./styles/premium-dashboard.css";
import UnderConstruction from "./pages/under-construction/UnderConstruction.jsx";
import DashboardLayout from "./components/layout/DashboardLayout.jsx";
import ProtectedRoute from "./utils/ProtectedRoute.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import Profile from "./pages/dashboard/Profile.jsx";
import Courses from "./pages/dashboard/Courses.jsx";
import Professions from "./pages/dashboard/Professions.jsx";
import Setting from "./pages/dashboard/Setting.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* public routes */}
        <Route path="/" element={<UnderConstruction />} />

        {/* protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/professions" element={<Professions />} />
            <Route path="/setting" element={<Setting />} />
          </Route>
        </Route>
        {/* fall back */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
