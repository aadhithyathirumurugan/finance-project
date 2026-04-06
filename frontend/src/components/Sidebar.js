import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Users,
  LogOut,
} from "lucide-react";

const Sidebar = () => {
  const { user, logout, hasRole } = useAuth();

  const links = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard", show: true },
    { path: "/records", icon: FileText, label: "Records", show: true },
    { path: "/analytics", icon: BarChart3, label: "Analytics", show: hasRole("ANALYST") || hasRole("ADMIN") },
    { path: "/users", icon: Users, label: "Users", show: hasRole("ADMIN") },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-text">
          <span className="sidebar-brand-name">FinTrack</span>
          <span className="sidebar-brand-sub">Finance Manager</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-title">Menu</div>
        {links
          .filter((l) => l.show)
          .map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `sidebar-link${isActive ? " active" : ""}`
                }
              >
                <Icon />
                {item.label}
              </NavLink>
            );
          })}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.name || "User"}</div>
            <div className="sidebar-user-role">{user?.role || "—"}</div>
          </div>
          <button
            className="sidebar-logout-btn"
            onClick={logout}
            title="Sign out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
