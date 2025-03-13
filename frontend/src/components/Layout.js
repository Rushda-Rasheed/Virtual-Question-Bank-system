
"use client";

import React, { useState, useEffect, useContext } from "react";
import {
  FiMenu,
  FiGrid,
  FiBook,
  FiUsers,
  FiBarChart2,
  FiClipboard,
  FiList,
  FiBell,
} from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/router";
import AuthContext from "@/context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Layout = ({ children }) => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profilePic, setProfilePic] = useState(null);
  const [username, setUsername] = useState("");
  const [hovered, setHovered] = useState(false);
  const { isLoggedIn, handleLogout, userRole, notifications, fetchNotifications } =
    useContext(AuthContext);

  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      fetchNotifications();
    }
  }, [isLoggedIn]);

  const allowedRoutesForNotifications = [
    "/user/dashboard",
    "/user/practice",
    "/user/result",
    "/user/activities",
    "/user/sendMessage",
  ];

  const getSidebarLinks = () => {
    if (
      [
        "/admin/dashboard",
        "/admin/subjects",
        "/admin/topics",
        "/admin/questions",
        "/admin/users",
        "/admin/analytics",
        "/admin/viewMessages",
      ].includes(router.pathname)
    ) {
      return [
        { path: "/admin/dashboard", label: "Dashboard", icon: FiGrid },
        { path: "/admin/subjects", label: "Manage Subjects", icon: FiBook },
        { path: "/admin/topics", label: "Manage Topics", icon: FiList },
        { path: "/admin/questions", label: "Manage Questions", icon: FiGrid },
        { path: "/admin/users", label: "Manage Users", icon: FiUsers },
        { path: "/admin/analytics", label: "Analytics & Reports", icon: FiBarChart2 },
        { path: "/admin/viewMessages", label: "View Messages", icon: FiClipboard },
      ];
    } else if (allowedRoutesForNotifications.includes(router.pathname)) {
      return [
        { path: "/user/dashboard", label: "Dashboard", icon: FiGrid },
        { path: "/user/practice", label: "Practice Questions", icon: FiUsers },
        { path: "/user/result", label: "Performance Analysis", icon: FiBarChart2 },
        { path: "/user/sendMessage", label: "Send Message", icon: FiClipboard },
      ];
    } else {
      return [];
    }
  };

  return (
    <div className="min-h-screen flex bg-white text-black">
      <aside
        className={`bg-gray-800 fixed h-full shadow-md transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        <div className="flex items-center justify-between p-4">
          <button
            className="text-white focus:outline-none"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <FiMenu size={24} />
          </button>
          <img src="/images/logo.svg" alt="Logo" className="ml-4 h-8 w-auto" />
        </div>
        <nav className="mt-10">
          {getSidebarLinks().map((link) => (
            <Link key={link.path} href={link.path} passHref>
              <div
                className={`flex items-center py-2.5 px-4 rounded transition duration-200 cursor-pointer text-white ${
                  router.pathname === link.path ? "bg-blue-500" : "hover:bg-blue-500"
                }`}
              >
                <link.icon className="mr-4" />
                {sidebarOpen && link.label}
              </div>
            </Link>
          ))}
        </nav>
      </aside>

      <div
        className={`flex-1 ${sidebarOpen ? "ml-64" : "ml-20"} transition-all duration-300`}
      >
        <header className="bg-white p-4 shadow-md flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold">
              <span className="text-red-800">V</span>
              <span className="text-blue-500">Q</span>
              <span className="text-red-800">BS</span>
            </h1>
            <span className="ml-2 text-lg font-bold">Virtual Question Bank System</span>
          </div>

          <div className="flex items-center">
            {!isLoggedIn ? (
              <>
                <Link href="/login" passHref>
                  <div className="px-4 py-2 bg-black text-white border border-black rounded-md hover:bg-gray-200 hover:text-black transition cursor-pointer">
                    Signin
                  </div>
                </Link>
                <Link href="/register" passHref>
                  <div className="ml-4 px-4 py-2 bg-black text-white border border-black rounded-md hover:bg-gray-200 hover:text-black transition cursor-pointer">
                    Signup
                  </div>
                </Link>
              </>
            ) : null}

            
            {isLoggedIn && allowedRoutesForNotifications.includes(router.pathname) && (
              <div
                className="relative ml-4"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <FiBell size={24} className="cursor-pointer text-black" />
                {Array.isArray(notifications) && notifications.length > 0 && (
                  <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full px-2 py-1">
                    {notifications.length}
                  </span>
                )}
                {showNotifications && (
                  <div className="absolute top-8 right-0 bg-white shadow-lg rounded-md p-4 w-64">
                    <div className="text-lg font-bold mb-2">Notifications</div>
                    {Array.isArray(notifications) && notifications.length === 0 ? (
                      <div>No notifications</div>
                    ) : (
                      <div>
                        {notifications?.notifications.map((notif, index) => (
                          <div key={index} className="py-1 text-sm">
                            {notif.message}
                          </div>
                        
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

                <div
                onClick={() => router.push("/profile")} // Navigate to the profile page
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                className="ml-4 flex flex-col items-center cursor-pointer relative"
              >
                <div className="h-10 w-10 bg-black rounded-full flex items-center justify-center text-white">
                  {profilePic ? (
                    <img
                      src={profilePic}
                      alt="Profile"
                      className="h-10 w-10 rounded-full"
                    />
                  ) : (
                    <FaUserCircle size={32} className="text-gray-300" />
                  )}
                
              </div>
              {username && <span className="text-black text-sm mt-1">{username}</span>}
              {hovered && (
                <div className="absolute top-12 left-0 bg-white shadow-lg rounded-md p-2 w-36">
                  <div className="py-2 text-sm font-semibold">{username}</div>
                  <Link
                    href="/login"
                    className="py-2 text-xs cursor-pointer hover:bg-gray-200  text-black"
                  >
                   Edit Profile
                  </Link>
                  <div
                    className="py-2 text-xs cursor-pointer hover:bg-gray-200  text-red-500"
                    onClick={handleLogout}
                  >
                    Logout
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="p-4">{children}</main>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Layout;
