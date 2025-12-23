import Navbar from "../ui/Navbar.jsx";
import Sidebar from "./Sidebar.jsx";
import { Outlet } from "react-router-dom";
import PageTransition from "./PageTransition.jsx";

const DashboardLayout = () => {
  return (
    <>
      {/* <Navbar /> */}
      <Sidebar>
        <PageTransition>
          <Outlet />
        </PageTransition>
      </Sidebar>
    </>
  );
};

export default DashboardLayout;
