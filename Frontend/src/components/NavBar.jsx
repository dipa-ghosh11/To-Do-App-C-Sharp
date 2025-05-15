import React, { useContext } from 'react';
import { Link, Navigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { AuthContext } from '../contexts/AuthContext.jsx';
import axios from 'axios';

const Navbar = ({ name, path, logout }) => {
    const { setUser } = useContext(AuthContext);

    const handleLogout = async () => {

        try {
            // await axios.post(`${import.meta.env.VITE_API}/api/User/logout`, {}, { headers: { Authorization: `Bearer ${token}` } })
            //     .then(() => {
            //         localStorage.removeItem("user");
            //         setUser(null);
            //         localStorage.removeItem("token");
            //         navigate("/auth"); 
            //         toast.success("User logged out")
            //     })
            localStorage.removeItem("user");
            localStorage.removeItem("token");            
        } catch (error) {
            console.log(error.response.data)
        }
    };

    return (
        <nav className="bg-gray-800 shadow-md p-4 w-full top-0 left-0 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-purple-400 ml-4">WorkSync</h1>
            <div className="mr-4">
                <Link to={path}>
                    <button
                        className="px-4 py-2 border border-purple-400 text-purple-400 rounded-lg hover:bg-purple-400 hover:text-gray-900 transition"
                        onClick={logout && handleLogout}
                    >
                        {name}
                    </button>
                </Link>
            </div>
        </nav>
    )
}

export default Navbar