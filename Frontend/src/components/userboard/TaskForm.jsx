import React, { useState, useEffect } from "react";
import axios from "axios";

const TaskForm = () => {
    const [taskData, setTaskData] = useState({
        taskTitle: "",
        taskDescription: "",
        taskStatus: "To Do",
        startDate: "",
        endDate: "",
        isDelete: false,
        projectId: "",
        assignedUsers: [],
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTaskData({ ...taskData, [name]: value });
    };

    const handleSubmit = async (e) => {

        console.log(taskData);
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:4000/api/task/createtask", { withCredentials: true })
            console.log(response.data)
        } catch (error) {
            console.log("error submitting", error)
        }
    };

    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:4000/api/user/getusers", { withCredentials: true })
            .then((res) => {
                if (res.data && Array.isArray(res.data.users)) {
                    setUsers(res.data.users);
                } else {
                    console.error("Unexpected response format:", res.data);
                    setUsers([]);
                }
            })
            .catch((err) => console.error("Error fetching users:", err));
    }, []);


    const handleUserSelect = (e) => {
        const selectedUsers = Array.from(e.target.selectedOptions, option => option.value);
        setTaskData({ ...taskData, assignedUsers: selectedUsers });

    };

    return (
        <div className="max-w-lg mx-auto bg-gray-800 p-6 rounded-lg shadow-md text-white">
            <h2 className="text-2xl font-bold mb-4">Create New Task</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="text"
                    name="taskTitle"
                    placeholder="Task Title"
                    value={taskData.taskTitle}
                    onChange={handleChange}
                    className="p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />

                <textarea
                    name="taskDescription"
                    placeholder="Task Description"
                    value={taskData.taskDescription}
                    onChange={handleChange}
                    className="p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />

                <select
                    name="taskStatus"
                    value={taskData.taskStatus}
                    onChange={handleChange}
                    className="p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                </select>

                <input
                    type="date"
                    name="startDate"
                    value={taskData.startDate}
                    onChange={handleChange}
                    className="p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />

                <input
                    type="date"
                    name="endDate"
                    value={taskData.endDate}
                    onChange={handleChange}
                    className="p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />

                <select multiple name="assignedUsers" onChange={handleUserSelect} className="p-2 rounded mb-2 bg-gray-700 text-white focus:outline-none w-full">
                    {users.length > 0 ? (
                        users.map((user) => (
                            <option key={user._id} value={user._id}>{user.fullName}</option>
                        ))
                    ) : (
                        <option disabled>No users available</option>
                    )}
                </select>

                <button
                    type="submit"
                    className="bg-blue-500 p-2 rounded text-white hover:bg-blue-600 transition font-semibold"
                >
                    Create Task
                </button>
            </form>
        </div>
    );
};


export default TaskForm