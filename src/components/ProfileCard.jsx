
import { IoMdStarHalf } from "react-icons/io";
import { IoShareSharp  } from "react-icons/io5";
import { FaArrowUpWideShort } from "react-icons/fa6";
import { FcLike } from "react-icons/fc";
const ProfileCard = () => {
  return (
    <div className="w-full bg-cyan-600 bg-opacity-80 rounded-lg shadow-lg p-1">
      <div className="flex">
        <div className="pt-2">
        <img
              src="/formal.jpg"
              alt="profile"
              style={{height:"2.2rem",width:"2.2rem"}}
              className="object-cover rounded"
            />
          <p>sam</p>
        </div>
        <div className="flex justify-end ms-auto">
        <div className="">
                <IoMdStarHalf size={40} className="text-red-500" /> 
                <div className="flex  items-center justify-center" ><p className='text-bold'>500</p><FaArrowUpWideShort  size={8}/></div>
        </div>
        <div className="">
                <IoShareSharp size={40} className="text-red-500" /> 
                <div className="flex  items-center justify-center" ><p className='text-bold'>500</p><FaArrowUpWideShort  size={8}/></div>
        </div>
        <div className="">
                <FcLike size={40} className="text-red-500" /> 
                <div className="flex  items-center justify-center" ><p className='text-bold'>500</p><FaArrowUpWideShort  size={8}/></div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
