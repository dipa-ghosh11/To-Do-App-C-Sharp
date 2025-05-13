import React, { useState } from "react";
import { BadgeCheck, Clock, ListTodo } from "lucide-react";
import { dateParser } from "@biswarup598/date-parser";
import axios from "axios";
import { toast } from "react-toastify";

const statusStyles = {
    "To Do": "bg-blue-600",
    "Pending": "bg-yellow-500",
    "Completed": "bg-green-600",
};

const statusIcons = {
    "To Do": <ListTodo className="w-4 h-4 mr-1" />,
    "Pending": <Clock className="w-4 h-4 mr-1" />,
    "Completed": <BadgeCheck className="w-4 h-4 mr-1" />,
};

const TaskCard = ({ id, title, description, startDate, endDate, status: initialStatus }) => {
    const [status, setStatus] = useState(initialStatus);

    const handleStatusChange = async (e) => {
        const newStatus = e.target.value;
        setStatus(newStatus);

        try {
            await axios.put(`http://localhost:4000/api/task/updatetask/${id}`, {
                taskStatus: newStatus },
                {withCredentials:true
                });
            toast.success("Status updated")
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    const badgeColor = statusStyles[status] || "bg-gray-500";

    return (
        <div className="bg-gray-900 text-white p-5 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 w-full max-w-md">
            <div className="flex justify-between items-start">
                <h3 className="text-xl font-semibold text-blue-400">{title}</h3>
                <select
                    value={status}
                    onChange={handleStatusChange}
                    className={`text-sm px-2 py-1 rounded-full ${badgeColor} focus:outline-none`}
                >
                    <option value="To Do">To Do</option>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                </select>
            </div>
            <p className="text-sm text-gray-300 mt-3">{description}</p>
            <p className="text-xs text-gray-500 mt-4">Start date: {dateParser(startDate)[1]} of {dateParser(startDate)[0]}</p>
            <p className="text-xs text-gray-500 mt-1">End date: {dateParser(endDate)[1]} of {dateParser(endDate)[0]}</p>
        </div>
    );
};

export default TaskCard;
