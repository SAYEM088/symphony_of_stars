"use client";
import Navbar from "@/components/Navbar";
import React, { useRef, useState, useEffect } from "react";
import {
  FaUndo,
  FaRedo,
  FaEraser,
  FaPaintBrush,
  FaSave,
  FaPalette,
} from "react-icons/fa";
import { HexColorPicker } from "react-colorful"; // New Color Picker

const DrawingBoard = () => {
  const canvasRef = useRef(null);
  const imageRef = useRef(null); // Reference for the image
  const [isDrawing, setIsDrawing] = useState(false);
  const [history, setHistory] = useState([]); // Save image states for undo
  const [redoStack, setRedoStack] = useState([]); // Redo stack for history
  const [isEraserActive, setIsEraserActive] = useState(false);
  const [showSaveGif, setShowSaveGif] = useState(false);
  const [currentColor, setCurrentColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);
  const [showColorPalette, setShowColorPalette] = useState(false);
  const [selectedImage, setSelectedImage] = useState("/pilar.png"); // Default image
  const [isSketchMode, setIsSketchMode] = useState(false); // Sketch mode state

  const startDrawing = (e) => {
    setIsDrawing(true);
    const ctx = canvasRef.current.getContext("2d");
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = brushSize;
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const ctx = canvasRef.current.getContext("2d");
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    saveHistory();
  };

  const saveHistory = () => {
    const dataURL = canvasRef.current.toDataURL();
    setHistory((prevHistory) => [...prevHistory, dataURL]);
    setRedoStack([]);
  };

  const handleSave = () => {
    const dataURL = canvasRef.current.toDataURL();
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "drawing.png";
    link.click();
    setShowSaveGif(true);
    const audio = new Audio("./m2.wav");
    audio.play();
    setTimeout(() => setShowSaveGif(false), 3000);
  };

  const handleUndo = () => {
    if (isSketchMode) {
      setSelectedImage("/pilar.png");
      setIsSketchMode(false);
    } else if (history.length > 0) {
      const newHistory = [...history];
      const lastDrawing = newHistory.pop();
      setRedoStack((prevRedo) => [...prevRedo, lastDrawing]);
      setHistory(newHistory);
      redraw(newHistory);
    }
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const newRedoStack = [...redoStack];
    const lastRedo = newRedoStack.pop();
    setHistory((prevHistory) => [...prevHistory, lastRedo]);
    setRedoStack(newRedoStack);
    redraw([...history, lastRedo]);
  };

  const redraw = (history) => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    history.forEach((dataURL) => {
      const img = new Image();
      img.src = dataURL;
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
      };
    });
  };

  const handleEraser = () => {
    setIsEraserActive(true);
  };

  const handleBrush = () => {
    setIsEraserActive(false);
  };

  const toggleColorPalette = () => {
    setShowColorPalette(!showColorPalette);
  };

  const handleColorChange = (color) => {
    setCurrentColor(color);
    setShowColorPalette(false); // Automatically close after choosing a color
  };

  const handleTipsClick = () => {
    if (isSketchMode) {
      setSelectedImage("/pilar.png");
      setIsSketchMode(false);
    } else {
      generateSketch();
    }
  };

  const generateSketch = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = imageRef.current;

    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0, img.width, img.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const brightness =
        0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
      data[i] = data[i + 1] = data[i + 2] = brightness < 128 ? 0 : 255;
    }

    ctx.putImageData(imageData, 0, 0);

    const sketchDataURL = canvas.toDataURL();
    setSelectedImage(sketchDataURL);
    setIsSketchMode(true);
  };

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = currentColor;
  }, [brushSize, currentColor]);

  return (
    <>
      <Navbar />
      <div
        className="flex"
        style={{
          height: "100vh",
          backgroundImage: "url(/backgroundImage.jpg)",
          backgroundSize: "cover",
        }}
      >
        <div className="w-1/4 p-4 border-r">
          <img
            ref={imageRef}
            src={selectedImage}
            alt="Image"
            className="w-full h-2/3 rounded-lg"
          />
          <button
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={handleTipsClick}
          >
            {isSketchMode ? "Undo" : "Tips (Generate Sketch)"}
          </button>
          <div className="mt-4">
            <div className="text-start ps-24 pt-5">
              <p>
                <span className="text-cyan-700 font-bold">Color Info :</span>{" "}
                Purple: F090W, Blue: F187N and F770W, Cyan: F200W, Green:
                F1130W; Yellow: F335M, Orange: F444W, Red: F470N and F1500W
              </p>
            </div>
          </div>
        </div>

        <div className="relative w-3/4 p-4">
          <canvas
            ref={canvasRef}
            width={window.innerWidth / 1.5}
            height={window.innerHeight / 1.059}
            style={{
              border: "6px solid #338c97",
              boxShadow: "0 0 15px rgba(0, 0, 0, 0.3)",
              borderRadius: "12px",
              cursor: isEraserActive ? "crosshair" : "auto",
            }}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />

          {/* Action buttons placed at the top-left corner */}
          <div className="absolute top-4 left-4 flex space-x-2">
            <button
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              onClick={handleSave}
            >
              <FaSave />
            </button>
            <button
              className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
              onClick={handleUndo}
            >
              <FaUndo />
            </button>
            <button
              className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
              onClick={handleRedo}
            >
              <FaRedo />
            </button>
            <button
              className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
              onClick={handleEraser}
            >
              <FaEraser />
            </button>
            <button
              className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
              onClick={handleBrush}
            >
              <FaPaintBrush />
            </button>
            <button
              className="bg-purple-500 text-white p-2 rounded hover:bg-purple-600"
              onClick={toggleColorPalette}
            >
              <FaPalette />
            </button>

            {showColorPalette && (
              <div className="absolute top-12 left-0 z-10">
                <HexColorPicker
                  color={currentColor}
                  onChange={handleColorChange}
                />
              </div>
            )}

            {/* Brush size selection */}
            <div className="ml-4 space-x-2">
              <button
                className={`bg-gray-${
                  brushSize === 5 ? "800" : "400"
                } text-white p-2 rounded`}
                onClick={() => setBrushSize(5)}
              >
                Small
              </button>
              <button
                className={`bg-gray-${
                  brushSize === 10 ? "800" : "400"
                } text-white p-2 rounded`}
                onClick={() => setBrushSize(10)}
              >
                Medium
              </button>
              <button
                className={`bg-gray-${
                  brushSize === 15 ? "800" : "400"
                } text-white p-2 rounded`}
                onClick={() => setBrushSize(15)}
              >
                Large
              </button>
            </div>
          </div>
        </div>

        {showSaveGif && (
          <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50">
            <img src="/save.gif" alt="Saving GIF" />
          </div>
        )}
      </div>
    </>
  );
};

export default DrawingBoard;
