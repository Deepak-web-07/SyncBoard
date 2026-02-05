import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import apiClient from "../../api/axiosClient";

const Signup = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const res = await apiClient.post('/user/signup', { email, username, password });
            localStorage.setItem('user', JSON.stringify(res.data.user));
            localStorage.setItem('token', res.data.token);
            toast.success("Signup Successful! Welcome to SyncBoard.");
            navigate('/');
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Signup failed");
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
            <div className="w-full max-w-md p-8 bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/30">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </div>
                </div>
                <h2 className="text-3xl font-extrabold text-center text-white mb-2">
                    Create Account
                </h2>
                <p className="text-gray-400 text-center mb-8">Join us to organize your life</p>

                <form className="space-y-5" onSubmit={handleSignup}>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="email">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 text-white bg-gray-900/60 border border-gray-600 rounded-lg focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition duration-200 placeholder-gray-500"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="username">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 text-white bg-gray-900/60 border border-gray-600 rounded-lg focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition duration-200 placeholder-gray-500"
                            placeholder="Enter a username"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 text-white bg-gray-900/60 border border-gray-600 rounded-lg focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition duration-200 placeholder-gray-500"
                            placeholder="Choose a password"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-3 font-bold text-white bg-gradient-to-r from-orange-500 to-amber-600 rounded-lg hover:from-orange-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition duration-300 transform hover:scale-[1.02] shadow-lg shadow-orange-500/30 mt-2"
                    >
                        Sign Up
                    </button>
                    <div className="text-center text-gray-400 pt-4 border-t border-gray-700/50 mt-4">
                        Already have an account?{" "}
                        <Link to="/signin" className="text-orange-400 font-semibold hover:text-orange-300 transition duration-200">
                            Sign In
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup