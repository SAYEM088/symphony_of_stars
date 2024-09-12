import { useState } from 'react';
import { FaHome, FaStar, FaPuzzlePiece, FaMusic, FaPalette } from 'react-icons/fa';
import { BsSoundwave } from "react-icons/bs";
const Navbar = () => {
    const [expanded, setExpanded] = useState(false);

    const handleMouseEnter = () => {
        setExpanded(true);
        setTimeout(() => {
            setExpanded(false);
        }, 5000); // 5 seconds delay before collapsing
    };

    return (
        <nav className="fixed top-0 left-0 bg-transparent text-white p-6 z-10">
            <ul className="space-y-3">
                {/* Home Icon */}
                <li onMouseEnter={handleMouseEnter}>
                    <a href="/starspace" className="group flex items-center py-2 px-4">
                        <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition duration-300 shadow-md">
                            <FaHome className="text-white" />
                        </div>
                        <span className={`ml-4 ${expanded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
                            Home
                        </span>
                    </a>
                </li>

                {/* Expanded Menu Items */}
                {expanded && (
                    <>
                        {/* Search Star */}
                        <li>
                            <a href="/" className="group flex items-center py-2 px-4">
                                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition duration-300 shadow-md">
                                    <FaStar className="text-white" />
                                </div>
                                <span className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    Search Star
                                </span>
                            </a>
                        </li>

                        {/* Image Match */}
                        <li>
                            <a href="/imagematch" className="group flex items-center py-2 px-4">
                                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition duration-300 shadow-md">
                                    <FaPuzzlePiece className="text-white" />
                                </div>
                                <span className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    Image Match
                                </span>
                            </a>
                        </li>

                        {/* Sound Match */}
                        <li>
                            <a href="/soundmatch" className="group flex items-center py-2 px-4">
                                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition duration-300 shadow-md">
                                    <FaMusic className="text-white" />
                                </div>
                                <span className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    Sound Match
                                </span>
                            </a>
                        </li>

                        {/* Sound Compose */}
                        <li>
                            <a href="/soundcompose" className="group flex items-center py-2 px-4">
                                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition duration-300 shadow-md">
                                    <BsSoundwave className="text-white" />
                                </div>
                                <span className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    Sound Compose
                                </span>
                            </a>
                        </li>

                        {/* Draw */}
                        <li>
                            <a href="/draw" className="group flex items-center py-2 px-4">
                                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition duration-300 shadow-md">
                                    <FaPalette className="text-white" />
                                </div>
                                <span className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
