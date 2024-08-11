import React from 'react';
import { useAuth } from './contexts/AuthContext';
import { createBrowserRouter, createRoutesFromElements, Navigate, Route, RouterProvider } from 'react-router-dom';
import LandingPage from "./pages/LandingPage";
import ErrorPage from "./pages/ErrorPage";
import Home from "./components/NoAuths/Home";
import About from "./components/NoAuths/About";

export default function Layout() {

    const user = useAuth();

    const router = createBrowserRouter(
        createRoutesFromElements(
            <>
                <Route
                    path='/'
                    element={
                        !user ? <LandingPage /> : <Navigate to={"/app"} replace={true} />
                    }
                    errorElement={<ErrorPage />}
                >
                    <Route path="" element={<Home />} />
                    <Route path="about" element={<About />} />
                </Route>
            </>
        )
    )


    return (
        <RouterProvider router={router} />
    )
}
