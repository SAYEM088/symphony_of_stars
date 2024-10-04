"use client"
import Navbar from '@/components/Navbar';
import ProfileCard from '@/components/ProfileCard';
import React, { useState, useEffect } from 'react';
import { IoMdStarHalf } from "react-icons/io";
import { GoShareAndroid } from "react-icons/go";
import { FaArrowUpWideShort } from "react-icons/fa6";
import { FcLike } from "react-icons/fc";
import { FcInvite } from "react-icons/fc";
import { AiOutlineHeart, AiOutlineShareAlt } from 'react-icons/ai';
const SocialFeed = () => {
    const mockPosts = [
        {
            id: 3,
            account: "Sabrina",
            username: "@rina22",
            video:"/1stsharefeed/video3.mp4",
            time: "10:13 AM",
            date: "Sep 26, 2024",
            love: "3",
            share: "1"
        },
        {
            id: 1,
            img:"/avater/farhana.jpg",
            account: "Ms.Israt",
            username: "@israt128",
            video:"/1stsharefeed/video2.mp4",
            content: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.",
            time: "10:48 PM",
            date: "Sep 21, 2024",
            love: "5.6k",
            share: "2.4k"
        },
        {
            id: 2,
            img:"/formal.jpg",
            account: "Mr Sam",
            username: "@sam880",
            video:"/1stsharefeed/video1.mp4",
            content: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.",
            time: "9:32 PM",
            date: "Sep 15, 2024",
            love: "2.3k",
            share: "1.8k"
        },
        {
            id: 3,
            account: "Sabrina",
            username: "@rina22",
            video:"/1stsharefeed/video3.mp4",
            time: "10:13 AM",
            date: "Sep 26, 2024",
            love: "3.1k",
            share: "1.1k"
        },
        {
            id: 4,
            account: "Account 2",
            username: "@usertwo",
            content: "Sed diam nonummy nibh euismod tincidunt ut laoreet dolore.",
            time: "10:00 AM",
            date: "Mar 15, 2022",
            love: "0",
            share: "0"
        }
    ];
    
    const [posts, setPosts] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {

        setPosts(mockPosts);
    }, []);
    const handleShare = () => {
        console.log('Share button clicked');  // Check if this logs in the console
        const shareText = `I just completed Puzzle game! Check it out!`;
        if (navigator.share) {
          navigator.share({
            title: 'Check out this post!',
            text: shareText,
            url: window.location.href,
          })
            .then(() => console.log('Successfully shared'))
            .catch((error) => console.log('Error sharing', error));
        } else {
          alert('Sharing is not supported on this browser. Copy the link to share: ' + window.location.href);
        }
      };
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
              <div key={post.id} className="post-card bg-gradient-to-r from-blue-100 to-rose-100 border border-cyan-800 p-4 mb-3 rounded-xl shadow-md border">

                <div className="flex items-center mb-2">
                <div className="rounded-full bg-gray-300 w-10 h-10 mr-2"><img src={post.img} alt="" className='rounded-full'/></div>
                  <div>
                    <h4 className="font-bold">{post.account}</h4>
                    <p className="text-sm text-gray-600">{post.username}</p>
                  </div>
                </div>

                <video controls className='rounded-lg mt-3' src={post.video}></video>
                <div className="text-sm text-gray-800 mt-2">
                  <span>{post.time}</span> • <span>{post.date}</span>
                </div>


                <div className="flex justify-between items-center mt-3">
                  <button className="flex items-center  text-red-600 hover:text-red-700">
                  
                    <AiOutlineHeart size={20} className="mt-1 mx-1 " /> <span className='text-xl'>{post.love || ' '}</span>

                  </button>
                  <button className="flex items-center text-blue-500 hover:text-blue-700" onClick={handleShare}>
                    <FcInvite  size={20} className="mt-1 mx-1 text-blue-700 "  /> <span className='text-xl'>{post.share || ' '}</span>
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
