"use client";
import { useEffect, useState, useRef } from "react";
import starDataJson from "@/components/nasa_json/nasaStarsData.json";
import Navbar from "@/components/Navbar";
import WaveSurfer from "wavesurfer.js";
import { IoIosExpand, IoIosPlay, IoIosPause } from "react-icons/io";
import { IoClose } from "react-icons/io5";
const StarPage = () => {
  const imageBG = '/bg2.png'
  const [hipName, setHipName] = useState("");
  const [starData, setStarData] = useState(null);
  const [svgImage, setSvgImage] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const waveSurferRef = useRef(null);
  const waveformRef = useRef(null);

  useEffect(() => {
    const url = window.location.href;
    const urlParts = url.split("/star/");
    const hipNamePart = decodeURIComponent(urlParts[1]);
    setHipName(hipNamePart.trim());
    const data = starDataJson.find(
      (star) => star.hip_name === hipNamePart.trim()
    );
    setStarData(data);

    if (data) {
      setSvgImage(data.img);
    }
  }, [hipName]);

  useEffect(() => {
    if (starData && waveformRef.current) {
      waveSurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "violet",
        progressColor: 'purple',
        cursorColor: 'navy',
        barWidth: 2,
        barRadius: 3,
        responsive: true,
        height: 40,
        normalize: true,
        backend: 'MediaElement',
      });

      waveSurferRef.current.load("/starinfo/Carina.wav");

      return () => {
        if (waveSurferRef.current) {
          waveSurferRef.current.destroy();
        }
      };
    }
  }, [starData, waveformRef]);

  const togglePlayPause = () => {
    if (waveSurferRef.current) {
      if (isPlaying) {
        waveSurferRef.current.pause();
      } else {
        waveSurferRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  const expandImage = () => setIsExpanded(true);
  const closeImage = () => setIsExpanded(false);
  const starimage='/starinfo/carina.png'
  return (
    <div className="bg-center h-screen  bg-cover" style={{ backgroundImage: "url('/starbg.jpeg')" }}>
      <Navbar />
      <div className="h-80 w-full flex flex-col justify-between p-5 ">
        {starData ? (
          <>
            <div className="flex justify-between flex-1 w-full gap-5">
              <div className="flex-1 pr-5 mt-14 min-h ">
                <div className="flex justify-center">
                  {/* this video also come from starData.video */}

                  {starData.video ? (
                    <video controls className="h-72 w-80 m-auto rounded-lg">
                      <source src={data.video} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <button className="h-72 w-80 bg-gradient-to-r from-pink-300 to-sky-300  rounded-lg"> <a href="/video"> Lets Make Video with your sound</a></button>
                  )}


                </div>



                <div className="text-violet-950 w-80 m-auto border-2 border-white  bg-gradient-to-r from-pink-300 to-sky-300 bg-opacity-20 p-4 rounded-lg mt-4">
                  <h2>Star Information:</h2>
                  <p>
                    <strong>Designation:</strong> {starData.star_name}
                  </p>
                  <p>
                    <strong>Gliese-Jahreiß catalog:</strong> {starData.gj_name}
                  </p>
                  <p>
                    <strong>RA (hours):</strong> {starData.RA_hour}' {starData.ra}
                  </p>
                  <p>
                    <strong>Dec (degrees):</strong> {starData.dec}
                  </p>
                  <p>
                    <strong>HIP Name:</strong> {starData.hip_name}
                  </p>
                </div>
              </div>
              <div className="relative flex-2 pt-14 text-center">
                {/* this img also come from starData.img */}
                <img
                  src={"/starinfo/carina.png"}
                  alt="Star"
                  className="max-w-full  rounded-lg max-h-[60vh] cursor-pointer shadow-lg"
                />
                <button
                  onClick={expandImage}
                  className="absolute top-16 right-3 bg-gradient-to-r from-cyan-200  border-2 border-white to-orange-300 text-red-800 bg-opacity-50  rounded-full p-1"
                >
                  <IoIosExpand size={24} />
                </button>
                {isExpanded && (
                  <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center">
                    <img
                      src={"/starinfo/carina.png"}
                      alt="Expanded Star"
                      className="max-w-[90%] max-h-[90%]"
                    />
                    <button
                      onClick={closeImage}
                      className="absolute top-5 right-5  bg-gradient-to-r from-cyan-200  border-2 border-white to-orange-300 text-red-800 bg-opacity-50  rounded-full p-2"
                    >
                      <IoClose size={24} />
                    </button>
                  </div>
                )}
              </div>
              <div className="flex-1  text-center mt-12 h-80 gap-2">
                <div className="w-80 m-auto border-2 border-white h-3/4 mb-5 p-1 bg-gradient-to-r from-pink-300 to-sky-300 rounded-lg">
                  <img
                    src="/starinfo/quizpage.png"
                    alt="Image 1"
                    className="w-full rounded-lg object-fill h-5/6 shadow-lg "
                  />
                  <button className="px-4 w-full  text-xl py-1 text-violet-950  bg-gradient-to-r from-red-600 to-cyan-400 rounded-md mt-1"><a href="/">Quiz</a></button>
                </div>

                <div className=" w-80 m-auto border-2 border-white h-3/4 mb-5 p-1 bg-gradient-to-r from-pink-300 to-sky-300 rounded-lg">
                  <img
                    src="/starinfo/soundmatch.png"
                    alt="Image 1"
                    className="w-full rounded-lg object-fill h-5/6 shadow-lg "
                  />
                  <button className="px-4 w-full  text-xl py-1 text-violet-950  bg-gradient-to-r from-red-600 to-cyan-400 rounded-md mt-1"><a href="/">match</a></button>
                </div>
              </div>
            </div>
            <footer className="w-full fixed bottom-0 left-0 rounded-lg z-10 py-2 px-10 bg-gradient-to-r from-blue-400 to-red-300 bg-opacity-70 flex justify-between items-center flex-wrap">
               {/* this sound also come from starData.sound */}
               <div ref={waveformRef} className="flex-1 h-10 border border-2 border-white rounded-lg w-full bg-gradient-to-r from-green-400 to-purple-600"></div>
              <div className="flex gap-3 mx-5 text-white ">
                <button className="bg-gradient-to-r from-cyan-200  border-2 border-white to-orange-300 text-red-800 p-2  rounded-full" onClick={togglePlayPause}>
                  {isPlaying ? <IoIosPause c size={24} /> : <IoIosPlay size={24} />}
                </button>
                <a href="/soundcompose">
                  <button className="px-4 py-1 text-xl p-2 text-pink-200  border-2 border-white bg-gradient-to-r from-cyan-400 to-red-600 rounded-md">
                    Go to Composer
                  </button>
                </a>
              </div>
            </footer>
          </>
        ) : (
          <p className="text-center">No star data found for HIP Name: {hipName}</p>
        )}
      </div>
    </div>
  );
};

export default StarPage;
