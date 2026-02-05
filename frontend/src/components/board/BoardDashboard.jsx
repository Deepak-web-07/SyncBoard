import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/axiosClient';
import toast from 'react-hot-toast';
import { FaPlus, FaUsers, FaCopy, FaPalette, FaTrash } from 'react-icons/fa';

const themes = [
    { name: 'Nebula', class: 'from-blue-600 to-purple-600' },
    { name: 'Sunny', class: 'from-orange-400 to-pink-500' },
    { name: 'Teal', class: 'from-teal-400 to-blue-500' },
    { name: 'Dark', class: 'from-gray-700 to-gray-900' },
    { name: 'Crimson', class: 'from-red-600 to-orange-600' },
];

const BoardDashboard = () => {
    const [boards, setBoards] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newBoardName, setNewBoardName] = useState('');
    const [newBoardDesc, setNewBoardDesc] = useState('');
    const [selectedTheme, setSelectedTheme] = useState(themes[0].class);

    const [boardToDelete, setBoardToDelete] = useState(null);

    const navigate = useNavigate();

    // Get Current User
    const userString = localStorage.getItem("user");
    const currentUser = userString ? JSON.parse(userString) : null;
    const currentUserId = currentUser ? currentUser._id : null;

    // Fetch Boards
    useEffect(() => {
        const fetchBoards = async () => {
            try {
                const res = await apiClient.get('/board/myBoards');
                setBoards(res.data.boards || []);
            } catch (error) {
                console.error("Error fetching boards", error);
                toast.error("Failed to load boards");
            }
        };
        fetchBoards();
    }, []);

    // Create Board
    const handleCreateBoard = async (e) => {
        e.preventDefault();
        if (!newBoardName.trim()) return;

        try {
            const res = await apiClient.post('/board/create', {
                name: newBoardName,
                description: newBoardDesc,
                theme: selectedTheme
            });
            setBoards([...boards, res.data.board]);
            setNewBoardName('');
            setNewBoardDesc('');
            setSelectedTheme(themes[0].class);
            setShowCreateModal(false);
            toast.success("Board created successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to create board");
        }
    };

    // Click Delete Icon
    const handleDeleteClick = (e, board) => {
        e.stopPropagation();
        setBoardToDelete(board);
    };

    // Confirm Delete
    const confirmDelete = async () => {
        if (!boardToDelete) return;
        try {
            await apiClient.delete(`/board/delete/${boardToDelete._id}`);
            setBoards(boards.filter(b => b._id !== boardToDelete._id));
            toast.success("Board deleted successfully");
            setBoardToDelete(null);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to delete board");
        }
    };

    // Copy Invite Link
    const copyInvite = (e, code) => {
        e.stopPropagation();
        const link = `${window.location.origin}/join/${code}`;
        navigator.clipboard.writeText(link);
        toast.success("Invite link copied!");
    };

    return (
        <div className="min-h-screen text-white p-8 animate-fadeIn">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">
                            My Workspaces
                        </h1>
                        <p className="text-gray-400 mt-2 text-lg">Manage projects, collaborate, and conquer tasks.</p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all active:scale-95"
                    >
                        <FaPlus className="text-orange-500" /> Create New Board
                    </button>
                </div>

                {/* Boards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Array.isArray(boards) && boards.map(board => (
                        <div
                            key={board._id}
                            onClick={() => navigate(`/board/${board._id}`)}
                            className={`relative rounded-3xl p-6 cursor-pointer shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-white/10 overflow-hidden group bg-gradient-to-br ${board.theme || 'from-gray-800 to-gray-900'}`}
                        >
                            {/* Overlay for readability if gradient is too bright, but usually gradients are fine. 
                                Or simpler: use solid dark bg and simple gradient accents. 
                                Let's stick strictly to what User likes: dynamic modern. */}
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition"></div>

                            <div className="relative z-10 flex flex-col h-full h-48 justify-between">
                                <div>
                                    <h3 className="text-2xl font-bold text-white shadow-sm mb-2">{board.name}</h3>
                                    <p className="text-white/80 text-sm line-clamp-2">{board.description || "No description provided."}</p>
                                </div>

                                <div className="flex justify-between items-end">
                                    <div className="flex items-center gap-3">
                                        <div className="flex -space-x-3">
                                            {/* Owner Avatar */}
                                            <div className="w-8 h-8 rounded-full border-2 border-white/20 bg-gray-800 flex items-center justify-center text-xs font-bold relative z-20" title={`Owner: ${board.owner?.username}`}>
                                                {board.owner?.username?.charAt(0).toUpperCase() || '?'}
                                            </div>
                                            {/* Members Avatars (Limit 3) */}
                                            {board.members && board.members.slice(0, 3).map((m, i) => (
                                                <div key={m._id} className="w-8 h-8 rounded-full border-2 border-white/20 bg-gray-700 flex items-center justify-center text-xs text-gray-300 relative" style={{ zIndex: 10 - i }}>
                                                    {m?.username?.charAt(0).toUpperCase() || '?'}
                                                </div>
                                            ))}
                                            {board.members.length > 3 && (
                                                <div className="w-8 h-8 rounded-full border-2 border-white/20 bg-gray-900/80 flex items-center justify-center text-xs text-white z-0">
                                                    +{board.members.length - 3}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={(e) => copyInvite(e, board.inviteCode)}
                                            className="bg-white/20 hover:bg-white/30 backdrop-blur-md p-2 rounded-lg text-white transition shadow-sm"
                                            title="Copy Invite Link"
                                        >
                                            <FaCopy size={16} />
                                        </button>
                                        {currentUserId && board.owner?._id === currentUserId && (
                                            <button
                                                onClick={(e) => handleDeleteClick(e, board)}
                                                className="bg-red-500/80 hover:bg-red-600/90 backdrop-blur-md p-2 rounded-lg text-white transition shadow-sm"
                                                title="Delete Board"
                                            >
                                                <FaTrash size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Empty State */}
                    {boards.length === 0 && (
                        <div className="col-span-full py-20 text-center text-gray-500 bg-gray-800/30 rounded-3xl border border-gray-700/50 border-dashed flex flex-col items-center justify-center gap-4">
                            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center text-gray-600">
                                <FaPlus size={24} />
                            </div>
                            <p className="text-lg">No boards yet. Create your first workspace!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-700 overflow-hidden transform transition-all scale-100 flex flex-col">

                        {/* Modal Header */}
                        <div className={`p-8 pb-4 bg-gradient-to-r ${selectedTheme}`}>
                            <div className="flex justify-between items-start">
                                <h3 className="text-2xl font-bold text-white shadow-sm">Create Board</h3>
                                <button onClick={() => setShowCreateModal(false)} className="text-white/80 hover:text-white bg-black/20 rounded-full p-1 transition">
                                    ✕
                                </button>
                            </div>
                            <p className="text-white/80 text-sm mt-1">Kickstart your new project.</p>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleCreateBoard} className="p-8 space-y-6 bg-gray-900">
                            <div>
                                <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Board Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Marketing Campaign 2024"
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 text-white placeholder-gray-500 text-lg transition"
                                    value={newBoardName}
                                    onChange={(e) => setNewBoardName(e.target.value)}
                                    autoFocus
                                    maxLength={30}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Description (Optional)</label>
                                <textarea
                                    placeholder="What is this board for?"
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 text-white placeholder-gray-500 text-sm resize-none h-24 transition"
                                    value={newBoardDesc}
                                    onChange={(e) => setNewBoardDesc(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-400 mb-3 uppercase tracking-wide flex items-center gap-2">
                                    <FaPalette /> Choose Theme
                                </label>
                                <div className="flex gap-3 overflow-x-auto p-2">
                                    {themes.map((t) => (
                                        <button
                                            key={t.name}
                                            type="button"
                                            onClick={() => setSelectedTheme(t.class)}
                                            className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.class} transition transform hover:scale-110 ring-2 ${selectedTheme === t.class ? 'ring-white scale-110' : 'ring-transparent'}`}
                                            title={t.name}
                                        />
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                className={`w-full py-4 mt-4 font-bold rounded-xl shadow-lg hover:opacity-90 transition transform active:scale-[0.98] text-white bg-gradient-to-r ${selectedTheme}`}
                            >
                                Create Board
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {boardToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700 overflow-hidden transform transition-all scale-100 flex flex-col p-6 text-center">
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                            <FaTrash className="text-red-500 text-2xl" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Delete Board?</h3>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            Are you sure you want to delete <span className="text-white font-semibold">{boardToDelete.name}</span>? <br />
                            This action cannot be undone.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => setBoardToDelete(null)}
                                className="px-6 py-3 rounded-xl font-bold text-gray-300 bg-gray-800 hover:bg-gray-700 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-6 py-3 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/20 transition transform hover:scale-105"
                            >
                                Yes, Delete It
                            </button>
                        </div>
                    </div>
                </div>
            )}        </div>
    );
};

export default BoardDashboard;
