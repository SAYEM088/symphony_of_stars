import { useState } from 'react';
import { FaHome, FaStar, FaPuzzlePiece, FaMusic, FaPalette } from 'react-icons/fa';
import { BsSoundwave } from "react-icons/bs";

const Navbar = () => {
    const [expanded, setExpanded] = useState(false);

    const handleMouseEnter = () => {
        setExpanded(true);
        setTimeout(() => {
            setExpanded(false);
        }, 9000); 
    };

    return (
        <nav className="fixed top-0 left-0 bg-transparent text-white p-5 z-10">
            <ul className="flex space-x-1">
                <li onMouseEnter={handleMouseEnter}>
                    <a href="/" className="group flex flex-col items-center py-2 px-2">
                        <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition duration-500 shadow-md">
                            <FaHome className="text-white" />
                        </div>
                        <span className={`mt-2 ${expanded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
                            Home 
                        </span>
                    </a>
                </li>

                {expanded && (
                    <>
                        <li>
                            <a href="/searchstars " className="group flex flex-col items-center py-2 px-1">
                                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition duration-500 shadow-md">
                                    <FaStar className="text-white" />
                                </div>
                                <span className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    Search Star 
                                </span>
                            </a>
                        </li>

                        <li>
                            <a href="/imagematch" className="group flex flex-col items-center py-2 px-1">
                                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition duration-500 shadow-md">
                                    <FaPuzzlePiece className="text-white" />
                                </div>
                                <span className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    Image Match 
                                </span>
                            </a>
                        </li>

                        <li>
                            <a href="/soundmatch" className="group flex flex-col items-center py-2 px-1">
                                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition duration-500 shadow-md">
                                    <FaMusic className="text-white" />
                                </div>
                                <span className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    Sound Match 
                                </span>
                            </a>
                        </li>

                        <li>
                            <a href="/soundcompose" className="group flex flex-col items-center py-2 px-1">
                                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition duration-500 shadow-md">
                                    <BsSoundwave className="text-white" />
                                </div>
                                <span className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    Sound Compose 
                                </span>
                            </a>
                        </li>

                        <li>
                            <a href="/draw" className="group flex flex-col items-center py-2 px-1">
                                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition duration-500 shadow-md">
                                    <FaPalette className="text-white" />
                                </div>
                                <span className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    Draw
                                </span>
                            </a>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
