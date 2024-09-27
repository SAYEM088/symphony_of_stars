import { useState } from 'react';
import { FaHome, FaStar, FaPuzzlePiece, FaMusic, FaPalette } from 'react-icons/fa';
import { BsSoundwave } from "react-icons/bs";

const Navbar = () => {
    const [expanded, setExpanded] = useState(false);

    const handleMouseEnter = () => {
        setExpanded(true);
        setTimeout(() => {
            setExpanded(false);
        }, 10000); 
    };

    return (
        <nav className="fixed top-0 left-0 bg-transparent text-white  p-5 z-10">
            <ul className="flex ">
                <li onMouseEnter={handleMouseEnter}>
                    <a href="/" className="group flex flex-col items-center py-1 px-1">
                        <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-cyan-500 rounded-full flex items-center justify-center border border-cyan-500 hover:border-3xl hover:border-cyan-200  hover:shadow-xl transition duration-500">
                            <FaHome className="text-white text-xl" />
                        </div>
                        <span className={`mt-1 ${expanded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
                            Home 
                        </span>
                    </a>
                </li>

                {expanded && (
                    <>
                        <li>
                            <a href="/searchstars " className="group flex flex-col items-center py-1 ps-2">
                                <div className="w-12 h-12  bg-gradient-to-r from-cyan-400 to-red-600 rounded-full flex items-center justify-center border border-cyan-500 hover:border-3xl hover:border-cyan-200  hover:shadow-xl transition duration-500 ">
                                    <FaStar className="text-white text-xl" />
                                </div>
                                <span className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    Search Star 
                                </span>
                            </a>
                        </li>

                        <li>
                            <a href="/imagematch" className="group flex flex-col items-center py-1 ps-1">
                                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-cyan-600 rounded-full flex items-center justify-center border border-cyan-500 hover:border-3xl hover:border-cyan-200  hover:shadow-xl transition duration-500">
                                    <FaPuzzlePiece className="text-white text-xl" />
                                </div>
                                <span className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    Image Match 
                                </span>
                            </a>
                        </li>

                        <li>
                            <a href="/soundmatch" className="group flex flex-col items-center py-1 ps-1">
                                <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-red-600 rounded-full flex items-center justify-center border border-cyan-500 hover:border-3xl hover:border-cyan-200  hover:shadow-xl transition duration-500">
                                    <FaMusic className="text-white text-xl" />
                                </div>
                                <span className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    Sound Match 
                                </span>
                            </a>
                        </li>

                        <li>
                            <a href="/soundcompose" className="group flex flex-col items-center py-1 pr-1 ">
                                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-cyan-600 rounded-full flex items-center justify-center border border-cyan-500 hover:border-3xl hover:border-cyan-200  hover:shadow-xl transition duration-500">
                                    <BsSoundwave className="text-white text-xl" />
                                </div>
                                <span className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    Sound Compose 
                                </span>
                            </a>
                        </li>

                        <li>
                            <a href="/draw" className="group flex flex-col items-center py-1 px-1">
                                <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-cyan-500 rounded-full flex items-center justify-center border border-cyan-500 hover:border-3xl hover:border-cyan-200  hover:shadow-xl transition duration-500">
                                    <FaPalette className="text-white text-xl" />
                                </div>
                                <span className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
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
