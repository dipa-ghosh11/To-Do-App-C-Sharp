import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { FiPlus } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../contexts/AuthContext";
import Navbar from "../components/NavBar";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardTabs from "../components/dashboard/DashboardTabs";
import UserTable from "../components/dashboard/UserTable";
import ItemTable from "../components/dashboard/ItemTable";
import FormModal from "../components/dashboard/FormModal";

const AdminDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("projects");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [formData, setFormData] = useState({
    projectTitle: "",
    projectDescription: "",
    projectStatus: "Pending",
    startDate: "",
    endDate: "",
    assignedUsers: [],
    taskTitle: "",
    taskDescription: "",
    taskStatus: "To Do",
    projectId: "",
  });

  const { user, token } = useContext(AuthContext);
  const parsedUser = typeof user === "string" ? JSON.parse(user) : user;


  useEffect(() => {
      fetchProjects();
    fetchTasks();
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API}/api/User`, {headers: {Authorization: `Bearer ${token}`}});
      if (response.data.data) {
        setUsers(response.data.data);
        // console.log(response.data.data)
      } else {
        toast.error("Error fetching users");
      }
    } catch (error) {
      toast.error("Error fetching users");
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API}/api/Project`, { headers: { Authorization: `Bearer ${token}` } });
      if (response.data.data) {
        const filteredProjects = response.data.data.filter(project => !project.isDelete);
        setProjects(filteredProjects);
      } else {
        
        toast.error("Error fetching projects");
      }
    } catch (error) {
      console.log(error)
      toast.error("Error fetching projects");
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API}/api/Task`, { headers: { Authorization: `Bearer ${token}` } });
      if (response.data.data) {
        const filteredTasks = response.data.data.filter(task => !task.isDelete);
        setTasks(filteredTasks);
      } else {
        toast.error("Error fetching tasks");
      }
    } catch (error) {
      toast.error("Error fetching tasks");
    }
  };

  const handleCreate = async () => {
    try {
      if (modalType === "project") {
        const projectData = {
          projectTitle: formData.projectTitle,
          projectDescription: formData.projectDescription,
          projectStatus: formData.projectStatus,
          startDate: formData.startDate,
          endDate: formData.endDate,
          assignedUsers: formData.assignedUsers,
          createdBy: parsedUser.id
        };
        console.log(projectData);
        await axios.post(`${import.meta.env.VITE_API}/api/Project`, projectData, { headers: { Authorization: `Bearer ${token}` } });
        fetchProjects();
      } else {
        const taskData = {
          taskTitle: formData.taskTitle,
          taskDescription: formData.taskDescription,
          taskStatus: formData.taskStatus,
          startDate: formData.startDate,
          endDate: formData.endDate,
          projectId: formData.projectId,
          assignedUsers: formData.assignedUsers,
          createdBy: parsedUser.id
        };
        console.log("Submitting:", taskData);
        await axios.post(`${import.meta.env.VITE_API}/api/Task`, taskData, { headers: { Authorization: `Bearer ${token}` } });
        fetchTasks();
      }
      toast.success(`${modalType} created successfully`);
      handleCloseModal();
    } catch (error) {
      console.log(error)
      toast.error(`Error creating ${modalType}`);
    }
  };

  const handleUpdate = async () => {
    try {
      if (modalType === "project") {
        const projectData = {
          projectTitle: formData.projectTitle,
          projectDescription: formData.projectDescription,
          projectStatus: formData.projectStatus,
          startDate: formData.startDate,
          endDate: formData.endDate,
          assignedUsers: formData.assignedUsers,
          createdBy: parsedUser.id
        };
        console.log(projectData);
        await axios.put(`${import.meta.env.VITE_API}/api/Project/${editingItem.id}`, projectData, { headers: { Authorization: `Bearer ${token}` } });
        fetchProjects();
      } else {
        const taskData = {
          taskTitle: formData.taskTitle,
          taskDescription: formData.taskDescription,
          taskStatus: formData.taskStatus,
          startDate: new Date(formData.startDate).toISOString(),
          endDate: new Date(formData.endDate).toISOString(),
          projectId: formData.projectId,
          assignedUsers: formData.assignedUsers
        };
        await axios.put(`${import.meta.env.VITE_API}/api/Task/${editingItem.id}`, taskData, { headers: { Authorization: `Bearer ${token}` } });
        fetchTasks();
      }
      toast.success(`${modalType} updated successfully`);
      handleCloseModal();
    } catch (error) {
      console.log(error)
      toast.error(`Error updating ${modalType}`);
    }
  };

  const handleDelete = async (id, type) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      try {
        if (type === "project") {
          await axios.delete(`${import.meta.env.VITE_API}/api/Project/${id}`, { headers: { Authorization: `Bearer ${token}` } });
          fetchProjects();
        } else {
          await axios.delete(`${ import.meta.env.VITE_API }/api/Task/${id}`, { headers: { Authorization: `Bearer ${token}` } });
          fetchTasks();
        }
        toast.success(`${type} deleted successfully`);
      } catch (error) {
        toast.error(`Error deleting ${type}`);
      }
    }
  };

  const handleOpenModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    if (item) {
      if (type === "project") {
        setFormData({
          projectTitle: item.projectTitle,
          projectDescription: item.projectDescription,
          projectStatus: item.projectStatus,
          startDate: item.startDate?.split('T')[0] || "",
          endDate: item.endDate?.split('T')[0] || "",
          assignedUsers: item.assignedUsers
        });
      } else {
        setFormData({
          taskTitle: item.taskTitle,
          taskDescription: item.taskDescription,
          taskStatus: item.taskStatus,
          startDate: item.startDate?.split('T')[0] || "",
          endDate: item.endDate?.split('T')[0] || "",
          projectId: item.projectId,
          assignedUsers: item.assignedUsers || []
        });
      }
    } else {
      setFormData({
        projectTitle: "",
        projectDescription: "",
        projectStatus: "Pending",
        taskTitle: "",
        taskDescription: "",
        taskStatus: "To Do",
        startDate: "",
        endDate: "",
        projectId: "",
        assignedUsers: []
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({
      projectTitle: "",
      projectDescription: "",
      projectStatus: "Pending",
      taskTitle: "",
      taskDescription: "",
      taskStatus: "To Do",
      startDate: "",
      endDate: "",
      projectId: "",
      assignedUsers: []
    });
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      // Fetch the full user object
      const { data } = await axios.get(`${import.meta.env.VITE_API}/api/User/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const fullUser = data.data;

      // Toggle the isActive status
      const updatedUser = {
        ...fullUser,
        isActive: !currentStatus,
        updatedAt: new Date().toISOString()
      };

      // Send full user object
      await axios.put(`${import.meta.env.VITE_API}/api/User/${userId}`, updatedUser, {
        headers: { Authorization: `Bearer ${token}` }
      });

      fetchUsers();
      toast.success("User status updated successfully");
    } catch (error) {
      console.log(error)
      toast.error("Error updating user status");
    }
  };


  const [projectSearchTerm, setProjectSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState('all');

  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
  };
  const filteredProjects = projects.filter((project) => {
    
    const matchProject = project.projectTitle.toLowerCase().includes(projectSearchTerm.toLowerCase());

    const matchStatus =
      statusFilter === 'all' ||
      (statusFilter === 'Completed' && project.projectStatus === 'Completed') ||
      (statusFilter === 'In Progress' && project.projectStatus === 'InProgress') ||
      (statusFilter === 'Pending' && project.projectStatus === 'Pending')

    return matchProject && matchStatus;
  }
  );


  const [taskSearchTerm, settaskSearchTerm] = useState("");
  const [statustaskFilter, settaskStatusFilter] = useState('all');

  const handletaskStatusFilter = (e) => {
    settaskStatusFilter(e.target.value);
  };
  const filteredTasks = tasks.filter((task) => {
    // console.log(task)
    const searchTerm = taskSearchTerm.toLowerCase();

    const matchTaskTitle = task.taskTitle.toLowerCase().includes(searchTerm);

    const matchAnyUser = task.assignedUsers?.some(user =>
      user?.fullName && user.fullName.toLowerCase().includes(searchTerm)
    );

    const matchTask = matchTaskTitle || matchAnyUser;

    const matchtaskStatus =
      statustaskFilter === 'all' ||
      (statustaskFilter === 'Done' && task.taskStatus === 'Done') ||
      (statustaskFilter === 'In Progress' && task.taskStatus === 'In Progress') ||
      (statustaskFilter === 'To Do' && task.taskStatus === 'To Do');
  
    return matchTask && matchtaskStatus;
  }
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-yellow-100 to-teal-100 animate-fadeIn">
      <ToastContainer />
      <Navbar name="Logout" path="/auth" logout={true} />
      <FormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={(e) => {
          e.preventDefault();
          editingItem ? handleUpdate() : handleCreate();
        }}
        type={modalType}
        editingItem={editingItem}
        formData={formData}
        setFormData={setFormData}
        users={users}
        projects={projects}
        selectedProject={selectedProject}
      />
      <DashboardHeader title={`Welcome, ${parsedUser.fullName}`} />

      
      



      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="bg-white shadow-xl rounded-3xl border border-pink-200 p-6 transition-all hover:shadow-2xl">
          
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <h2 className="text-3xl font-bold text-gradient bg-gradient-to-r from-fuchsia-600 to-indigo-600 bg-clip-text text-transparent">
              {activeTab === "projects" ? "Projects" : activeTab === "tasks" ? "Tasks" : "Users"}
            </h2>

            {activeTab === "projects" && (
             
              <div className="relative w-full sm:w-auto">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="Search by project..."
                  className="pl-10 pr-4 py-2 w-full sm:w-auto rounded-full border border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white shadow-md transition duration-300 hover:shadow-lg"
                  value={projectSearchTerm}
                  onChange={(e) => setProjectSearchTerm(e.target.value)}
                />
              </div>
            )}

            {activeTab === "projects" && (
              <select
                value={statusFilter}
                onChange={handleStatusFilter}
                className="w-full sm:w-auto px-4 py-2 rounded-full border border-indigo-300 bg-white text-gray-700 shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-300 transition duration-300 hover:shadow-lg"
              >
                <option value="all">All</option>
                <option value="Pending"> Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            )}

            {activeTab === "tasks" && (

              <div className="relative w-full sm:w-auto">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="Search by tasks..."
                  className="pl-10 pr-4 py-2 w-full sm:w-auto rounded-full border border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white shadow-md transition duration-300 hover:shadow-lg"
                  value={taskSearchTerm}
                  onChange={(e) => settaskSearchTerm(e.target.value)}
                />
              </div>
            )}

            {activeTab === "tasks" && (
              <select
                value={statusFilter}
                onChange={handleStatusFilter}
                className="w-full sm:w-auto px-4 py-2 rounded-full border border-indigo-300 bg-white text-gray-700 shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-300 transition duration-300 hover:shadow-lg"
              >
                <option value="all">All</option>
                <option value="To Do"> To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            )}


            {activeTab !== "users" && (
              <button
                onClick={() => handleOpenModal(activeTab.slice(0, -1))}
                className="inline-flex items-center px-5 py-2 rounded-full shadow-lg text-sm font-bold text-white bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 transition duration-300"
              >
                <FiPlus className="mr-2" />
                Add {activeTab === "projects" ? "Project" : "Task"}
              </button>
            )}
          </div>


          <div className="overflow-x-auto">
            {activeTab === "users" ? (
              <UserTable
                users={users}
                onToggleStatus={handleToggleUserStatus}
              />
            ) : (
                <ItemTable
                  items={activeTab === "projects" ? filteredProjects : filteredTasks}
                  type={activeTab.slice(0, -1)}
                  users={users}
                  projects={projects}
                  onEdit={handleOpenModal}
                  onDelete={handleDelete}
                />

            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;