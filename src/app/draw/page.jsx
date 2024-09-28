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
import { HexColorPicker } from "react-colorful";

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
  const [brushHardness, setBrushHardness] = useState(100); // New state for hardness
  const [brushSpacing, setBrushSpacing] = useState(1); // New state for spacing
  const [showColorPalette, setShowColorPalette] = useState(false);
  const [selectedImage, setSelectedImage] = useState("/pilar.png"); // Default image
  const [isSketchMode, setIsSketchMode] = useState(false);
  const [showBrushPanel, setShowBrushPanel] = useState(false);

  const startDrawing = (e) => {
    setIsDrawing(true);
    const ctx = canvasRef.current.getContext("2d");
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round"; // Smoother brush edges
    ctx.globalAlpha = brushHardness / 100;
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
    setShowBrushPanel(true); // Open brush tool panel
  };

  const toggleColorPalette = () => {
    setShowColorPalette(!showColorPalette);
  };

  const handleColorChange = (color) => {
    setCurrentColor(color);
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
    const handleClickOutside = (event) => {
      if (!event.target.closest(".color-picker")) {
        setShowColorPalette(false);
      }
    };

    if (showColorPalette) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showColorPalette]);

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

            <div className="fixed right-2 top-4 flex flex-col space-y-2">
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
            </div>

            {showBrushPanel && (
              <div
                className="fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-20 p-4"
                style={{ transform: "translateX(0)" }}
              >
                <h3 className="text-lg font-bold mb-4">  <button
                  className="mt-4 bg-red-500 text-white p-2 rounded hover:bg-red-600"
                  onClick={() => setShowBrushPanel(false)}
                >
                  Close
                </button> Brush Settings</h3>
                <label>
                  Brush Size:{" "}
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={brushSize}
                    onChange={(e) => setBrushSize(e.target.value)}
                  />
                </label>
                <label> Hardness:{" "}
                   <input type="range" min="0" max="100" value={brushHardness} onChange={(e) => setBrushHardness(e.target.value)} /> 
                  </label>
                <label>
                  Spacing:{" "}
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={brushSpacing}
                    onChange={(e) => setBrushSpacing(e.target.value)}
                  />
                </label>
                {showColorPalette && (
              <div className="absolute top-12 left-0 z-10 color-picker">
                <HexColorPicker color={currentColor} onChange={handleColorChange} />
              </div>
            )}
              </div>
            )}
            
          </div>
        </div>

      </div>


      {showSaveGif && (
        <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <img src="/save.gif" alt="Saving GIF" />
        </div>
      )}

    </>
  );
};

export default DrawingBoard;
