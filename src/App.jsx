import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ManageUser from './pages/ManageUser';
import NewActivity from './pages/NewActivity';
import EditTask from './pages/EditTask';
import Report from './pages/Report';

function App() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([
    { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin", status: "Active" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", role: "Editor", status: "Active" },
    { id: 3, name: "Charlie Brown", email: "charlie@example.com", role: "Viewer", status: "Inactive" },
  ]);
  const [activities, setActivities] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const logActivity = (text) => {
    setActivities(prev => [{
      id: Date.now(),
      text,
      time: "Just now"
    }, ...prev].slice(0, 10));
  };

  const addTask = (newTask) => {
    setTasks([...tasks, { ...newTask, id: tasks.length + 1, progress: 0 }]);
    logActivity(`New task '${newTask.title}' created`);
  };

  const updateTask = (taskId, newProgress) => {
    const task = tasks.find(t => t.id === taskId);
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, progress: newProgress } : task
      )
    );
    if (task) logActivity(`Task '${task.title}' updated to ${newProgress}%`);
  };

  const addUser = (newUser) => {
    setUsers([...users, { ...newUser, id: users.length + 1, status: "Active" }]);
    logActivity(`New user '${newUser.name}' added`);
  };

  const deleteUser = (userId) => {
    const user = users.find(u => u.id === userId);
    setUsers(users.filter(user => user.id !== userId));
    if (user) logActivity(`User '${user.name}' deleted`);
  };

  const toggleUserStatus = (userId) => {
    const user = users.find(u => u.id === userId);
    setUsers(users.map(user =>
      user.id === userId
        ? { ...user, status: user.status === "Active" ? "Inactive" : "Active" }
        : user
    ));
    if (user) logActivity(`User '${user.name}' status changed to ${user.status === "Active" ? "Inactive" : "Active"}`);
  };

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Router>
      <Layout searchQuery={searchQuery} onSearchChange={setSearchQuery}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard tasks={tasks} />} />
          <Route path="/manage-user" element={<ManageUser users={users} onAddUser={addUser} onDeleteUser={deleteUser} onToggleStatus={toggleUserStatus} />} />
          <Route path="/new-activity" element={<NewActivity onAddTask={addTask} />} />
          <Route path="/edit-task" element={<EditTask tasks={filteredTasks} onUpdateTask={updateTask} />} />
          <Route path="/report" element={<Report tasks={tasks} activities={activities} />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
