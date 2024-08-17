import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom'
import { HOST } from '../../config/config';
import { ThemeProvider } from '@mui/material/styles';
import textFieldTheme from './textFieldTheme'
import { TextField } from '@mui/material';

export default function Login() {

    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ error, setError ] = useState("");
    const [ success, setSuccess ] = useState("");
    const { user, setUser } = useAuth();

    const navigate = useNavigate();

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const isEmailValid = (eamil) => {
        // Simple email validation using a regular expression
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
        return emailRegex.test(email);
    }

    //handle login request
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (email.trim() === "" || password.trim() === "") {
            setError("All fields are necessary");
            return;
        }

        if (!isEmailValid(email)) {
            setError("Enter a Valid Email");
            return;
        }

        //creating object of the given info, so that we can hit our api with this data

        const data = {
            email: eamil.trim(),
            password: password.trim(),
        };

        try {
            //post request
            const response = await fetch(`${HOST}/auth/login`, {
                method: "POST",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const data = await response.json();

                if (data.success) {
                    setSuccess("Login succesful!");
                    setError("");
                    setUser(data.user);
                    navigate("/app", { replace: true });
                } else {
                    setError(data.message);
                    setSuccess("");
                }
            } else {
                const errorData = await response.json();
                setError(errorData.message);
                setSuccess("");
            }
        } catch (error) {
            console.error("An error occurred while logging in:", error);
            setError("An error occurred while logging in")
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            {user ? <p className="text-gray-300 text-xl font-semibold fixed top-16 left-3">Redirecting to the App...</p> : null}
            <div className='h-full flex flex-col items-center justify-center'>
                <p className="text-4xl md:text-5xl font-semibold text-gray-200 mb-3 mt-20">LogIn</p>
                <div className="h-3 mb-8">
                    {error && <p className="text-red-500 p-2">* {error}</p>}
                    {success && <p className="text-white p-2">* {success}</p>}
                </div>

                <ThemeProvider theme={textFieldTheme}>
                    <form onSubmit={handleSubmit} className='w-full'>
                        <div className="flex flex-col space-y-8 items-center mx-auto w-3/6 md:w-2/6">
                            <TextField
                                variant="standard"
                                label="Email"
                                type="email"
                                value={email}
                                onChange={handleEmailChange}
                                className="w-full bg-[#6063B1]"
                            />
                            <TextField
                                variant="standard"
                                type="password"
                                label="Password"
                                value={password}
                                onChange={handlePasswordChange}
                                className="w-full"
                            />
                            <button type="submit" className="text-white bg-[#444684] px-4 py-2 rounded-lg text-lg hover:bg-[#4a4c8f]">
                                Login
                            </button>
                        </div>
                    </form>
                    <div className="flex flex-col items-center space-y-2 mt-5">
                        <p className="text-gray-200">New User?</p>
                        <Link to={'/signup'}>
                            <button className="bg-gray-200 hover:bg-gray-100 px-4 py-2 rounded-md">
                                Register Here
                            </button>
                        </Link>
                    </div>
                </ThemeProvider>
            </div>
        </>
    )
}