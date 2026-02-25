import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "./Layout.css";

const Layout = ({ children, searchQuery, onSearchChange, users }) => {
  return (
    <div className="layout-container">
      <Sidebar />

      <div className="layout-content">
        <Header searchQuery={searchQuery} onSearchChange={onSearchChange} users={users} />

        <main className="main-content">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
