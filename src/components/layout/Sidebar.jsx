import React, { useState } from "react";
import {
  Sidebar as SidebarUI,
  SidebarBody,
  SidebarLink,
} from "../../aceternity-ui/sidebar";
import {
  IconBrandDatabricks,
  IconBrandTabler,
  IconBriefcase,
  IconSettings,
  IconUserBolt,
  IconLogout,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "../../lib/utils";
import { useNavigate } from "react-router-dom";
import LogoutModal from "../modals/LogoutModal";

function Sidebar({ children }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem('abhyaasi_authToken');
    localStorage.removeItem('abhyaasi_user');
    setShowLogoutModal(false);
    navigate('/');
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <IconBrandTabler className="h-5 w-5 shrink-0 text-black" />,
    },
    {
      label: "Profile",
      href: "/profile",
      icon: <IconUserBolt className="h-5 w-5 shrink-0 text-black" />,
    },
    {
      label: "Courses",
      href: "/courses",
      icon: <IconBriefcase className="h-5 w-5 shrink-0 text-black" />,
    },
    {
      label: "Professions",
      href: "/professions",
      icon: <IconBrandDatabricks className="h-5 w-5 shrink-0 text-black" />,
    },
  ];
  return (
    <div
      className={cn(
        "flex w-full flex-1 flex-col overflow-hidden md:flex-row h-screen"
      )}
    >
      <SidebarUI open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 text-black flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <SidebarLink
              link={{
                label: "Setting",
                href: "/setting",
                icon: <IconSettings className="h-5 w-5 shrink-0 text-black" />,
              }}
            />
            <button
              onClick={handleLogout}
              className="flex items-center justify-start space-x-2 rounded-md px-1 py-1 text-sm font-medium text-black hover:bg-gray-200 transition-colors duration-200 w-full cursor-pointer"
            >
              <IconLogout className="h-5 w-5 shrink-0 text-black" />
              <span className="whitespace-pre">{open ? 'Logout' : ''}</span>
            </button>
          </div>
        </SidebarBody>
      </SidebarUI>
      <div className="overflow-auto lg:p-6  w-full bg-linear-to-br from-gray-50 to-gray-100 ">
        {children}
      </div>

      <LogoutModal
        isOpen={showLogoutModal}
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
        useTablerIcon={true}
      />
    </div>
  );
}

export default Sidebar;
export const Logo = () => {
  return (
    <button
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-black"
      >
        Abhyaasi
      </motion.span>
    </button>
  );
};
export const LogoIcon = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-white" />
    </a>
  );
};
