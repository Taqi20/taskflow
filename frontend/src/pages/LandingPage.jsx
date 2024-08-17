import React, { useEffect } from 'react'
import Navbar from '../components/NoAuths/Navbar'
import { Outlet } from 'react-router-dom'

function LandingPage() {

    useEffect(() => {

        document.body.style.backgroundColor = "#b9e4ff";

        return () => {
            document.body.style.backgroundColor = "";

        }
    }, []);

    return (
        <>
            <Navbar />
            <Outlet />
        </>
    )
}

export default LandingPage