import React from "react";
import { Search, Bell } from "lucide-react";
import "./Header.css";

const Header = ({ searchQuery, onSearchChange }) => {
  return (
    <header className="header">
      <div className="header-spacer"></div>

      <div className="header-right">
        <div className="search-box-wrapper">
          <div className="search-icon-wrapper">
            <Search
              size={18}
              className="search-icon"
            />
          </div>
          <input
            type="text"
            placeholder="Search"
            className="header-search-input"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="user-actions">
          <button className="notification-btn">
            <Bell size={20} />
            <span className="notification-badge"></span>
          </button>
          <div className="user-avatar">
            JD
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
