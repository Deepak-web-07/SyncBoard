import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Logout = () => {
    const navigate = useNavigate();

    return (
        <div className='flex items-center justify-center h-[90vh]'>
            <div className='w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-xl text-center'>
                <h2 className='text-3xl font-bold text-white mb-6'>
                    Log <span className='text-orange-500'>Out</span>
                </h2>
                <p className='text-gray-300 mb-8 text-lg'>
                    Are you sure you want to log out?
                </p>
                <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                    <button
                        className='px-6 py-3 font-semibold text-white bg-red-500 rounded-md hover:bg-red-600 transition duration-300 w-full sm:w-auto'
                        onClick={() => {
                            localStorage.clear();
                            toast.success("Logged out successfully");
                            navigate("/signin");
                        }}
                    >
                        Yes, Logout
                    </button>
                    <Link
                        to='/'
                        className='px-6 py-3 font-semibold text-white bg-gray-600 rounded-md hover:bg-gray-700 transition duration-300 w-full sm:w-auto'
                    >
                        Cancel
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Logout