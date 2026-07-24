import { NavLink, useLocation } from "react-router-dom";

import homeBlackIcon from "@/assets/icons/bottom-nav/home-black.svg";
import homeGreenIcon from "@/assets/icons/bottom-nav/home-green.svg";
import calendarBlackIcon from "@/assets/icons/bottom-nav/calendar-black.svg";
import calendarGreenIcon from "@/assets/icons/bottom-nav/calendar-green.svg";
import mypageBlackIcon from "@/assets/icons/bottom-nav/mypage-black.svg";
import mypageGreenIcon from "@/assets/icons/bottom-nav/mypage-green.svg";

const bottomNavItems = [
    {
      label: "home",
      to: "/",
      icon: homeBlackIcon,
      activeIcon: homeGreenIcon,
    },
    {
      label: "calendar",
      to: "/calendar",
      icon: calendarBlackIcon,
      activeIcon: calendarGreenIcon,
    },
    {
      label: "mypage",
      to: "/mypage",
      icon: mypageBlackIcon,
      activeIcon: mypageGreenIcon,
    },
];

export function BottomNavigation() {
  const { pathname } = useLocation();

  if (!["/", "/calendar", "/mypage"].includes(pathname)) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-[90px] bg-black-900 pb-[env(safe-area-inset-bottom)]">
      <div className="flex h-full w-full">
        {bottomNavItems.map((item) => (
            <NavLink
            key={item.to}
            to={item.to}
            aria-label={item.label}
            className="flex h-full flex-1 items-center justify-center active:scale-95"
            >
            {({ isActive }) => (
                <img
                src={isActive ? item.activeIcon : item.icon}
                alt=""
                className="h-5 w-5 md:h-7 md:w-7 lg:h-8 lg:w-8"
                />
            )}
            </NavLink>
        ))}
        </div>
    </nav>
  );
}
