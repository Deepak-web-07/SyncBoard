import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../api/axiosClient';
import toast from 'react-hot-toast';

const JoinBoard = () => {
    const { inviteCode } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const joinBoard = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (!user) {
                    toast.error("Please login to join the board");
                    // Store intended destination (optional, but good UX)
                    navigate('/signin');
                    return;
                }

                const res = await apiClient.post('/board/join', { inviteCode });
                toast.success(res.data.message);

                // Redirect to the board
                navigate(`/board/${res.data.boardId}`);

            } catch (error) {
                console.error(error);
                toast.error(error.response?.data?.message || "Failed to join board");
                navigate('/dashboard');
            }
        };

        if (inviteCode) {
            joinBoard();
        }
    }, [inviteCode, navigate]);

    return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center">
                <div className="h-12 w-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <h2 className="text-xl font-bold">Joining Board...</h2>
            </div>
        </div>
    );
};

export default JoinBoard;
