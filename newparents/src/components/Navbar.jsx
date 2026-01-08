import React from "react";
import { NavLink } from "react-router-dom";
import { Home, BookOpen, Headphones, CalendarHeart } from "lucide-react";

const Navbar = () => {
  const navItems = [
    { name: "Accueil", path: "/", icon: Home },

    { name: "Articles", path: "/publications", icon: BookOpen },

    { name: "Audios", path: "/audios", icon: Headphones },

    { name: "Ateliers", path: "/ateliers", icon: CalendarHeart },
  ];

  return (
    <nav className="fixed bottom-2 left-0 right-0 z-50">
      <div className="bg-[rgba(252,251,248,1)] m-2 px-6 py-3 rounded-[999px] shadow-[0_-5px_20px_rgba(0,0,0,0.06)] flex justify-between items-center h-20">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => `
              flex flex-col items-center justify-center w-16 transition-all duration-300 ease-in-out
              ${
                isActive
                  ? "text-[#2CADA4] transform -translate-y-1"
                  : "text-gray-400 hover:text-gray-500"
              }
            `}
          >
            {({ isActive }) => (
              <>
                <item.icon
                  size={isActive ? 28 : 24}
                  strokeWidth={isActive ? 2.5 : 2}
                  className="mb-1"
                />

                {isActive && (
                  <span className="h-1.5 w-1.5 rounded-full bg-[#2CADA4]" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
