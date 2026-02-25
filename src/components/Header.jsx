import React, { useMemo } from "react";
import { Search, Bell, Sun } from "lucide-react";
import "./Header.css";

const Header = ({ searchQuery, onSearchChange, users }) => {
  const currentUser = users?.[0];

  const initials = useMemo(() => {
    if (!currentUser?.name) return "KA";
    const parts = currentUser.name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return currentUser.name.slice(0, 2).toUpperCase();
  }, [currentUser]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <header className="header">
      <div className="header-greeting">
        <Sun size={18} className="greeting-icon" />
        <span className="greeting-text">{getGreeting()}</span>
      </div>

      <div className="header-right">
        <div className="search-box-wrapper">
          <div className="search-icon-wrapper">
            <Search size={18} className="search-icon" />
          </div>
          <input
            type="text"
            placeholder="Search tasks..."
            className="header-search-input"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="user-actions">
          <button className="notification-btn" title="Notifications">
            <Bell size={20} />
            <span className="notification-badge"></span>
          </button>
          <div className="user-avatar" title={currentUser?.name || "User"}>
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
