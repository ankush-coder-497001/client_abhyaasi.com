import { FloatingDock } from "../../aceternity-ui/floating-dock";
import { IconHome, IconBrandTabler, IconBriefcase } from "@tabler/icons-react";

function Navbar() {
  const links = [
    {
      title: "Home",
      icon: <IconHome className="h-full w-full text-neutral-300" />,
      href: "/dashboard",
    },

    {
      title: "Dashboard",
      icon: <IconBrandTabler className="h-full w-full text-neutral-300" />,
      href: "/dashboard",
    },
    {
      title: "Courses",
      icon: <IconBriefcase className="h-full w-full text-neutral-300" />,
      href: "/courses",
    },
  ];

  return (
    <>
      <FloatingDock
        mobileClassName="fixed bottom-[10%] left-[5%] z-50 pointer-events-auto"
        desktopClassName={
          "fixed bottom-[5%] left-[50%] -translate-x-1/2 z-50 pointer-events-auto"
        }
        items={links}
      />
    </>
  );
}

export default Navbar;
