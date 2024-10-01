"use client"
import Navbar from '@/components/Navbar';
import ProfileCard from '@/components/ProfileCard';
import React, { useState, useEffect } from 'react';
import { IoMdStarHalf } from "react-icons/io";
import { GoShareAndroid } from "react-icons/go";
import { FaArrowUpWideShort } from "react-icons/fa6";
import { FcLike } from "react-icons/fc";
import { AiOutlineHeart, AiOutlineShareAlt } from 'react-icons/ai';
const SocialFeed = () => {
    const mockPosts = [
        {
            id: 1,
            img:"/formal.jpg",
            account: "Mr Sam",
            username: "@sam880",
            content: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.",
            time: "9:30 PM",
            date: "Feb 5, 2022"
        },
        {
            id: 2,
            account: "Account 2",
            username: "@usertwo",
            content: "Sed diam nonummy nibh euismod tincidunt ut laoreet dolore.",

            time: "10:00 AM",
            date: "Mar 15, 2022"
        },
        {
            id: 3,
            account: "Account 1",
            username: "@userone",
            content: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.",
            time: "9:30 PM",
            date: "Feb 5, 2022"
        },
        {
            id: 4,
            account: "Account 2",
            username: "@usertwo",
            content: "Sed diam nonummy nibh euismod tincidunt ut laoreet dolore.",
            time: "10:00 AM",
            date: "Mar 15, 2022"
        }
    ];
    const [posts, setPosts] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {

        setPosts(mockPosts);
    }, []);

    return (

        <div className="grid grid-cols-8 h-screen pt-20">
            <Navbar></Navbar>

            <div className="col-span-2  bg-gray-100 p-4">
                <div className="sticky top-0">

                    <div className="bg-white p-4 rounded shadow">
                        <div className="flex ">
                            <div className="pt-2 ps-2">
                                <img
                                    src="/formal.jpg"
                                    alt="profile"
                                    style={{ height: "6rem", width: "6rem" }}
                                    className="object-cover rounded-xl px-1"
                                />
                                <p className="text-pink-900 text-center text-xl py-2">sam</p>
                            </div>
                            <div className="flex justify-end ms-auto">
                                <div className="">
                                    <IoMdStarHalf size={40} className="bg-gradient-to-r from-cyan-300  to-orange-400 text-yellow-900 mx-1 rounded-full p-1 " />
                                    <div className="flex text-pink-800 items-center justify-center" ><p className='text-xl '>6</p><FaArrowUpWideShort size={8} /></div>
                                </div>
                                <div className="">
                                    <GoShareAndroid size={40} className="bg-gradient-to-r from-cyan-200  to-orange-300 text-cyan-800 mx-1 rounded-full p-2" />
                                    <div className="flex text-pink-800 items-center justify-center" ><p className='text-xl'>50</p><FaArrowUpWideShort size={8} /></div>
                                </div>
                                <div className="">
                                    <FcLike size={40} className="bg-gradient-to-r from-cyan-200  to-orange-300 text-red-800 mx-1 rounded-full p-2" />
                                    <div className="flex text-pink-800 items-center justify-center" ><p className='text-xl'>246</p><FaArrowUpWideShort size={8} /></div>
                                </div>
                            </div>
                        </div>
                        <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">Follow</button>
                    </div>

                    <div className="mt-8">
                        <h3 className="text-lg font-semibold">Contributions</h3>
                    </div>
                    <></>
                </div>
            </div>

            <div className="col-span-6 bg-gray-50 p-4 overflow-y-auto">

                <div className="space-y-4">
                    <div className="bg-white p-4 rounded shadow">
                        {posts.map(post => (
                            <div key={post.id} className="post-card bg-white border border-cyan-600 p-4 mb-4 rounded-lg shadow-md border">
                                <div className="flex items-center mb-2">
                                    <div className="rounded-full bg-gray-300 w-10 h-10 mr-2"><img src={post.img} alt="" className='rounded-full'/></div>
                                    <div>
                                        <h4 className="font-bold">{post.account}</h4>
                                        <p className="text-sm text-gray-600">{post.username}</p>
                                    </div>
                                </div>
                                <p className="text-lg mb-2">{post.content}</p>
                                <div className="text-sm text-gray-500 mt-2">
                                    <span>{post.time}</span> • <span>{post.date}</span>
                                </div>
                                <div className="flex justify-between items-center mt-3">
                                    <button className="flex items-center text-red-500 hover:text-red-700">
                                        <AiOutlineHeart className="mr-1" /> Love
                                    </button>
                                    <button className="flex items-center text-blue-500 hover:text-blue-700" >
                                        <AiOutlineShareAlt className="mr-1" /> Share
                                    </button>

                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Post 2 */}
                    <div className="bg-white p-4 rounded shadow">
                        <h3 className="font-semibold text-lg">User 2</h3>
                        <p>Here's the second post content...</p>
                    </div>
                    {/* More posts */}
                    <div className="bg-white p-4 rounded shadow">
                        <h3 className="font-semibold text-lg">User 3</h3>
                        <p>Another post content...</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SocialFeed;
