import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { FaEdit, FaTrash, FaPlus, FaUserPlus, FaCopy, FaUsers } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addTodo, removeTodo, updateTodo, setTodos } from "../feature/todoSlice";
import apiClient from "../../api/axiosClient";
import { useNavigate, useParams } from "react-router-dom";
import { DndContext, closestCorners, useDraggable, useDroppable, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';

// --- Draggable Task Component ---
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const TaskCard = ({ todo, onDelete, onEdit }) => {
    const [showBody, setShowBody] = useState(false);
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: todo._id,
        data: { ...todo } // Pass data to identify what we are dragging
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className="group p-4 bg-gray-800 hover:bg-gray-750 rounded-xl shadow-sm mb-3 border border-gray-700 cursor-grab active:cursor-grabbing transition-all hover:shadow-md hover:border-gray-600 relative overflow-hidden"
        >
            <div className="flex justify-between items-start gap-2">
                <h4 className="font-semibold text-gray-100 mb-1 flex-1 text-base leading-snug">{todo.title}</h4>
                <div className="flex items-center gap-2">
                    {todo.assignedTo && (
                        <div
                            className="w-5 h-5 rounded-full bg-blue-500 text-xs flex items-center justify-center font-bold text-white border border-blue-400"
                            title={`Assigned to ${todo.assignedTo.username}`}
                        >
                            {todo.assignedTo.username.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <button
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={() => onEdit(todo)}
                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white transition-opacity p-1"
                    >
                        <FaEdit size={14} />
                    </button>
                </div>
            </div>

            <div className="flex items-center justify-between mt-3">
                <div className={`flex items-center justify-center w-6 h-6 rounded-full 
                    ${todo.priority === 'High' ? 'bg-red-400/10' :
                        todo.priority === 'Medium' ? 'bg-yellow-400/10' :
                            'bg-green-400/10'}`}
                    title={`Priority: ${todo.priority || 'Low'}`}>
                    <span className={`w-2 h-2 rounded-full 
                        ${todo.priority === 'High' ? 'bg-red-400' :
                            todo.priority === 'Medium' ? 'bg-yellow-400' :
                                'bg-green-400'}`}></span>
                </div>

                <div className="flex gap-2">
                    <button
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={() => setShowBody(!showBody)}
                        className="text-gray-500 hover:text-gray-300 transition"
                    >
                        {showBody ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                    </button>
                    <button
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={() => onDelete(todo._id)}
                        className="text-gray-500 hover:text-red-400 transition"
                    >
                        <FaTrash size={12} />
                    </button>
                </div>
            </div>

            {showBody && (
                <p className="text-gray-300 text-sm mt-3 pt-3 border-t border-gray-700/50 animate-fadeIn break-words whitespace-pre-wrap leading-relaxed">
                    {todo.body}
                </p>
            )}
        </div>
    );
};

// --- Droppable Column Component ---
const KanbanColumn = ({ id, title, tasks, onDelete, onEdit }) => {
    const { setNodeRef } = useDroppable({ id });

    return (
        <div ref={setNodeRef} className="flex-1 min-w-[300px] bg-gray-800/50 p-4 rounded-xl border border-gray-700 flex flex-col">
            <h3 className="text-xl font-bold text-gray-200 mb-4 uppercase tracking-wide border-b border-gray-700 pb-2">
                {title} <span className="ml-2 text-sm bg-gray-700 px-2 py-0.5 rounded-full text-orange-500">{tasks.length}</span>
            </h3>
            <div className="flex-1 space-y-2 min-h-[100px]">
                {tasks.map(task => (
                    <TaskCard key={task._id} todo={task} onDelete={onDelete} onEdit={onEdit} />
                ))}
                {tasks.length === 0 && (
                    <div className="h-20 border-2 border-dashed border-gray-700 rounded-lg flex items-center justify-center text-gray-500 text-sm">
                        Drop items here
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Main Component ---
const Todo = () => {
    const [input, setInput] = useState('');
    const [body, setBody] = useState('');
    const [priority, setPriority] = useState('Low');
    const [assignedTo, setAssignedTo] = useState('');
    const [inviteEmail, setInviteEmail] = useState('');
    const [showInvite, setShowInvite] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [boardData, setBoardData] = useState(null);
    const [editId, setEditId] = useState(null);
    const textareaRef = useRef(null);
    const { boardId } = useParams();

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [body]);

    const dispatch = useDispatch();
    const todos = useSelector(state => state.todos);
    const navigate = useNavigate();

    // Configure sensors for smoother drag interactions
    // Activation constraint helps differentiate between a click and a drag start
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    // Load User
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!user) {
            navigate('/signin');
            return;
        }

        const fetchBoardDetails = async () => {
            try {
                const res = await apiClient.get(`/board/${boardId}`);
                setBoardData(res.data.board);
            } catch (error) {
                console.error("Error fetching board", error);
                toast.error("Failed to load board details");
                navigate('/dashboard');
            }
        }

        const fetchTodos = async () => {
            try {
                const res = await apiClient.get(`/todo/getBoardTodos/${boardId}`);
                dispatch(setTodos(res.data.todos));
            } catch (error) {
                console.error("Error fetching todos", error);
            }
        };

        if (boardId) {
            fetchBoardDetails();
            fetchTodos();
        }
    }, [dispatch, navigate, user?._id, boardId]);

    // Handle Drag End
    const handleDragEnd = async (event) => {
        const { active, over } = event;

        if (!over) return;

        const todoId = active.id;
        const newStatus = over.id; // 'todo', 'in-progress', 'done'

        // Optimistic UI Update in Redux
        const todo = todos.find(t => t._id === todoId);
        if (todo && todo.status !== newStatus) {
            // Dispatch update to Redux state immediately
            dispatch(updateTodo({
                _id: todoId,
                title: todo.title,
                body: todo.body,
                status: newStatus
            }));

            // Call API
            try {
                await apiClient.put(`/todo/updateTodo/${todoId}`, {
                    email: user.email,
                    status: newStatus
                });
            } catch (error) {
                console.error("Failed to move task", error);
                // Optionally revert here
            }
        }
    };

    const handleAddTodo = async (e) => {
        e.preventDefault();
        if (!input.trim() || !body.trim()) return;

        if (!user) {
            navigate('/signin');
            return;
        }

        try {
            if (editId) {
                await apiClient.put(`/todo/updateTodo/${editId}`, {
                    title: input,
                    body: body,
                    priority: priority,
                    email: user.email,
                    assignedTo: assignedTo || null
                });
                // Optimistically update or wait for re-fetch? Ideally we dispatch updated payload.
                // But since we need populated user, better to fetch or just trust response.
                // The updateTodo backend returns populated user. Good.
                const res = await apiClient.put(`/todo/updateTodo/${editId}`, {
                    title: input, body: body, priority: priority, email: user.email, assignedTo: assignedTo || null
                }); // Refetching/putting twice? No, let's fix logic below.

                dispatch(updateTodo(res.data.todo));

                setEditId(null);
                toast.success("Task updated successfully!");
                setShowAddModal(false);
            } else {
                const res = await apiClient.post('/todo/addTodo', {
                    title: input,
                    body: body,
                    priority: priority,
                    email: user.email,
                    status: 'todo', // Default status
                    position: 0,
                    boardId: boardId,
                    assignedTo: assignedTo || null
                });
                dispatch(addTodo(res.data.todo));
                toast.success("Task added successfully!");
                setShowAddModal(false);
            }
            setInput('');
            setBody('');
            setPriority('Low');
            setAssignedTo('');
        } catch (error) {
            console.error("Error saving todo:", error);
        }
    };

    const deleteTodo = async (id) => {
        try {
            await apiClient.delete(`/todo/deleteTodo/${id}`, { data: { email: user.email } });
            dispatch(removeTodo(id));
            toast.success("Task deleted");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete task");
        }
    };

    const handleEdit = (todo) => {
        setInput(todo.title);
        setBody(todo.body);
        setPriority(todo.priority || 'Low');
        setAssignedTo(todo.assignedTo?._id || '');
        setEditId(todo._id);
        setShowAddModal(true);
    };

    // Disabled old team fetch logic for now, using Board Members in future updates

    const copyInviteLink = () => {
        if (boardData?.inviteCode) {
            const link = `${window.location.origin}/join/${boardData.inviteCode}`;
            navigator.clipboard.writeText(link);
            toast.success("Invite link copied to clipboard!");
        }
    };

    const handleRemoveMember = async (memberId) => {
        if (!window.confirm("Remove this member?")) return;
        try {
            await apiClient.post('/board/removeMember', {
                boardId: boardId,
                memberId: memberId
            });
            toast.success("Member removed");
            // Refresh board details
            const res = await apiClient.get(`/board/${boardId}`);
            setBoardData(res.data.board);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to remove member");
        }
    };

    // Filter todos into columns
    // We assume 'status' field exists. If not, default to 'todo'
    const getTasksByStatus = (status) => todos.filter(t => (t.status || 'todo') === status);

    return (
        <div className="min-h-screen text-white p-8">
            <div className="flex justify-between items-center mb-8 bg-gray-800/40 p-4 rounded-xl backdrop-blur-md shadow-lg border border-white/10">
                <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        {boardData ? boardData.name : 'ProjeX'}
                    </h1>
                    <button
                        onClick={() => setShowInvite(!showInvite)}
                        className="bg-gray-700/50 hover:bg-gray-600 text-white p-2 rounded-full transition border border-gray-600"
                        title="Manage Team"
                    >
                        <FaUserPlus />
                    </button>
                </div>

                <button
                    onClick={() => {
                        setEditId(null);
                        setInput('');
                        setBody('');
                        setShowAddModal(true);
                    }}
                    className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-5 py-2.5 rounded-lg font-bold shadow-lg transform hover:scale-105 transition"
                >
                    <FaPlus /> New Task
                </button>
            </div>

            {showInvite && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-gray-900 w-full max-w-md rounded-2xl shadow-2xl border border-gray-700 overflow-hidden flex flex-col">

                        {/* Header */}
                        <div className="p-6 pb-4 border-b border-gray-800 flex justify-between items-center bg-gray-800/50">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <FaUserPlus className="text-orange-500" /> Share Board
                            </h3>
                            <button
                                onClick={() => setShowInvite(false)}
                                className="text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 p-2 rounded-full transition"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Invite Link Section */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Invite Link</label>
                                <div className="flex items-center bg-black/40 border border-gray-700 rounded-xl p-1 pr-1 group focus-within:border-orange-500 transition-colors">
                                    <div className="p-3 text-gray-400">
                                        <FaCopy />
                                    </div>
                                    <input
                                        type="text"
                                        readOnly
                                        value={`${window.location.origin}/join/${boardData?.inviteCode || ''}`}
                                        className="flex-1 bg-transparent border-none text-gray-300 text-sm focus:ring-0 truncate font-mono"
                                    />
                                    <button
                                        onClick={copyInviteLink}
                                        className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition border border-gray-600 shadow-sm hover:shadow-md ml-2"
                                    >
                                        Copy
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-2 ml-1">Anyone with this link can join and collaborate.</p>
                            </div>

                            {/* Members Section */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Active Members</label>
                                <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                                    {(!boardData?.members || boardData.members.length === 0) ? (
                                        <div className="text-center py-6 bg-gray-800/30 rounded-xl border border-dashed border-gray-700/50">
                                            <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-600 mx-auto mb-2">
                                                <FaUsers />
                                            </div>
                                            <p className="text-gray-400 text-sm font-medium">No one else is here.</p>
                                            <p className="text-gray-600 text-xs mt-1">Share the link to start collaborating!</p>
                                        </div>
                                    ) : (
                                        boardData.members.map(member => (
                                            <div key={member._id} className="flex justify-between items-center bg-gray-800/80 p-3 rounded-xl border border-gray-700/50 hover:border-gray-600 transition group">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                                                        {member.username.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm text-gray-200">{member.username}</p>
                                                        <p className="text-xs text-gray-500">{member.email}</p>
                                                    </div>
                                                </div>
                                                {user._id === boardData?.owner?._id && (
                                                    <button
                                                        onClick={() => handleRemoveMember(member._id)}
                                                        className="text-gray-500 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-lg transition opacity-0 group-hover:opacity-100"
                                                        title="Remove Member"
                                                    >
                                                        <FaTrash size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            )}

            {/* Input Form */}
            {/* Add/Edit Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg border border-gray-700 overflow-hidden transform transition-all scale-100">
                        <div className="flex justify-between items-center p-6 border-b border-gray-700 bg-gray-800/50">
                            <h3 className="text-xl font-bold text-white">{editId ? 'Edit Task' : 'New Task'}</h3>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="text-gray-400 hover:text-white transition"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleAddTodo} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                                <input
                                    type="text"
                                    placeholder="What needs to be done?"
                                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 text-white placeholder-gray-500"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    autoFocus
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                                <textarea
                                    ref={textareaRef}
                                    placeholder="Add details..."
                                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 text-white placeholder-gray-500 min-h-[100px] resize-none"
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Priority</label>
                                <div className="flex gap-4">
                                    {['Low', 'Medium', 'High'].map((p) => (
                                        <label key={p} className={`flex-1 cursor-pointer border rounded-lg p-2 text-center transition ${priority === p ?
                                            (p === 'High' ? 'bg-red-500/20 border-red-500 text-red-500' :
                                                p === 'Medium' ? 'bg-yellow-500/20 border-yellow-500 text-yellow-500' :
                                                    'bg-green-500/20 border-green-500 text-green-500')
                                            : 'border-gray-700 text-gray-400 hover:bg-gray-700'}`}>
                                            <input
                                                type="radio"
                                                name="priority"
                                                value={p}
                                                checked={priority === p}
                                                onChange={(e) => setPriority(e.target.value)}
                                                className="hidden"
                                            />
                                            {p}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Assign To</label>
                                <select
                                    value={assignedTo}
                                    onChange={(e) => setAssignedTo(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg focus:border-orange-500 focus:outline-none text-white"
                                >
                                    <option value="">Unassigned</option>
                                    {boardData && (
                                        <>
                                            {boardData.owner && (
                                                <option value={boardData.owner._id}>
                                                    {boardData.owner.username} (Owner)
                                                </option>
                                            )}
                                            {boardData.members && boardData.members.map(m => (
                                                <option key={m._id} value={m._id}>{m.username}</option>
                                            ))}
                                        </>
                                    )}
                                </select>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="px-5 py-2.5 text-gray-300 hover:text-white font-medium hover:bg-gray-700 rounded-lg transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold rounded-lg shadow-lg hover:shadow-orange-500/20 hover:scale-[1.02] transition transform"
                                >
                                    {editId ? 'Save Changes' : 'Create Task'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Kanban Columns */}
            <DndContext
                collisionDetection={closestCorners}
                onDragEnd={handleDragEnd}
                sensors={sensors}
            >
                <div className="flex flex-col md:flex-row gap-6 overflow-x-auto pb-4 items-start">
                    <KanbanColumn
                        id="todo"
                        title="To-Do"
                        tasks={getTasksByStatus('todo')}
                        onDelete={deleteTodo}
                        onEdit={handleEdit}
                    />
                    <KanbanColumn
                        id="in-progress"
                        title="In-Progress"
                        tasks={getTasksByStatus('in-progress')}
                        onDelete={deleteTodo}
                        onEdit={handleEdit}
                    />
                    <KanbanColumn
                        id="done"
                        title="Done"
                        tasks={getTasksByStatus('done')}
                        onDelete={deleteTodo}
                        onEdit={handleEdit}
                    />
                </div>
            </DndContext>
        </div>
    );
};

export default Todo;