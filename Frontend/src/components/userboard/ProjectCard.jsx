import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProjectCard = ({ name, description, id }) => {
    const navigate=useNavigate();
    return (
        <div className="bg-gray-800 p-6 shadow-lg max-w-md w-full hover:shadow-3xl rounded-xl transition-transform hover:scale-110 hover:cursor-pointer" onClick={()=>navigate(`/user/project/${id}`)}>
            <h2 className="text-2xl font-bold text-blue-400 mb-3">{name}</h2>
            <p className="text-gray-300 text-sm">{description}</p>
        </div>
    );
};

export default ProjectCard;
