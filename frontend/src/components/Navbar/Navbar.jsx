import { useState, useEffect, useRef } from 'react';
import { GiNotebook } from "react-icons/gi";
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Navbar() {

    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // This hook forces a re-render when the route changes
    useLocation();

    // Check if user is logged in
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    const isLoggedIn = !!user;

    return (
        <header
            as="nav"
            className="relative bg-gray-800/50 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/10"
        >
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-0">
                <div className="relative flex h-16 items-center justify-between">
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                    </div>
                    <div className="flex items-center">
                        <h1 className='text-3xl font-bold text-orange-500 flex items-center gap-2'>
                            <img src="/SyncBoard.png" alt="SyncBoard Logo" className="w-42 h-16 object-contain rounded-md"
                                onClick={() => navigate('/')}
                                style={{ cursor: 'pointer' }} />
                        </h1>
                    </div>
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-end">
                        <div className="hidden sm:ml-6 sm:block">
                            <div className="flex space-x-4">
                                <Link className='rounded-md px-3 py-2 text-sm font-medium text-white text-3xl' to="/">
                                    Home
                                </Link>
                                <Link className='rounded-md px-3 py-2 text-sm font-medium text-white text-3xl' to="/about">
                                    About Us
                                </Link>
                                <Link className='rounded-md px-3 py-2 text-sm font-medium text-white text-3xl' to="/dashboard">
                                    Dashboard
                                </Link>
                                <div className="flex space-x-4 items-center">
                                    {!isLoggedIn ? (
                                        <>
                                            <Link className='rounded-full px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 transition' to="/signup">
                                                SignUp
                                            </Link>
                                            <Link className='rounded-full px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 transition' to="/signin">
                                                SignIn
                                            </Link>
                                        </>
                                    ) : (
                                        <div className="relative ml-3" ref={dropdownRef}>
                                            <div>
                                                <button
                                                    type="button"
                                                    className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                                                    id="user-menu-button"
                                                    aria-expanded="false"
                                                    aria-haspopup="true"
                                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                                >
                                                    <span className="sr-only">Open user menu</span>
                                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-lg border-2 border-gray-700 shadow-md">
                                                        {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                                                    </div>
                                                </button>
                                            </div>

                                            {isDropdownOpen && (
                                                <div
                                                    className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-lg bg-gray-800 py-2 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none animate-fadeIn border border-gray-700"
                                                    role="menu"
                                                    aria-orientation="vertical"
                                                    aria-labelledby="user-menu-button"
                                                    tabIndex="-1"
                                                >
                                                    {/* Arrow Tip */}
                                                    <div className="absolute -top-1.5 right-3 w-3 h-3 bg-gray-800 border-t border-l border-gray-700 transform rotate-45"></div>

                                                    <div className="px-5 py-3 border-b border-gray-700">
                                                        <p className="text-xs text-orange-500 uppercase tracking-wider font-bold">Signed in as</p>
                                                        <p className="text-sm font-bold text-white truncate mt-1" title={user?.email}>{user?.username || 'User'}</p>
                                                    </div>

                                                    <div className='py-1'>
                                                        <Link
                                                            to="/logout"
                                                            className="flex items-center px-5 py-3 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
                                                            role="menuitem"
                                                            tabIndex="-1"
                                                            id="user-menu-item-2"
                                                            onClick={() => setIsDropdownOpen(false)}
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                                            </svg>
                                                            Sign out
                                                        </Link>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                    </div>
                </div>
            </div>
        </header>
    )
}