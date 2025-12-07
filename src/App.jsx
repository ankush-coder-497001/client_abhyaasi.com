import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { initializeGoogleSDK } from "./utils/googleOAuth";
import "./styles/premium-dashboard.css";
import { AppProvider } from "./context/AppContext";
import DashboardLayout from "./components/layout/DashboardLayout.jsx";
import ProtectedRoute from "./utils/ProtectedRoute.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import Profile from "./pages/dashboard/Profile.jsx";
import Courses from "./pages/courses/Courses.jsx";
import Professions from "./pages/professions/Professions.jsx";
import Setting from "./pages/dashboard/Setting.jsx";
import ModuleLayout from "./components/layout/module-layout.jsx";
import AuthContainer from "./components/auth/auth-container.jsx";
import TokenExpired from "./pages/auth/TokenExpired.jsx";
import CourseDetails from "./pages/courses/CourseDetails.jsx";
import ProfessionDetails from "./pages/professions/ProfessionDetails.jsx";
import { Toaster } from "react-hot-toast";

function App() {
  useEffect(() => {
    // Initialize Google SDK on app load
    initializeGoogleSDK().catch(err => console.error('Failed to initialize Google SDK:', err));
  }, []);

  return (
    <BrowserRouter>
      <AppProvider>
        <Toaster position="bottom-left" reverseOrder={false} />

        <Routes>
          {/* public routes */}
          <Route path="/" element={<AuthContainer />} />
          <Route path="/tokenexpired" element={<TokenExpired />} />
          {/* protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/professions" element={<Professions />} />
              <Route path="/setting" element={<Setting />} />
              <Route path="/course-details/:courseId" element={<CourseDetails />} />
              <Route path="/profession-details/:professionId" element={<ProfessionDetails />} />
            </Route>
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/module/:moduleId" element={<ModuleLayout />} />
          </Route>
          {/* course details */}
          <Route element={<ProtectedRoute />}>
            <Route path="/course-details" element={<CourseDetails />} />
          </Route>
          {/* fall back */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );

}

export default App;
