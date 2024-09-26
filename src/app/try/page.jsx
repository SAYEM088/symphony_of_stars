"use client";
import React, { useEffect, useState } from "react";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg"; // Correct import

const VideoCreator = () => {
  const [ffmpeg, setFFmpeg] = useState(null);
  const [ready, setReady] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [audioFile, setAudioFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const loadFFmpeg = async () => {
      const ffmpegInstance = createFFmpeg({
        log: true, // Enable logging for debugging
        progress: ({ ratio }) => setProgress(ratio),
      });
      await ffmpegInstance.load();
      setFFmpeg(ffmpegInstance);
      setReady(true);
    };

    loadFFmpeg();
  }, []);

  const handleImageChange = (event) => {
    if (event.target.files) {
      setImageFiles(Array.from(event.target.files));
      console.log("Selected images:", event.target.files);
    }
  };

  const handleAudioChange = (event) => {
    if (event.target.files) {
      setAudioFile(event.target.files[0]);
      console.log("Selected audio:", event.target.files[0]);
    }
  };

  const createVideo = async () => {
    if (!imageFiles.length || !audioFile) {
      alert("Please upload both images and audio.");
      return;
    }
  
    setIsProcessing(true);
    try {
      const audio = await fetchFile(audioFile);
      const image = await fetchFile(imageFiles[0]); // Use the first image only
  
      // Write files to FFmpeg's virtual filesystem
      await ffmpeg.FS("writeFile", "image.png", image);
      await ffmpeg.FS("writeFile", "audio.mp3", audio);
  
      console.log("All files written to FFmpeg FS. Starting video creation...");
  
      // FFmpeg command to create video
      await ffmpeg.run(
        "-loop",
        "1",                // Loop the image
        "-i",
        "image.png",       // Input image
        "-i",
        "audio.mp3",       // Input audio
        "-c:v",
        "libx264",         // Video codec
        "-c:a",
        "aac",             // Audio codec
        "-b:a",
        "192k",            // Audio bitrate
        "-shortest",       // Finish when the audio ends
        "-pix_fmt",
        "yuv420p",         // Pixel format
        "-y",
        "output.mp4"       // Output file
      );
  
      // Read the output video file
      const data = ffmpeg.FS("readFile", "output.mp4");
      const blob = new Blob([data.buffer], { type: "video/mp4" });
  
      console.log("Blob size:", blob.size); // Log blob size
      if (blob.size > 0) {
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
      } else {
        alert("Video creation failed. Blob size is 0.");
      }
    } catch (error) {
      console.error("Error creating video:", error);
      alert("There was an error while creating the video. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };
  
  

  return (
    <div className="p-5">
      <h2 className="text-2xl mb-4">Create a Video from Images and Audio</h2>

      <label htmlFor="imageUpload" className="block mb-3">
        Upload Images:
        <input
          type="file"
          id="imageUpload"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="block mt-2"
        />
      </label>

      <label htmlFor="audioUpload" className="block mb-3">
        Upload Audio:
        <input
          type="file"
          id="audioUpload"
          accept="audio/*"
          onChange={handleAudioChange}
          className="block mt-2"
        />
      </label>

      <button
        onClick={createVideo}
        disabled={!ready || isProcessing}
        className={`px-4 py-2 mt-4 rounded-lg ${
          ready ? "bg-blue-500 text-white" : "bg-gray-400 text-gray-100 cursor-not-allowed"
        }`}
      >
        {isProcessing ? "Processing..." : "Create Video"}
      </button>

      {isProcessing && (
        <div className="mt-4">
          <h4>Processing... {Math.round(progress * 100)}%</h4>
          <div className="w-full bg-gray-300 h-2 rounded-md">
            <div
              className="bg-green-500 h-2 rounded-md"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>
      )}

      {videoUrl && (
        <div className="mt-6">
          <h3 className="text-xl mb-2">Your Video:</h3>
          <video src={videoUrl} controls width="500" className="border rounded-lg shadow-lg" />
          <a href={videoUrl} download="output.mp4" className="block mt-2 text-blue-500">
            Download Video
          </a>
        </div>
      )}
    </div>
  );
};

export default VideoCreator;
