import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../components/NavBar'
import { AuthContext } from '../contexts/AuthContext'
import ProjectCard from '../components/userboard/ProjectCard';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useParams } from 'react-router-dom';
const UserPage = () => {
  const [projects, setProjects] = useState([]);
  const { user } = useContext(AuthContext);
  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API}/api/Project/`, { headers: { Authorization: `Bearer ${token}` }});
      
      console.log(response);
      setProjects(response.data.projects);
    } catch (error) {
      // console.error('Error fetching projects:', error);
      if(error.status==404) toast.error("No projects assigned")
      // toast.error("Error fetching projects");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [])
  return (
    <div>
      <Navbar name="Logout" path="/auth" logout={true} />
      <h1 className='text-center text-5xl p-8'>Welcome {user.fullName}</h1>
      <div className='flex justify-evenly'>
        {projects.map(project=> <ProjectCard key={project.id} name={project.projectTitle} description={project.projectDescription} id={project.id} />)}
      </div>
    </div> 
  )
}

export default UserPage