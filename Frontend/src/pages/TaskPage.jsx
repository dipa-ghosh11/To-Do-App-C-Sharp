import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../components/NavBar';
import TaskCard from '../components/userboard/TaskCard.jsx';

const TaskPage = () => {
    const { id } = useParams();
    const [tasks, setTasks] = useState([]);
    const taskFetch = async () => {
        try {
            const res = await axios.get(`http://localhost:4000/api/task/getTasksByUser/${id}`,{withCredentials:true});
            console.log(res.data.tasks);
            setTasks(res.data.tasks);
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        taskFetch()
    },[])
  return (
      <div>
          <Navbar name="Logout" path="/auth" logout={true} />
          <div className='flex p-20 flex-col'>
              {tasks.map(task => 
                  <TaskCard key={task._id} id={task._id} title={task.taskTitle} description={task.taskDescription} startDate={task.startDate} endDate={ task.endDate} status={task.taskStatus} />
              )}
          </div>
      </div>
  )
}

export default TaskPage