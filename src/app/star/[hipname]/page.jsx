"use client";
import { useEffect, useState, useRef } from "react";
import starDataJson from "@/components/nasa_json/nasaStarsData.json";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import WaveSurfer from "wavesurfer.js";
import { IoIosExpand, IoIosPlay, IoIosPause } from "react-icons/io";
import { IoClose } from "react-icons/io5";

const StarPage = () => {
  const BackgroundMusic = "/southRing.mp4";
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
  
      waveSurferRef.current.load("/scal-1.mp3");
  
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

  return (
    <>
      <Navbar />
      <div className="h-80 w-full flex flex-col justify-between p-5 ">
        {starData ? (
          <>
            <div className="flex justify-between flex-1 w-full gap-5">
              <div className="flex-1 pr-5 mt-14 ">
                <video controls autoPlay loop className="w-full rounded-lg">
                  <source src={BackgroundMusic} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>

                <div className="text-white bg-black bg-opacity-70 p-4 rounded-lg mt-4">
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
                <img
                  src={svgImage}
                  alt="Star"
                  className="max-w-full  rounded-lg max-h-[70vh] cursor-pointer shadow-lg"
                />
                <button
                  onClick={expandImage}
                  className="absolute top-16 right-3 bg-black bg-opacity-50 text-white rounded-full p-2"
                >
                  <IoIosExpand size={24} />
                </button>
                {isExpanded && (
                  <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center">
                    <img
                      src={svgImage}
                      alt="Expanded Star"
                      className="max-w-[90%] max-h-[90%]"
                    />
                    <button
                      onClick={closeImage}
                      className="absolute top-5 right-5 bg-red-500 text-white rounded-full p-2"
                    >
                      <IoClose size={24} />
                    </button>
                  </div>
                )}
              </div>
              <div className="flex-1 text-center mt-10 h-80 gap-2">
                <div className="border border-red-500 h-3/4 mb-5 p-1">
                <img
                  src="/quizpage.png"
                  alt="Image 1"
                  className="w-full rounded-lg object-fill h-5/6 shadow-lg "
                />
                <button className="px-4 w-full py-1 bg-pink-600 rounded-md mt-1"><a href="/">Quiz</a></button>
                </div>
               
                <div className="border border-red-500 h-3/4 mt-5 p-1">
                <img
                  src="/quizpage.png"
                  alt="Image 1"
                  className="w-full rounded-lg object-fill h-5/6 shadow-lg "
                />
                <button className="px-4 w-full py-1 bg-pink-600 rounded-md mt-1"><a href="/">Quiz</a></button>
                </div>
               
               
                
              </div>
            </div>
            <footer className="w-full fixed bottom-0 -z-10 p-1 px-10 bg-black bg-opacity-70 flex justify-between items-center flex-wrap">
              <div ref={waveformRef} className="flex-1 h-10 rounded-lg w-full bg-gradient-to-r from-green-400 to-purple-600"></div>
              <div className="flex gap-3 mx-5 text-white ">
                <button onClick={togglePlayPause}>
                  {isPlaying ? <IoIosPause size={24} /> : <IoIosPlay size={24} />}
                </button>
                <Link href="/soundcompose">
                  <button className="px-4 py-2 p-2 text-white bg-pink-600 rounded-md">
                 Go to Composer
                  </button>
                </Link>
              </div>
            </footer>
          </>
        ) : (
          <p>No star data found for HIP Name: {hipName}</p>
        )}
      </div>
    </>
  );
};

export default StarPage;
