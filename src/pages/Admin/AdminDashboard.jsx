import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import {
  Home,
  Car,
  Users,
  Calendar,
  BarChart3,
  LogOut,
  Menu,
  X
} from "lucide-react";

// Pages
import AdminOverview from "./AdminOverview";
import CarManagement from "./CarManagement";
import UserManagement from "./UserManagement";
import TestDriveManagement from "./TestDriveManagement";

const AdminDashboard = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentUser, setCurrentUser] = useState({ name: "Admin", avatar: "/default-avatar.png" });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.name) {
      setCurrentUser({ name: user.name, avatar: "/default-avatar.png" });
    }
  }, []);

  const handleLogout = () => {
    console.log("Logging out...");
    // 👉 real logout logic
  };

  const navigation = [
    { name: "Overview", href: "/admin", icon: Home, current: location.pathname === "/admin" },
    { name: "Car Management", href: "/admin/cars", icon: Car, current: location.pathname === "/admin/cars" },
    { name: "User Management", href: "/admin/users", icon: Users, current: location.pathname === "/admin/users" },
    { name: "Test Drives", href: "/admin/test-drives", icon: Calendar, current: location.pathname === "/admin/test-drives" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div
        className={`fixed md:relative z-40 md:z-auto inset-y-0 left-0 w-64 transform 
          ${sidebarOpen ? "translate-x-0" : "-translate-x-64"} 
          transition-transform duration-300 ease-in-out 
          md:translate-x-0 md:flex md:flex-col shadow-lg`}
      >
        <div className="flex min-h-0 flex-1 flex-col bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
          {/* Sidebar Header */}
          <div className="flex h-16 flex-shrink-0 items-center px-4 border-b border-gray-700">
            <Car className="h-8 w-8 text-orange-500" />
            <span className="ml-2 text-xl font-bold text-white tracking-wide">
              Admin Panel
            </span>
          </div>

          {/* Navigation */}
          <div className="flex flex-1 flex-col overflow-y-auto">
            <nav className="flex-1 px-3 py-4 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${item.current
                    ? "bg-orange-500 text-white shadow-md"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    } group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition duration-200`}
                >
                  <item.icon
                    className={`${item.current
                      ? "text-white"
                      : "text-gray-400 group-hover:text-gray-300"
                      } mr-3 flex-shrink-0 h-5 w-5`}
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-700">
            <button
              onClick={handleLogout}
              className="flex items-center w-full text-gray-300 hover:text-white hover:bg-red-600 px-3 py-2 rounded-lg transition"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="flex h-16 items-center justify-between bg-white px-6 shadow">
          <div className="flex items-center space-x-3">
            {/* Sidebar Toggle Button */}
            <button
              className="md:hidden text-gray-700 hover:text-gray-900"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          </div>

          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center border">
            <Users className="h-6 w-6 text-gray-600" />
          </div>
        </header>

        {/* Routes */}
        <main className="flex-1 bg-gray-50 p-6">
          <Routes>
            <Route index element={<AdminOverview />} />
            <Route path="cars" element={<CarManagement />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="test-drives" element={<TestDriveManagement />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
