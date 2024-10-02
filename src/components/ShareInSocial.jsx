import React, { useState, useEffect } from 'react';
import { AiOutlineHeart, AiOutlineShareAlt } from 'react-icons/ai';
import { MdOutlineCloseFullscreen } from "react-icons/md";
import { MdOutlineOpenInFull } from "react-icons/md";
import ProfileCard from './ProfileCard';
const ShareInSocial = () => {

  const mockPosts = [
    {
      id: 1,
      img:"/avater/farhana.jpg",
      account: "Ms.Israt",
      username: "@israt128",
      video:"/1stsharefeed/video2.mp4",
      content: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.",
      time: "10:48 PM",
      date: "Sep 21, 2024"
      
    },
    {
      id: 2,
      img:"/formal.jpg",
      account: "Mr Sam",
      username: "@sam880",
      video:"/1stsharefeed/video1.mp4",
      content: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.",
      time: "9:30 PM",
      date: "Sep 15, 2024"
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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
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
    <div className={`flex p-4 ${sidebarOpen ? 'w-4/6' : 'w-3/6'} transition-all duration-300`}>
      <div className="news-feed-container max-w-full md:max-w-2xl h-full overflow-hidden bg-gradient-to-r from-orange-300 to-cyan-500 pt-1 px-3 pb-2 rounded">
        <div className="flex justify-between items-center mb-4">
          <a href='/socialfeed' className="text-xl font-bold text-pink-900 ps-1">Share Feed</a>
          <button onClick={toggleSidebar} className="bg-gradient-to-r from-cyan-200  to-orange-300 text-red-800 rounded-full p-1">
            {sidebarOpen ? <MdOutlineCloseFullscreen /> : <MdOutlineOpenInFull />}
          </button>
        </div>
        <div className="mb-1">
          <ProfileCard />
        </div>


        <div className="posts-feed  overflow-hidden">
          <div className="overflow-y-auto h-96 no-scrollbar">
            {posts.map(post => (
              <div key={post.id} className="post-card bg-gradient-to-r from-pink-100 to-rose-100 border border-cyan-800 p-4 mb-3 rounded-xl shadow-md border">

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
                    <AiOutlineHeart className="mr-1" /> Love
                  </button>
                  <button className="flex items-center text-blue-500 hover:text-blue-700" onClick={handleShare}>
                    <AiOutlineShareAlt className="mr-1" /> Share
                  </button>

                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
       /* Hide the scrollbar while still enabling scroll functionality */
      .no-scrollbar::-webkit-scrollbar {
        display: none;
      }
        .no-scrollbar {
       -ms-overflow-style: none;  /* Internet Explorer 10+ */
       scrollbar-width: none;  /* Firefox */
        }

      `}</style>
    </div>
  );
};

export default ShareInSocial;
