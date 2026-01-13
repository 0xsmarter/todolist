import React from "react";
import { BarChart, Clock, FileText } from "lucide-react";
import "./Report.css";

const Report = ({ tasks, activities }) => {
  const chartData = tasks && tasks.length > 0
    ? tasks.slice(-7).map(t => t.progress)
    : [0, 0, 0, 0, 0, 0, 0];

  return (
    <div className="report-container">
      <h2 className="report-title">Reports</h2>

      <div className="report-grid">
        <div className="report-card">
          <div className="card-header">
            <div className="icon-wrapper blue">
              <BarChart size={24} />
            </div>
            <h3 className="card-title">
              Productivity Stats
            </h3>
          </div>
          <div className="chart-container">
            {chartData.map((h, i) => (
              <div
                key={i}
                className="chart-bar"
                style={{ height: `${h}%` }}
              >
                <span className="chart-label">
                  {h}%
                </span>
              </div>
            ))}
          </div>
          <p className="card-description">
            Live task completion overview.
          </p>
        </div>

        <div className="report-card animate-slide-in-right">
          <div className="card-header">
            <div className="icon-wrapper green">
              <Clock size={24} />
            </div>
            <h3 className="card-title">
              Recent Activities
            </h3>
          </div>
          <div className="activities-list">
            {activities && activities.length > 0 ? (
              activities.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-info">
                    <FileText size={16} className="activity-icon" />
                    <span className="activity-text">{activity.text}</span>
                  </div>
                  <span className="activity-time">{activity.time}</span>
                </div>
              ))
            ) : (
              <div className="activity-item" style={{ justifyContent: 'center', opacity: 0.7 }}>
                <span className="activity-text">No recent activity logs found.</span>
              </div>
            )}
          </div>
          <button className="view-all-btn" disabled={!activities || activities.length === 0} style={{ opacity: activities && activities.length > 0 ? 1 : 0.5 }}>
            View All Logs
          </button>
        </div>
      </div>
    </div>
  );
};

export default Report;
