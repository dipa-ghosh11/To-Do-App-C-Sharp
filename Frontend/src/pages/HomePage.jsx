import React, { useEffect } from "react";
import NavBar from "../components/NavBar.jsx";
import { toast } from "react-toastify";
import axios from "axios";

const HomePage = () => {

    const fetchUsers = async () => {
        try {
          const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJUYXNrTWFuYWdlbWVudEFQSSIsImp0aSI6ImUwZGVhNzY5LTk0YjItNGQ3MS1hOTY1LTUwOTkxNjhiYTZlNyIsIl9pZCI6IjY4MTllNTcxOWM2MDA4MjkyNTYwZGRjYiIsImVtYWlsIjoic3RyaW5nIiwiZnVsbE5hbWUiOiJzdHJpbmciLCJyb2xlIjoiYWRtaW4iLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJhZG1pbiIsImlzQWN0aXZlIjoiVHJ1ZSIsImV4cCI6MTc0NzEzMTc1MiwiaXNzIjoiVGFza0FwaSIsImF1ZCI6IlRhc2tBcGlVc2VycyJ9.7_FZrWQjia2r2jysqe-28GPsUrAupH1h_pA9--Bz6Ns";
    
          const response = await axios.get(`${import.meta.env.VITE_API}/api/User`, {headers: {Authorization: `Bearer ${token}`}});
          console.log(response.data.data)
        } catch (error) {
          console.log(error)
        }
      };

      useEffect(()=>{
          fetchUsers()
      },[])
    return (
        <div className="min-h-screen bg-gray-900 text-white">

            <NavBar name="SignUp/LogIn" path="/auth" />

            <header className="text-center py-30 px-6">
                <h2 className="text-5xl font-extrabold">Stay Organized, Stay Productive</h2>
                <p className="text-lg mt-4 text-gray-400">Manage your tasks efficiently with WorkSync</p>
                <button className="mt-6 px-6 py-3 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600 transition shadow-lg">
                    <a href="/auth">Get Started</a>
                </button>
            </header>
           
            <section className="max-w-4xl mx-auto py-12 px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
                    <h3 className="text-xl font-bold text-blue-400">Easy Task Management {import.meta.env.VITE_X}</h3>
                    <p className="text-gray-400 mt-2">Create, edit, and delete tasks effortlessly.</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
                    <h3 className="text-xl font-bold text-purple-400">Set Deadlines</h3>
                    <p className="text-gray-400 mt-2">Stay on top of your tasks with reminders.</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
                    <h3 className="text-xl font-bold text-pink-400">Sync Across Devices</h3>
                    <p className="text-gray-400 mt-2">Access your to-do list from anywhere.</p>
                </div>
            </section>

        </div>
    );
};

export default HomePage;
