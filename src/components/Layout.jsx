import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "./Layout.css";

const Layout = ({ children, searchQuery, onSearchChange }) => {
  return (
    <div className="layout-container">
      <Sidebar />

      <div className="layout-content">
        <Header searchQuery={searchQuery} onSearchChange={onSearchChange} />

        <main className="main-content">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
