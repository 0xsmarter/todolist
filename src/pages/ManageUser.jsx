import React, { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import "./ManageUser.css";

const ManageUser = ({ users, onAddUser, onDeleteUser, onToggleStatus }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState("Viewer");

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setNewUserName("");
    setNewUserEmail("");
    setNewUserRole("Viewer");
  };

  const handleAdd = () => {
    if (onAddUser && newUserName && newUserEmail) {
      onAddUser({ name: newUserName, email: newUserEmail, role: newUserRole });
      closeModal();
    }
  };

  return (
    <div className="manage-user-container">
      <div className="manage-user-header">
        <h2 className="manage-user-title">Manage Users</h2>
        <button onClick={openModal} className="add-user-btn">
          Add User
        </button>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Email</th>
              <th className="p-4 font-medium">Role</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(users || []).map((user) => (
              <tr key={user.id}>
                <td className="p-4">
                  <div className="user-info-cell">
                    <div className="user-avatar-small">
                      {user.name.charAt(0)}
                    </div>
                    <span className="user-name">{user.name}</span>
                  </div>
                </td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">{user.role}</td>
                <td className="p-4">
                  <span
                    onClick={() => onToggleStatus && onToggleStatus(user.id)}
                    className={`status-badge ${user.status === "Active" ? "active" : "inactive"}`}
                    title="Click to toggle status"
                  >
                    {user.status}
                  </span>
                </td>
                <td className="actions-cell">
                  <div className="actions-wrapper">
                    <button className="action-btn">
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => onDeleteUser && onDeleteUser(user.id)}
                      className="action-btn delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Add New User</h3>
            </div>
            <div className="modal-form">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  className="form-input"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. john@example.com"
                  className="form-input"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">User Role</label>
                <select
                  className="form-select"
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                >
                  <option value="Admin">Admin</option>
                  <option value="Editor">Editor</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={closeModal} className="modal-btn cancel">
                Cancel
              </button>
              <button onClick={handleAdd} className="modal-btn confirm">
                Create User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUser;
