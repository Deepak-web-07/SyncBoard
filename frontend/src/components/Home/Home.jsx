import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRocket, FaUsers, FaCheckCircle, FaShieldAlt } from 'react-icons/fa';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-900 text-white overflow-x-hidden">
            {/* Hero Section */}
            <div className="relative h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">

                {/* Background Blobs */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-40 right-10 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

                <div className="relative z-10 max-w-4xl mx-auto space-y-8 animate-fadeIn">
                    <div className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold tracking-wider text-orange-400 uppercase bg-orange-500/10 rounded-full border border-orange-500/20">
                        The Future of Productivity
                    </div>

                    <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight leading-tight">
                        Sync Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-600">Workflow</span>.<br />
                        Master Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Goals</span>.
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Experience visual task management reimagined.
                        Streamline projects, collaborate in real-time, and ship faster with SyncBoard.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-orange-500 to-pink-600 rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-105 transition transform flex items-center justify-center gap-2"
                        >
                            <FaRocket /> Get Started for Free
                        </button>
                        <button
                            onClick={() => navigate('/about')}
                            className="px-8 py-4 text-lg font-bold text-gray-300 bg-gray-800/50 hover:bg-gray-800 rounded-xl border border-gray-700 hover:text-white transition flex items-center justify-center gap-2"
                        >
                            Learn More
                        </button>
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="py-24 bg-gray-800/30 backdrop-blur-sm border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Everything you need to ship</h2>
                        <p className="text-gray-400 text-lg">Powerful features built for modern teams.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<FaCheckCircle className="text-green-400" />}
                            title="Task Tracking"
                            desc="Visualize your work with Kanban boards that keep everyone aligned and moving forward."
                        />
                        <FeatureCard
                            icon={<FaUsers className="text-blue-400" />}
                            title="Team Collaboration"
                            desc="Invite members to your workspace, assign tasks, and watch productivity soar."
                        />
                        <FeatureCard
                            icon={<FaShieldAlt className="text-purple-400" />}
                            title="Secure & Reliable"
                            desc="Your data is safe with us. Built with modern security standard and robust infrastructure."
                        />
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-20 px-6 text-center">
                <div className="max-w-4xl mx-auto bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-12 border border-gray-700 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl"></div>
                    <div className="relative z-10">
                        <h2 className="text-4xl font-bold mb-6">Ready to streamline your workflow?</h2>
                        <p className="text-gray-400 mb-8 text-lg">Join thousands of teams who rely on SyncBoard every day.</p>
                        <button
                            onClick={() => navigate('/signup')}
                            className="px-10 py-4 text-xl font-bold text-gray-900 bg-white hover:bg-gray-100 rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-1 transition transform"
                        >
                            Start Now - It's Free
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <div className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700/50 hover:bg-gray-800 hover:border-gray-600 transition group cursor-default">
        <div className="w-14 h-14 bg-gray-900 rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition shadow-lg">
            {icon}
        </div>
        <h3 className="text-xl font-bold mb-3 group-hover:text-orange-400 transition">{title}</h3>
        <p className="text-gray-400 leading-relaxed">
            {desc}
        </p>
    </div>
);

export default Home;