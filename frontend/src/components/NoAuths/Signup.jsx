import { useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import textFieldTheme from "./textFieldTheme";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { HOST } from "../../config/config.js";


export default function Signup() {
    const [ fullName, setFullName ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ confirmPassword, setConfirmPassword ] = useState("");
    const [ error, setError ] = useState("");
    const [ success, setSuccess ] = useState("");
    const navigate = useNavigate();
    const { setUser } = useAuth();

    useEffect(() => {
        if (!fullName && !email && !password && !confirmPassword) {
            setError("");
        }
    }, [ fullName, email, password, confirmPassword ]);

    useEffect(() => {
        if (!confirmPassword && error === "Passwords do not match") {
            setError("");
        } else if (
            password !== confirmPassword &&
            confirmPassword.length > 0 &&
            isPasswordValid(password)
        ) {
            setError("Passwords do not match");
        } else if (
            password === confirmPassword &&
            confirmPassword.length > 0 &&
            isPasswordValid(password)
        ) {
            setError("");
        }
    }, [ confirmPassword, password ]);

    useEffect(() => {
        if (!isPasswordValid(password) && password.length > 0) {
            setError(
                "Password must be at least 6 characters long and contain at least one letter, one number, and one special character."
            );
        } else if (
            isPasswordValid(password) &&
            error ===
            "Password must be at least 6 characters long and contain at least one letter, one number, and one special character."
        ) {
            setError("");
        }
    }, [ password ]);

    const isPasswordValid = (password) => {
        const passwordRegex =
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
        return passwordRegex.test(password);
    };

    const isEmailValid = (email) => {
        // Simple email validation using a regular expression
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
        return emailRegex.test(email);
    };

    //Handle Signup Request
    const handleRegister = async (e) => {
        e.preventDefault();

        if (
            fullName.trim() === "" ||
            email.trim() === "" ||
            password.trim() === "" ||
            confirmPassword.trim() === ""
        ) {
            setError("All fields are required");
            return;
        }

        if (!isPasswordValid(password)) {
            setError(
                "Password must be at least 6 characters long and contain at least one letter, one number, and one special character."
            );
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (!isEmailValid(email)) {
            setError("Enter a Valid Email Address.");
            return;
        }

        try {
            const response = await fetch(`${HOST}/auth/createuser`, {
                method: "POST",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: fullName.trim(), email: email.trim(), password: password.trim() }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setSuccess("Registration successful!");
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
            setError("An error occurred while registering.");
            setSuccess("");
        }
    };

    return (
        <>
            <div className="h-full flex flex-col items-center justify-center  bg-[#72b8ff] w-4/5 sm:w-2/4 lg:w-1/3 mx-auto mt-10 2xl:mt-32 rounded-lg mb-10">
                <p className="font-popins text-4xl md:text-4xl font-semibold text-gray-200 mb-3 mt-20">
                    Sign Up
                </p>
                <div className="h-3 mb-8">
                    {error && (
                        <p className="text-red-500 p-2 text-xs md:text-base">* {error}</p>
                    )}
                    {success && <p className="text-white">* {success}</p>}
                </div>
                <ThemeProvider theme={textFieldTheme}>
                    <form className="w-full" onSubmit={(e) => handleRegister(e)}>
                        <div className="flex flex-col space-y-6 items-center mx-auto w-4/5">
                            <TextField
                                variant="standard"
                                label="Full Name"
                                className="w-full"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                            <TextField
                                variant="standard"
                                type="email"
                                label="Email"
                                className="w-full"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <TextField
                                type="password"
                                variant="standard"
                                label="Password"
                                className="w-full"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                }}
                            />
                            <TextField
                                type="password"
                                variant="standard"
                                label="Confirm Password"
                                className="w-full"
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    // validatePasswords(e); // Real-time validation
                                }}
                            />
                            <button
                                type="submit"
                                className="text-white bg-[#5daeff] px-4 py-2 rounded-lg text-lg hover:bg-[#41a0ff]"
                                onClick={handleRegister}
                            >
                                Register
                            </button>
                        </div>
                    </form>
                    <div className="flex flex-col items-center space-y-2 mt-5">
                        <p className="text-gray-200">Already Registered?</p>
                        <Link to={'/login'}>
                            <button className="bg-gray-200 hover:bg-gray-100 px-4 py-2 rounded-md mb-5">
                                Login Here
                            </button>
                        </Link>
                    </div>
                </ThemeProvider>
            </div>
        </>
    );
}
