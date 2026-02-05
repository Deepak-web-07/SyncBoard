import React from 'react'

const About = () => {
    return (
        <>
            <div className='text-white min-h-screen w-full flex flex-col items-center p-8'>
                <div className='w-full max-w-5xl'>
                    {/* Header Section */}
                    <div className='mb-12'>
                        <h1 className='text-6xl py-3 font-bold text-white text-left border-b-4 border-orange-500 w-fit mb-6'>About Us</h1>
                        <p className='text-xl leading-relaxed text-gray-300 text-justify tracking-wide'>
                            Welcome to <span className='text-orange-500 font-semibold'>SyncBoard</span>, where organization meets simplicity.
                            We built this platform because we believe managing your day shouldn't be a chore in itself.
                            Whether you are a student, a creative, or a busy parent, our intuitive interface helps you declutter your mind and focus on what truly matters.
                            <br /><br />
                            No complex setups, no steep learning curves—just a clean space to turn your plans into action.
                            Join us on our journey to make productivity effortless and accessible for everyone.
                        </p>
                    </div>

                    {/* New Section: Our Mission / Values */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
                        <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-orange-500/20 transition-shadow duration-300">
                            <h2 className="text-3xl font-bold text-orange-400 mb-4">Our Mission</h2>
                            <p className="text-gray-300 leading-relaxed">
                                To empower individuals and teams to achieve more by simplifying the way they manage tasks. We aim to remove the friction from productivity, allowing you to spend less time planning and more time doing.
                            </p>
                        </div>
                        <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-orange-500/20 transition-shadow duration-300">
                            <h2 className="text-3xl font-bold text-orange-400 mb-4">Why Choose Us?</h2>
                            <ul className="list-disc list-inside text-gray-300 space-y-2">
                                <li><span className="text-white font-semibold">Minimalist Design:</span> Clutter-free interface for maximum focus.</li>
                                <li><span className="text-white font-semibold">Lightning Fast:</span> Optimized performance for seamless interaction.</li>
                                <li><span className="text-white font-semibold">Secure & Reliable:</span> Your data is protected with top-tier security.</li>
                                <li><span className="text-white font-semibold">Anywhere Access:</span> Manage your tasks from any device.</li>
                            </ul>
                        </div>
                    </div>

                    {/* New Section: The 'Story' or 'Features' */}
                    <div className='mb-12'>
                        <h2 className='text-4xl font-bold text-white mb-6 border-l-4 border-orange-500 pl-4'>What Drives Us</h2>
                        <p className='text-lg text-gray-300 leading-relaxed text-justify'>
                            In a world filled with distractions, staying on track is harder than ever. We realized that many productivity tools were too complex, adding to the noise instead of reducing it.
                            That's why we created <strong>SyncBoard</strong>. We wanted a tool that feels invisible—one that supports your workflow without demanding your attention.
                            From the carefully chosen color palette to the satisfying interactions, every detail is crafted to make your experience smooth and encouraging.
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default About