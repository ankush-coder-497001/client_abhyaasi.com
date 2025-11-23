import Navbar from "../ui/Navbar.jsx";
import Sidebar from "./Sidebar.jsx";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <>
      {/* <Navbar /> */}
      <Sidebar>
        <Outlet />
      </Sidebar>
    </>
  );
};

export default DashboardLayout;
