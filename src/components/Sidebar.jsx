import React from "react";
import { NavLink, Link } from "react-router-dom";
import { Users, Edit3, FileText, CheckSquare, FolderKanban } from "lucide-react";
import "./Sidebar.css";

const Sidebar = () => {
  const navItems = [
    { name: "Manage User", path: "/manage-user", icon: Users },
{ name: "Projects", path: "/projects", icon: FolderKanban },
    { name: "Edit task progress", path: "/edit-task", icon: Edit3 },
    { name: "Report", path: "/report", icon: CheckSquare },
  ];

  const bottomItems = [{ name: "Report", path: "/report", icon: FileText }];

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <Link to="/dashboard" className="sidebar-logo-area">
          <h1 className="sidebar-title">
            <div className="sidebar-logo-icon">
              <CheckSquare size={20} color="white" />
            </div>
            TaskApp
          </h1>
        </Link>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
            >
              <item.icon size={20} />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="sidebar-bottom">
        {bottomItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            <item.icon size={20} />
            {item.name}
          </NavLink>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
