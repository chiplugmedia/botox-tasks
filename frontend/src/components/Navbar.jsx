import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Settings, LogOut } from "lucide-react"; // Changed from SquareMousePointer to LogOut for logout icon

const Navbar = ({ user = {}, onLogout }) => {
  const menuRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const handleMenuToggle = () => setMenuOpen((prev) => !prev);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setMenuOpen(false);
    onLogout();
  };

  return (
    <header className="sticky top-0 z-50 bg-white/50 backdrop-blur-md shadow-md border-b border-gray-200 font-sans">
      {/* Navigation Bar */}
      <div className="flex items-center justify-between px-4 py-3 md:px-6 max-w-7xl mx-auto">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => navigate("/")}
        >
          {/* Logo Image */}
          <div className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 via-blue-500 to-indigo-600 shadow-lg group-hover:scale-110 transition-all duration-300">
            <Settings className="w-6 h-6 text-white" />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-white rounded-full shadow-md animate-ping" />
          </div>
          {/* Brand Name */}
          <span className="text-2xl font-extrabold bg-gradient-to-b from-blue-500 to-indigo-600 text-transparent bg-clip-text">
            Botox
          </span>
        </div>

        {/* RIGHT SIDE */}
        <div>
          <nav className="flex items-center gap-4">
            <button
              className="p-2 text-gray-600 hover:text-gray-800 transition-colors duration-300 hover:bg-purple-50 rounded-full"
              onClick={() => navigate("/profile")}
            >
              <Settings className="w-5 h-5" />
            </button>

            {/* USER DROP DOWN MENU */}
            <div ref={menuRef} className="relative">
              <button
                onClick={handleMenuToggle}
                className="flex items-center gap-2 p-2 text-gray-600 hover:text-gray-800 transition-colors duration-300 border border-transparent hover:border-gray-300 rounded-lg cursor-pointer"
                aria-expanded={menuOpen}
                aria-label="User menu"
              >
                <div className="relative">
                  {user.avatar ? (
                    <img
                      className="w-8 h-8 rounded-full object-cover"
                      src={user.avatar}
                      alt="User Avatar"
                    />
                  ) : (
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white font-semibold">
                      {user.name?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse" />
                </div>

                <div className="text-left hidden md:block">
                  <p className="text-sm font-medium text-gray-800 line-clamp-1">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 font-normal line-clamp-1">
                    {user.email}
                  </p>
                </div>

                <ChevronDown
                  className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${
                    menuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {menuOpen && (
                <ul className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-50 overflow-hidden animate-fade-in">
                  <li>
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setMenuOpen(false);
                      }}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-purple-50 transition-colors duration-200 text-gray-700 cursor-pointer"
                    >
                      <Settings className="w-4 h-4" />
                      Profile Settings
                    </button>
                  </li>
                  <li className="border-t border-gray-100">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-red-50 transition-colors duration-200 text-red-600 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </li>
                </ul>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;