 "use client"
import { useEffect, useState, useRef } from "react";
import starDataJson from "@/components/data/starsData.json";
import Link from 'next/link'; // Import Link

const Page = () => {
  const BackgroundMusic = "/m2.wav";
  const [magnitude, setMagnitude] = useState("");
  const [starData, setStarData] = useState(null);
  const [svgImage, setSvgImage] = useState("");
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const url = window.location.href;
    const parts = url.split("/");
    const magnitudePart = parts[parts.length - 1];
    setMagnitude(magnitudePart);

    const data = starDataJson.find(
      (star) => star.magnitude.toString() === magnitudePart
    );
    setStarData(data);

    if (data) {
      if (data.imgSVG === 1) {
        setSvgImage("/p1.svg");
      } else if (data.imgSVG === 2) {
        setSvgImage("/p2.svg");
      } else if (data.imgSVG === 3) {
        setSvgImage("/p3.svg");
      }
    }
  }, [magnitude]);

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div
      ref={containerRef}
      style={{
        backgroundImage: `url(${svgImage})`,
        backgroundSize: `${scale * 100}%`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <audio
        src={BackgroundMusic}
        autoPlay
        loop
        controls
        className="absolute top-5 right-5 w-full max-w-xs"
      >
        Your browser does not support the audio element.
      </audio>

      <div
        className="transition-all duration-300 ease-in-out h-16 hover:h-64"
        style={{
          position: "fixed",
          bottom: 0,
          width: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          color: "white",
          padding: "5px",
          textAlign: "center",
          zIndex: 1,
          overflow: "hidden",
        }}
      >
        {starData ? (
          <div className="h-full flex justify-center items-start space-x-8">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
              <h2 className="text-lg font-semibold mb-2">Star Details:</h2>
              <p><strong>Designation:</strong> {starData.designation}</p>
              <p><strong>Constellation:</strong> {starData.constellation}</p>
              <p><strong>RA (hours):</strong> {starData.RA_hour}' {starData.RA_min}</p>
              <p><strong>Dec (degrees):</strong> {starData.dec_deg}</p>
              <p><strong>Magnitude:</strong> {starData.magnitude}</p>
              <button
                type="button"
                className="mt-4 px-4 py-2 bg-blue-400 text-white font-medium rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
              >
                More
              </button>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
              <div className="flex flex-col space-y-4">
                <Link href="/draw">
                  <button
                    type="button"
                    className="p-5 bg-red-400 text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
                  >
                    Draw
                  </button>
                </Link>
                <Link href="/play">
                  <button
                    type="button"
                    className="p-5 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-100"
                  >
                    Play
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <p>No star data found for magnitude {magnitude}</p>
        )}
      </div>
    </div>
  );
};

export default Page;
