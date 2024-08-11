import React from 'react'
import { Link, NavLink } from 'react-router-dom';

export default function Navbar() {

    const navLinksStyle = ({ isActive }) =>
        `mr-3 md:mr-5 ${isActive ? "text-white" : "text-gray-300"} font-medium md:text-lg cursor-pointer`;

    return (
        <header>
            <div className="mx-auto flex flex-col md:flex-row justify-between p-3 items-center">
                <Link to="/" className='mb-0 cursor-pointer'>
                    <span className='ml-3 text-3xl md:text-4xl font-bold text-gray-100'>TaskFlow</span>
                </Link>
                <nav className="text-base mx-auto md:mx-0 md:ml-auto">
                    <NavLink to="/" className={navLinksStyle}>
                        Home
                    </NavLink>
                    <NavLink to="/about" className={navLinksStyle}>
                        About
                    </NavLink>
                </nav>
            </div>
        </header>
    )
}