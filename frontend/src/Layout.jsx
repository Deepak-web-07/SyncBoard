import React from 'react'
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar/Navbar'
import Footer from './components/footer/Footer'
import { Outlet } from 'react-router-dom'

function Layout() {
    return (
        <>
            <Toaster
                position="top-right"
                reverseOrder={false}
                containerStyle={{
                    top: '70px',
                }}
            />
            <Navbar />
            <Outlet />
            <Footer />
        </>
    )
}

export default Layout