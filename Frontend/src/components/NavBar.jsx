import React, { useContext } from 'react';
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import { AuthContext } from '../contexts/AuthContext.jsx';
import axios from 'axios';

const Navbar = ({ name, path, logout }) => {
    const { setUser } = useContext(AuthContext);

    const handleLogout = async () => {

        try {
            await axios.post("http://localhost:4000/api/user/logout", {}, { withCredentials: true })
                .then(() => {
                    localStorage.removeItem("user");
                    setUser(null);
                    toast.success("User logged out")
                })
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