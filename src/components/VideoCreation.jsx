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
        progress: ({ ratio }) => setProgress(ratio),
      });
      await ffmpegInstance.load();
      setFFmpeg(ffmpegInstance);
      setReady(true);
    };

    loadFFmpeg();
  }, []);

  const handleSoundUpload = (event) => {
    setSoundFile(event.target.files[0]);
    setIsSoundSelected(true);
    initWaveSurfer(event.target.files[0]);
  };

  const initWaveSurfer = (file) => {
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
      const audio = await fetchFile(soundFile);
      const imagePath = starData?.image || "/starinfo/carina.png"; // Fallback image
      const image = await fetchFile(imagePath);

      await ffmpeg.FS("writeFile", "image.png", image);
      await ffmpeg.FS("writeFile", "audio.mp3", audio);

      // Create video with soundwave overlay
      await ffmpeg.run(
        "-loop", "1", // Loop the image
        "-i", "image.png", // Input image
        "-i", "audio.mp3", // Input audio
        "-filter_complex",
        "[1:a]showwaves=s=480x320:mode=line:rate=15,format=yuv420p[v]", // Soundwave effect with lower resolution and frame rate
        "-map", "0:v", // Map video (image)
        "-map", "[v]", // Map the soundwave
        "-map", "1:a", // Map the audio
        "-c:v", "libx264", // Video codec
        "-b:v", "600k", // Lower video bitrate
        "-c:a", "aac", // Audio codec
        "-b:a", "128k", // Lower audio bitrate
        "-shortest", // Finish when the audio ends
        "-pix_fmt", "yuv420p", // Pixel format
        "-y", "output.mp4" // Output file
      );

      const videoData = ffmpeg.FS("readFile", "output.mp4");
      const videoBlob = new Blob([videoData.buffer], { type: "video/mp4" });
      const videoUrl = URL.createObjectURL(videoBlob);
      
      // Check video size
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
    <div className="p-5">
      <h2 className="text-2xl mb-4">Create a Video with Star Data</h2>

      {videoUrl ? (
        <div className="mt-6">
          <video src={videoUrl} controls width="500" className="border rounded-lg shadow-lg" />
          <div className="mt-2">
            <a href={videoUrl} download="output.mp4" className="block text-blue-500">
              Download Video
            </a>
            <button className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg">
              Share
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="h-72 w-80 bg-gradient-to-r from-pink-300 to-sky-300 rounded-lg flex items-center justify-center text-center">
            <img
              src={starData?.image || "/starinfo/carina.png"}
              alt="Star Data"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          <input id="soundInput" type="file" accept="audio/*" className="mt-4" onChange={handleSoundUpload} />

          {isSoundSelected && (
            <div className="mt-4">
              <div id="waveform" className="mt-2"></div> {/* WaveSurfer.js soundwave visualization */}
              <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg" onClick={createVideo} disabled={!ready || isProcessing}>
                {isProcessing ? `Processing... ${Math.round(progress * 100)}%` : "Create Video"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CreateVideo;
