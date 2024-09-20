import { FaFacebook, FaTwitter, FaYoutube } from 'react-icons/fa';
import { IoMdStarHalf } from "react-icons/io";
import { IoShareSharp  } from "react-icons/io5";
import { FaArrowUpWideShort } from "react-icons/fa6";
import { FcLike } from "react-icons/fc";
const ProfileCard = () => {
  return (
    <div className="w-full bg-cyan-600 bg-opacity-80 rounded-lg shadow-lg p-1">
      <div className="grid grid-cols-7 gap-4">
        
        {/* Left Section: Profile Picture (3 grid columns) */}
        <div className="col-span-3 w-full h-full ms-2 mt-4 flex flex-col items-center justify-center text-white">
          <div className="rounded overflow-hidden">
            <img
              src="https://via.placeholder.com/150"
              alt="profile"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-l mt-1 mb-2">SAM</p>
        </div>

        <div className="col-span-4 p-6 flex flex-col justify-between">
          <h2 className="text-2xl font-semibold text-white mb-4">Jamesians</h2>

          <div className="flex">
            <div className="grid grid-cols-7 gap-2 w-full">
            
              <div className="col-span-2">
                <IoMdStarHalf size={48} className="text-red-500" /> 
                <div className="flex mt-2  items-center justify-center" ><p className='text-xl'>500</p><FaArrowUpWideShort  size={8}/></div>
                
              </div>
              <div className="col-span-2">

                <IoShareSharp  size={48} className="text-red-500" /> 
                <div className="flex mt-2  items-center justify-center" ><p className='text-xl'>500</p><FaArrowUpWideShort  size={8}/></div>
              </div>
              <div className="col-span-2">
                <FcLike size={48} className="text-red-500" /> 
                <div className="flex mt-2  items-center justify-center" ><p className='text-xl'>500</p><FaArrowUpWideShort  size={8}/></div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center space-x-4">
            <a href="#" className="text-blue-600 hover:text-blue-800">
              <FaFacebook size={24} />
            </a>
            <a href="#" className="text-blue-400 hover:text-blue-600">
              <FaTwitter size={24} />
            </a>
            <a href="#" className="text-red-500 hover:text-red-700">
              <FaYoutube size={24} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
