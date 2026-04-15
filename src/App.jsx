import React, { useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ManageUser from './pages/ManageUser';
import NewProject from './pages/NewProject';
import EditTask from './pages/EditTask';
import Report from './pages/Report';
import usePersistedState from './hooks/usePersistedState';

const DATA_VERSION = 'v2';
if (localStorage.getItem('taskapp_version') !== DATA_VERSION) {
  localStorage.removeItem('taskapp_projects');
  localStorage.removeItem('taskapp_tasks');
  localStorage.removeItem('taskapp_activities');
  localStorage.setItem('taskapp_version', DATA_VERSION);
}

function App() {
  const [tasks, setTasks] = usePersistedState('taskapp_tasks', []);
  const [users, setUsers] = usePersistedState('taskapp_users', []);
  const [projects, setProjects] = usePersistedState('taskapp_projects', []);
  const [activities, setActivities] = usePersistedState('taskapp_activities', []);
  const [searchQuery, setSearchQuery] = usePersistedState('taskapp_search', "");

  const logActivity = (text) => {
    setActivities(prev => [{
      id: Date.now(),
      text,
      time: new Date().toLocaleString()
    }, ...prev].slice(0, 50));
  };

  const addProject = (newProject) => {
    setProjects(prev => [...prev, newProject]);
    logActivity(`New project '${newProject.name}' created`);
  };

  const updateProjects = (updatedList) => {
    setProjects(updatedList);
  };

  const deleteProject = (projectId) => {
    setProjects(prev => {
      const p = prev.find(x => x.id === projectId);
      if (p) logActivity(`Project '${p.name}' deleted`);
      return prev.filter(p => p.id !== projectId);
    });
  };

  const addTask = (newTask) => {
    setTasks(prev => [...prev, { ...newTask, id: Date.now(), progress: 0 }]);
    logActivity(`New task '${newTask.title}' created`);
  };

  const updateTask = (taskId, newProgress) => {
    setTasks(prev => {
      const task = prev.find(t => t.id === taskId);
      if (task) logActivity(`Task '${task.title}' updated to ${newProgress}%`);
      return prev.map((task) =>
        task.id === taskId ? { ...task, progress: newProgress } : task
      );
    });
  };

  const deleteTask = (taskId) => {
    setTasks(prev => {
      const task = prev.find(t => t.id === taskId);
      if (task) logActivity(`Task '${task.title}' deleted`);
      return prev.filter(task => task.id !== taskId);
    });
  };

  const addUser = (newUser) => {
    setUsers(prev => [...prev, { ...newUser, id: Date.now(), status: "Active" }]);
    logActivity(`New user '${newUser.name}' added`);
  };

  const deleteUser = (userId) => {
    setUsers(prev => {
      const user = prev.find(u => u.id === userId);
      if (user) logActivity(`User '${user.name}' deleted`);
      return prev.filter(user => user.id !== userId);
    });
  };

  const toggleUserStatus = (userId) => {
    setUsers(prev => {
      const user = prev.find(u => u.id === userId);
      const updated = prev.map(user =>
        user.id === userId
          ? { ...user, status: user.status === "Active" ? "Inactive" : "Active" }
          : user
      );
      if (user) logActivity(`User '${user.name}' status changed to ${user.status === "Active" ? "Inactive" : "Active"}`);
      return updated;
    });
  };

  const updateUser = (userId, updatedData) => {
    setUsers(prev => {
      const user = prev.find(u => u.id === userId);
      if (user) logActivity(`User '${user.name}' updated`);
      return prev.map(user =>
        user.id === userId ? { ...user, ...updatedData } : user
      );
    });
  };

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const allTasksWithProjects = useMemo(() => {
    const projectTasks = projects.flatMap((project) =>
      project.tasks.map((task) => ({
        id: task.id,
        title: task.title,
        progress: task.done ? 100 : 0,
        date: task.dueDate || "",
        assignedUser: (() => {
          const u = users.find((u) => String(u.id) === String(task.assigneeId));
          return u ? u.name : "";
        })(),
        priority: task.priority || "Medium",
        tags: [],
        _projectId: project.id,
        _projectName: project.name,
      }))
    );
    return [...tasks, ...projectTasks];
  }, [tasks, projects, users]);

  return (
    <Router>
      <Layout searchQuery={searchQuery} onSearchChange={setSearchQuery} users={users}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard tasks={tasks} users={users} activities={activities} />} />
          <Route path="/manage-user" element={<ManageUser users={users} onAddUser={addUser} onDeleteUser={deleteUser} onToggleStatus={toggleUserStatus} onUpdateUser={updateUser} />} />
          <Route path="/projects" element={<NewProject projects={projects} onAddProject={addProject} onUpdateProject={updateProjects} onDeleteProject={deleteProject} users={users} logActivity={logActivity} />} />
          <Route path="/edit-task" element={<EditTask tasks={allTasksWithProjects} onUpdateTask={updateTask} onDeleteTask={deleteTask} />} />
          <Route path="/report" element={<Report tasks={tasks} activities={activities} />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
