"use client";
import React, { useEffect, useState } from "react";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const VideoCreation = ({ promps }) => {
  const [ffmpeg, setFFmpeg] = useState(null);
  const [ready, setReady] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [countdown, setCountdown] = useState(5); // Countdown before starting the process

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

  useEffect(() => {
    if (countdown > 0 && ready) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && ready) {
      createVideo();
    }
  }, [countdown, ready]);

  const createVideo = async () => {
    setIsProcessing(true);
    try {
      const audio = await fetchFile(promps.audio);
      const image = await fetchFile(promps.image);

      // Write files to FFmpeg's virtual filesystem
      await ffmpeg.FS("writeFile", "image.png", image);
      await ffmpeg.FS("writeFile", "audio.mp3", audio);

      // FFmpeg command to create video
      await ffmpeg.run(
        "-loop", "1",                // Loop the image
        "-i", "image.png",           // Input image
        "-i", "audio.mp3",           // Input audio
        "-c:v", "libx264",           // Video codec
        "-c:a", "aac",               // Audio codec
        "-b:a", "192k",              // Audio bitrate
        "-shortest",                 // Finish when the audio ends
        "-pix_fmt", "yuv420p",       // Pixel format
        "-y", "output.mp4"           // Output file
      );

      // Read the output video file
      const videoData = ffmpeg.FS("readFile", "output.mp4");
      const videoBlob = new Blob([videoData.buffer], { type: "video/mp4" });
      const videoUrl = URL.createObjectURL(videoBlob);
      setVideoUrl(videoUrl);

      // Optionally, create an audio-only file
      const audioBlob = new Blob([audio], { type: "audio/mp3" });
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl);
    } catch (error) {
      console.error("Error creating video:", error);
      alert("There was an error while creating the video. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-5">
      <h2 className="text-2xl mb-4">Create a Video from Promps</h2>

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

      {!isProcessing && countdown > 0 && (
        <div className="mt-4 text-xl">
          Starting in... {countdown} seconds
        </div>
      )}

      {videoUrl && (
        <div className="mt-6">
          <h3 className="text-xl mb-2">Your Video:</h3>
          <video src={videoUrl} controls width="500" className="border rounded-lg shadow-lg" />
          <div className="mt-2">
            <a href={videoUrl} download="output.mp4" className="block text-blue-500">
              Download Video
            </a>
            <a href={audioUrl} download="output.mp3" className="block text-blue-500">
              Download Audio
            </a>
            <button className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg">
              Share
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCreation;
