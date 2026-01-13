import React from "react";
import "./Dashboard.css";

const Dashboard = ({ tasks }) => {
  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">
        Dashboard
      </h2>

      <div className="dashboard-stats-grid">
        <div className="stat-card">
          <h3 className="stat-title">
            Total Users
          </h3>
          <p className="stat-value">1,234</p>
          <div className="stat-progress-bar">
            <div
              className="stat-progress-fill"
              style={{ width: "85%" }}
            ></div>
          </div>
        </div>

        <div className="stat-card delay-100">
          <h3 className="stat-title">
            Active Tasks
          </h3>
          <p className="stat-value">{tasks?.length || 0}</p>
          <div className="stat-progress-bar">
            <div
              className="stat-progress-fill"
              style={{ width: "60%" }}
            ></div>
          </div>
        </div>

        <div className="stat-card delay-200">
          <h3 className="stat-title">
            Pending Reports
          </h3>
          <p className="stat-value">7</p>
          <div className="stat-progress-bar">
            <div
              className="stat-progress-fill"
              style={{ width: "30%" }}
            ></div>
          </div>
        </div>
      </div>

      <div className="dashboard-empty-state">
        <p>Select an activity from the sidebar to get started.</p>
      </div>
    </div>
  );
};

export default Dashboard;
