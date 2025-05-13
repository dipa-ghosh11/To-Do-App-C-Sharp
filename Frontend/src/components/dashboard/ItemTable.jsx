import React, { useState } from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import SearchFilterbar from '../SearchFilterbar';


const ItemTable = ({ items, type, users, projects, onEdit, onDelete}) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Completed':
        return {
          bg: 'bg-green-50',
          border: 'border-l-4 border-green-400',
          pill: 'bg-green-100 text-green-800',
        };
      case 'In Progress':
        return {
          bg: 'bg-yellow-50',
          border: 'border-l-4 border-yellow-400',
          pill: 'bg-yellow-100 text-yellow-800',
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-l-4 border-gray-300',
          pill: 'bg-gray-100 text-gray-800',
        };
    }
  };

  const renderAssignedUsers = (assignedUsers) => {
    if (!assignedUsers?.length) {
      return <span className="text-xs text-gray-400 italic">No users</span>;
    }

    return (
      <div className="flex flex-wrap gap-1">
        {assignedUsers.map((user) => {
          const userData = user.fullName ? user : users.find(u => u._id === (typeof user === 'string' ? user : user._id));
          if (!userData) return null;

          return (
            <span
              key={userData._id}
              className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full"
            >
              {userData.fullName}
            </span>
          );
        })}
      </div>
    );
  };

  

  return (
    <div className="overflow-x-auto">
     
      <table className="min-w-full divide-y divide-gray-200 shadow-md rounded-xl overflow-hidden bg-white">
        <thead className="bg-gradient-to-r from-blue-100 to-blue-200 text-gray-800 text-sm font-semibold uppercase tracking-wider">
          <tr>
            <th className="px-6 py-4 text-left">Title</th>
            <th className="px-6 py-4 text-left">Status</th>
            <th className="px-6 py-4 text-left">Dates</th>
            <th className="px-6 py-4 text-left">Assigned Users</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          
          {
            items.map((item) => {
            const title = type === 'project' ? item.projectTitle : item.taskTitle;
            const desc = type === 'project' ? item.projectDescription : item.taskDescription;
            const status = type === 'project' ? item.projectStatus : item.taskStatus;
            const { bg, border, pill } = getStatusStyle(status);
            const start = new Date(item.startDate).toLocaleDateString();
            const end = new Date(item.endDate).toLocaleDateString();
            const projectName =
              type === 'task' && item.projectId
                ? typeof item.projectId === 'string'
                  ? projects.find(p => p._id === item.projectId)?.projectTitle
                  : item.projectId.projectTitle
                : null;

            return (
              <tr key={item._id} className={`${bg} ${border} hover:bg-opacity-80 transition-all`}>
                {/* Title */}
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{title}</div>
                  <div className="text-gray-500 text-sm">{desc}</div>
                  {projectName && (
                    <div className="text-xs text-gray-400 mt-1">Project: {projectName}</div>
                  )}
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${pill}`}>
                    {status}
                  </span>
                </td>

                {/* Dates */}
                <td className="px-6 py-4 text-gray-600 text-sm">
                  <div>Start: {start}</div>
                  <div>End: {end}</div>
                </td>

                {/* Assigned Users */}
                <td className="px-6 py-4">{renderAssignedUsers(item.assignedUsers)}</td>

                {/* Actions */}
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => onEdit(item)}
                    className="text-indigo-600 hover:text-indigo-800 transition mr-4"
                    title="Edit"
                  >
                    <FiEdit2 size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(item._id)}
                    className="text-red-600 hover:text-red-800 transition"
                    title="Delete"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ItemTable;
