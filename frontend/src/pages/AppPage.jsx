import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Navigate, Outlet } from 'react-router-dom';

function AppPage() {

    const { user } = useAuth();
    if (!user) {
        return <Navigate to={"/login"} replace={true} />
    }
    return (
        <>
            <Outlet />
        </>
    )
}

export default AppPage