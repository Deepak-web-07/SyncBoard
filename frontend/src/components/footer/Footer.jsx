import React from 'react'
import { GiNotebook } from "react-icons/gi";


const Footer = () => {
    return (
        <>
            <div className='bg-gray-800/50'>
                <div className='text-white py-6 px-4 mx-auto  max-w-7xl px-2 sm:px-6 lg:px-0'>
                    <h4 className='text-2xl font-bold text-orange-500 flex items-center gap-2'>
                        <img src="/SyncBoard.png" alt="SyncBoard Logo" className="w-35 h-16 object-contain rounded-md" />
                    </h4> <p>&copy; 2026 Deepak_Kushwah. All rights reserved.</p>
                </div>
            </div>

        </>
    )
}

export default Footer