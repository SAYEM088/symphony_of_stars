"use client";
import React, { useEffect, useState, useRef } from "react";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import WaveSurfer from "wavesurfer.js";

const CreateVideo = ({ starData }) => {
  const [ffmpeg, setFFmpeg] = useState(null);
  const [ready, setReady] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [soundFile, setSoundFile] = useState(null);
  const [isSoundSelected, setIsSoundSelected] = useState(false);
  const waveSurferRef = useRef(null);

  useEffect(() => {
    const loadFFmpeg = async () => {
      const ffmpegInstance = createFFmpeg({
        log: true,
        progress: ({ ratio }) => {
          if (ratio) {
            setProgress(ratio);
          }
        },
      });
      await ffmpegInstance.load();
      setFFmpeg(ffmpegInstance);
      setReady(true);
    };

    loadFFmpeg();
  }, []);

  const handleSoundUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSoundFile(file);
      setIsSoundSelected(true);
      initWaveSurfer(file);
    }
  };

  const initWaveSurfer = (file) => {
    // Destroy existing WaveSurfer instance if it exists
    if (waveSurferRef.current) {
      waveSurferRef.current.destroy();
    }

    waveSurferRef.current = WaveSurfer.create({
      container: "#waveform",
      waveColor: "violet",
      progressColor: "purple",
    });

    const reader = new FileReader();
    reader.onload = function () {
      waveSurferRef.current.loadBlob(new Blob([reader.result]));
    };
    reader.readAsArrayBuffer(file);
  };

  const createVideo = async () => {
    setIsProcessing(true);
    try {
      console.log("Preparing to fetch files...");

      const audio = await fetchFile(soundFile);
      const imagePath = "/backdrop/drawing.png"; //  starData?.image ||
      const image = await fetchFile(imagePath);

      console.log("Image and audio fetched successfully");

      await ffmpeg.FS("writeFile", "image.png", image);
      await ffmpeg.FS("writeFile", "audio.mp3", audio);

      console.log("Files written to FFmpeg FS");

      // Create video with soundwave overlay
      await ffmpeg.run(
        "-loop", "1",
        "-i", "image.png",
        "-i", "audio.mp3",
        "-filter_complex", "[1:a]showwaves=s=480x320:mode=line:rate=15,format=yuv420p[v]",
        "-map", "0:v",
        "-map", "[v]",
        "-map", "1:a",
        "-c:v", "libx264",
        "-b:v", "600k",
        "-c:a", "aac",
        "-b:a", "128k",
        "-shortest",
        "-pix_fmt", "yuv420p",
        "-y", "output.mp4"
      );

      console.log("FFmpeg command executed");

      const videoData = ffmpeg.FS("readFile", "output.mp4");
      const videoBlob = new Blob([videoData.buffer], { type: "video/mp4" });
      const videoUrl = URL.createObjectURL(videoBlob);

      console.log("Video generated successfully");

      const sizeInMB = videoBlob.size / (1024 * 1024);
      if (sizeInMB > 4) {
        alert("The video is larger than 4 MB. Please use a shorter audio file.");
      } else {
        setVideoUrl(videoUrl);
      }
    } catch (error) {
      console.error("Error creating video:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col justify-center mt-10 items-center bg-red">
      <h2 className="text-2xl text-pink-700 mb-4">Create The Video with Your Sound</h2>
      {videoUrl ? (
        <div className="mt-6">
          <video src={videoUrl} controls width="500" className="border rounded-lg shadow-lg" />
          <div className="mt-2 flex flex-col justify-center items-center">
            <div className="bg-gradient-to-r from-pink-300 to-sky-300 w-1/2 p-3 rounded"><a href={videoUrl} download="output.mp4" className="block text-center text-red">
              Download Video
            </a></div>
            <div className=" mt-4 bg-gradient-to-r from-teal-300 to-green-300 w-1/2  text-center rounded"><button className=" p-2 text-red rounded-lg">
              Share
            </button></div>
            
          </div>
        </div>
      ) : (
        <div>
          <div className="h-72 w-80 bg-gradient-to-r from-pink-300 to-sky-300 rounded-lg flex items-center justify-center text-center">
            <img
              src={starData?.image || "/backdrop/drawing.png"}
              alt="Star Data"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div className="mt-5 text-center">
            <label
              htmlFor="soundInput"
              className="cursor-pointer bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white font-bold p-3 rounded"
            >
              Choose File
            </label>
            <input
              id="soundInput"
              type="file"
              accept="audio/*"
              onChange={handleSoundUpload}
              className="hidden"
            />
          </div>

          {isSoundSelected && (
            <div className="mt-4">
              <div id="waveform" className="mt-2"></div> {/* WaveSurfer.js soundwave visualization */} 
              <div className="flex justify-center items-center">
              <button 
                className="mt-4  px-4 py-2 bg-gradient-to-r from-teal-500  to-cyan-400 text-white rounded-lg" 
                onClick={createVideo} 
                disabled={!ready || isProcessing}
              >
                {isProcessing ? `Processing... ${Math.round(progress * 100)}%` : "Create Video"}
              </button>
            </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CreateVideo;
