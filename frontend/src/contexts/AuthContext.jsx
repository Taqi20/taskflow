import { useLoading } from "./LoadingContext";
import { HOST } from "../config/config";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
}

//checks whether user is authenticated or not, throughout. if not, user gets redirected to login page

export const AuthProvider = ({ children }) => {
    const [ user, setUser ] = useState(null);
    const setLoading = useLoading();

    async function getUser() {
        setLoading(true);

        try {
            const res = await fetch(`${HOST}/user`, {
                method: "GET",
                credentials: "include",
            });

            const data = await res.json();
            if (data.user) {
                setUser(data.user);
                return;
            } else {
                setUser(null);
            }

        } catch (error) {
            console.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getUser();
    }, []);

    return (
        <AuthContext.Provider value={
            { user, setUser, getUser }
        }>
            {children}
        </AuthContext.Provider>
    )
}