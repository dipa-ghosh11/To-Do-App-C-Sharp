import React, { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext.jsx';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const LogIn = ({ setIsLogin }) => {
    const { login } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        role: ""
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleChange = (e) => {
        setFormData({
            ...formData, 
            [e.target.name]: e.target.value
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API}/api/User/login`,
                formData,
            );

            if (response.data.success) {
                // Store user data and token
                await login(response.data);
                console.log(response.data)
                toast.success(response.data.message);

                // Navigate to the return URL if it exists, otherwise to the appropriate dashboard
                const from = location.state?.from?.pathname || (formData.role === "admin" ? "/admin" : "/user");
                navigate(from, { replace: true });
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data.message);
            // console.error("Login error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-900 p-4">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm">
                <h2 className="text-3xl font-bold text-white mb-6 text-center">Welcome Back</h2>
                <form className="flex flex-col" onSubmit={handleLogin}>
                    <input
                        type="text"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="p-3 rounded mb-3 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="p-3 rounded mb-3 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        
                    />
                    <select 
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="p-3 rounded mb-4 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        
                    >
                        <option value="" hidden>Select Role</option>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                    <button 
                        type="submit"
                        disabled={loading}
                        className={`bg-blue-500 p-3 rounded text-white transition font-semibold ${
                            loading 
                                ? 'opacity-50 cursor-not-allowed' 
                                : 'hover:bg-blue-600'
                        }`}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                    <p className="text-gray-400 mt-4 text-center">
                        Don't have an account?
                        <span
                            className="text-blue-400 cursor-pointer hover:underline ml-1"
                            onClick={() => setIsLogin(false)}
                        >
                            Sign up here
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LogIn;