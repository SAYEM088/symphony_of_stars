
import { IoMdStarHalf } from "react-icons/io";
import { GoShareAndroid } from "react-icons/go";
import { FaArrowUpWideShort } from "react-icons/fa6";
import { FcLike } from "react-icons/fc";
const ProfileCard = () => {
  return (
    <div className="w-full bg-gradient-to-r from-teal-800  to-amber-700 bg-opacity-80 rounded-lg shadow-lg p-1">
      <div className="flex">
        <div className="pt-2 ps-2">
        <img
              src="/formal.jpg"
              alt="profile"
              style={{height:"3.2rem",width:"3.2rem"}}
              className="object-cover rounded px-1"
            />
          <p className="text-pink-200 text-xl ps-1">sam</p>
        </div>
        <div className="flex justify-end ms-auto">
        <div className="">
                <IoMdStarHalf size={40} className="bg-gradient-to-r from-cyan-300  to-orange-400 text-yellow-200 mx-1 rounded-full p-1 " /> 
                <div className="flex text-pink-100 items-center justify-center" ><p className='text-xl '>6</p><FaArrowUpWideShort  size={8}/></div>
        </div>
        <div className="">
                <GoShareAndroid size={40} className="bg-gradient-to-r from-cyan-200  to-orange-300 text-cyan-800 mx-1 rounded-full p-2" /> 
                <div className="flex text-pink-100 items-center justify-center" ><p className='text-xl'>50</p><FaArrowUpWideShort  size={8}/></div>
        </div>
        <div className="">
                <FcLike size={40} className="bg-gradient-to-r from-cyan-200  to-orange-300 text-red-800 mx-1 rounded-full p-2" /> 
                <div className="flex text-pink-100 items-center justify-center" ><p className='text-xl'>246</p><FaArrowUpWideShort  size={8}/></div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
