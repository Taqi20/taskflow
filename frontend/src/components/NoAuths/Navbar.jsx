import { useState } from "react";
import { Link } from "react-router-dom";
import close from "../../assets/close.png"
import menu from "../../assets/menu.png"


export const navLinks = [
    {
        id: "home",
        title: "Home",
        link: "/",
    },
    {
        id: "about",
        title: "About",
        link: "/about",
    },
    {
        id: "login",
        title: "Login",
        link: "/login",
    }, {
        id: "signup",
        title: "Signup",
        link: "/signup",
    },
];

const Navbar = () => {
    const [ active, setActive ] = useState("HOME");
    const [ toggle, setToggle ] = useState(false);
    // Function to toggle the sidebar
    const toggleSidebar = () => {
        setToggle(!toggle);
        // Toggle body overflow to prevent horizontal scrolling when the sidebar is active
        document.body.style.overflowX = toggle ? "hidden" : "auto";
    };

    return (
        <>
            <div className="bg-[#72b8ff] sticky z-20 w-full text-content top-0 transition-all duration-300 py-2">
                <div className="sm:px-6 px-1 flex justify-around items-center">
                    <div className={`xl:max-w-[1280px] w-11/12`}>
                        <nav className="w-full flex py-2 justify-between items-center">
                            <Link to={"/"} className="flex flex-row items-center ">
                                <span className="text-white text-2xl">TaskFlow</span>
                            </Link>

                            {/* Desktop Navigation */}
                            <ul className="list-none md:flex hidden justify-end items-center flex-1">
                                {navLinks.map((nav) => (
                                    <li
                                        key={nav.id}
                                        className={`mx-4 font-semibold cursor-pointer text-sm md:text-base ${active === nav.title
                                            ? "text-white"
                                            : "text-gray-300 hover:text-white"
                                            }`}
                                        onClick={() => setActive(nav.title)}
                                    >
                                        <Link to={nav.link}>{nav.title}</Link>
                                    </li>
                                ))}
                            </ul>

                            {/* Mobile Navigation */}
                            <div className="md:hidden flex justify-end items-center">
                                <img
                                    src={toggle ? close : menu}
                                    alt="menu"
                                    className="w-6 h-6 object-contain z-50"
                                    onClick={() => setToggle(!toggle)}
                                />
                            </div>
                        </nav>
                    </div>
                </div>
            </div>

            {/* Sidebar */}
            <div
                className={`${toggle ? "translate-x-0" : "translate-x-full"
                    } fixed top-0 right-0 w-3/4 max-w-sm h-full bg-[#61affd] transition-transform transform duration-300 ease-in-out z-40`}
            >
                <ul className="list-none flex flex-col pt-6 gap-y-8 px-4">
                    {navLinks.map((nav) => (
                        <li
                            key={nav.id}
                            className={`text-center font-semibold text-lg py-2 ${active === nav.title
                                ? "text-white"
                                : "text-gray-300 hover:text-white"
                                }`}
                            onClick={() => {
                                setActive(nav.title);
                                setToggle(false); // Close the sidebar when a link is clicked
                            }}
                        >
                            <Link to={nav.link}>{nav.title}</Link>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};

export default Navbar;