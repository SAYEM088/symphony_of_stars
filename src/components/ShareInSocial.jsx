import React, { useState, useEffect } from 'react';
import { AiOutlineHeart, AiOutlineShareAlt } from 'react-icons/ai';
import { MdOutlineCloseFullscreen } from "react-icons/md";
import { MdOutlineOpenInFull } from "react-icons/md";
const ShareInSocial = () => {

  const mockPosts = [
    {
      id: 1,
      account: "Account 1",
      username: "@userone",
      content: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.",
      tag: "#FirstTag",
      time: "9:30 PM",
      date: "Feb 5, 2022"
    },
    {
      id: 2,
      account: "Account 2",
      username: "@usertwo",
      content: "Sed diam nonummy nibh euismod tincidunt ut laoreet dolore.",
      tag: "#SecondTag",
      time: "10:00 AM",
      date: "Mar 15, 2022"
    },
    {
      id: 3,
      account: "Account 1",
      username: "@userone",
      content: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.",
      tag: "#FirstTag",
      time: "9:30 PM",
      date: "Feb 5, 2022"
    },
    {
      id: 4,
      account: "Account 2",
      username: "@usertwo",
      content: "Sed diam nonummy nibh euismod tincidunt ut laoreet dolore.",
      tag: "#SecondTag",
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

  return (
    <div className={`flex p-4 ${sidebarOpen ? 'w-4/6' : 'w-3/6'} transition-all duration-300`}>
      <div className="news-feed-container max-w-full md:max-w-2xl h-3/4 overflow-hidden bg-green-600 pt-11 px-3 pb-2 rounded">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Share Feed</h2>
          <button onClick={toggleSidebar} className="text-white hover:text-white">
            {sidebarOpen ? <MdOutlineCloseFullscreen /> : <MdOutlineOpenInFull />}
          </button>
        </div>


        <div className="posts-feed overflow-hidden">
          <div className="overflow-y-auto h-96 no-scrollbar">
            {posts.map(post => (
              <div key={post.id} className="post-card bg-white p-4 mb-4 rounded-lg shadow-md border">

                <div className="flex items-center mb-2">
                  <div className="rounded-full bg-gray-300 w-10 h-10 mr-2"></div>
                  <div>
                    <h4 className="font-bold">{post.account}</h4>
                    <p className="text-sm text-gray-600">{post.username}</p>
                  </div>
                </div>


                <p className="text-lg mb-2">{post.content}</p>


                <p className="text-blue-500 font-bold">{post.tag}</p>


                <div className="text-sm text-gray-500 mt-2">
                  <span>{post.time}</span> • <span>{post.date}</span>
                </div>


                <div className="flex justify-between items-center mt-3">
                  <button className="flex items-center text-red-500 hover:text-red-700">
                    <AiOutlineHeart className="mr-1" /> Love
                  </button>
                  <button className="flex items-center text-blue-500 hover:text-blue-700">
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
