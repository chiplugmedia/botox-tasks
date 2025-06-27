import { Lightbulb, Menu, Sparkles, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  menuItems,
  PRODUCTIVITY_CARD,
  SIDEBAR_CLASSES,
  LINK_CLASSES,
  TIP_CARD,
} from "../assets/dummy";

const Sidebar = ({ user, tasks }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  // const [showModal, setShowModal] = useState(false);

  const totalTasks = tasks?.length || 0;
  const completedTasks = tasks?.filter((t) => t.completed).length || 0;
  const productivity =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const username = user?.name || "user";
  const initial = username.charAt(0).toUpperCase();

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileOpen]);

  const renderMenuItems = (isMobile = false) => (
    <ul className="space-y-2">
      {menuItems.map(({ text, path, icon }) => (
        <li key={text}>
          <NavLink
            to={path}
            className={({ isActive }) =>
              [
                LINK_CLASSES.base,
                isActive ? LINK_CLASSES.active : LINK_CLASSES.inActive,
                isMobile ? "justify-start" : "lg:justify-start",
              ].join(" ")
            }
            onClick={() => setMobileOpen(false)}
          >
            <span className={LINK_CLASSES.icon}>{icon}</span>
            <span
              className={`${isMobile ? "block" : "hidden lg:block"} ${
                LINK_CLASSES.text
              }`}
            >
              {text}
            </span>
          </NavLink>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      {/* Desktop Dashboard */}
      <div className={SIDEBAR_CLASSES.desktop}>
        <div className="p-5 border-b border-purple-100 hidden lg:block">
          <div className="flex items-center gap-3">
            <div
              className="w-18 h-18 rounded-full bg-gradient-to-br from-fuchsia-500 to-blue-500
                 flex items-center justify-center text-white font-bold shadow-md"
            >
              {initial}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                Hello {username}
              </h2>
              <p className="text-sm text-blue-500 font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Let's crush some tasks!
              </p>
            </div>
          </div>
        </div>
        <div className="p-4 space-y-6 overflow-y-auto flex-1">
          <div className={PRODUCTIVITY_CARD.container}>
            <div className={PRODUCTIVITY_CARD.label}>PRODUCTIVITY</div>
            <span className={PRODUCTIVITY_CARD.badge}>{productivity}%</span>
            <div className={PRODUCTIVITY_CARD.barBg}>
              <div
                className={PRODUCTIVITY_CARD.barFg}
                style={{ width: `${productivity}%` }}
              ></div>
            </div>
          </div>
          {renderMenuItems()}
          <div className="mb-auto pt-6 hidden lg:block">
            <div className={TIP_CARD.container}>
              <div className="flex items-center gap-2">
                <div className={TIP_CARD.iconWrapper}>
                  <Lightbulb className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className={TIP_CARD.title}>Pro Tip</h3>
                  <p className={TIP_CARD.text}>
                    Use Keyboard shortcuts to boost productivity
                  </p>
                  <a
                    href="https://follow-panel.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-2 text-sm text-blue-500 hover:underline"
                  >
                    Visit Site
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE MENU BUTTON */}
      {!mobileOpen && (
        <button
          onClick={() => setMobileOpen(true)}
          className={SIDEBAR_CLASSES.mobileButton}
        >
          <Menu className="w-5 h-5" />
        </button>
      )}

      {/* MOBILE DRAWER */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40">
          <div
            className={SIDEBAR_CLASSES.mobileDrawerBackdrop}
            onClick={() => setMobileOpen(false)}
          />
          <div
            className={SIDEBAR_CLASSES.mobileDrawer}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h2 className="text-lg font-bold text-blue-600">Menu</h2>
              <button
                onClick={() => setMobileOpen(false)}
                className="text-gray-700 hover:text-blue-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center gap-3 mb-16">
              <div
                className="w-18 h-18 rounded-full bg-gradient-to-br from-fuchsia-500 to-blue-500
                 flex items-center justify-center text-white font-bold shadow-md"
              >
                {initial}
              </div>
              <div>
                <h2 className="text-lg font-bold mt-16 text-gray-800">
                  Hello {username}
                </h2>
                <p className="text-sm text-blue-500 font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Let's crush some tasks!
                </p>
              </div>
            </div>
            {renderMenuItems(true)}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
