import React from 'react';
import { useAuth } from './contexts/AuthContext';
import { createBrowserRouter, createRoutesFromElements, Navigate, Route, RouterProvider } from 'react-router-dom';
import LandingPage from "./pages/LandingPage";
import ErrorPage from "./pages/ErrorPage";
import Home from "./components/NoAuths/Home";
import About from "./components/NoAuths/About";
import Login from './components/NoAuths/Login';
import Signup from './components/NoAuths/Signup';

export default function Layout() {

    const user = useAuth();

    const router = createBrowserRouter(
        createRoutesFromElements(
            <>
                <Route
                    path='/'
                    element={
                        // !user ? <LandingPage /> : <Navigate to={"/app"} replace={true}/>
                        <LandingPage />
                    }
                    errorElement={<ErrorPage />}
                >
                    <Route path="" element={<Home />} />
                    <Route path="about" element={<About />} />
                    <Route path="login" element={<Login />} />
                    <Route path="signup" element={<Signup />} />
                </Route>
            </>
        )
    )


    return (
        <RouterProvider router={router} />
    )
}
