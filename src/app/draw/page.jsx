"use client";
import Navbar from "@/components/Navbar";
import axios from 'axios';
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
  const imageRef = useRef(null); 
  const [isDrawing, setIsDrawing] = useState(false);
  const [history, setHistory] = useState([]); 
  const [redoStack, setRedoStack] = useState([]); 
  const [isEraserActive, setIsEraserActive] = useState(false);
  const [showSaveGif, setShowSaveGif] = useState(false);
  const [currentColor, setCurrentColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);
  const [brushHardness, setBrushHardness] = useState(100);
  const [brushSpacing, setBrushSpacing] = useState(1); 
  const [showColorPalette, setShowColorPalette] = useState(false);
  const [selectedImage, setSelectedImage] = useState("/pilar.png"); 
  const [isSketchMode, setIsSketchMode] = useState(false);
  const [showBrushPanel, setShowBrushPanel] = useState(false);

  const startDrawing = (e) => {
    setIsDrawing(true);
    const ctx = canvasRef.current.getContext("2d");
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round"; 
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
    console.log("canvasd img::: ")
    console.log(dataURL)
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "drawing.png";
    link.click();
    setShowSaveGif(true);
    const audio = new Audio("");
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
    setShowBrushPanel(true); 
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

  const handleShare = async () => {
    const dataURL = canvasRef.current.toDataURL("image/png");
    const base64Data = dataURL.replace(/^data:image\/png;base64,/, '');
    console.log(".........sent img::: ")
  console.log(dataURL)
    try {
      const response = await axios.post('http://localhost:3000/api/addDraw', {
        data: base64Data 
      });
      console.log('Data sent:', response.data);
    } catch (error) {
      console.error('Error posting data:', error);
    }
  };
  
  const changeCanvasBg = (color) => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.fillStyle = color; 
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height); 
  };
  
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
        <div className="w-1/4 p-4 mt-28 border-r">
          <img
            ref={imageRef}
            src={selectedImage}
            alt="Image"
            className="w-full h-2/3 rounded-lg"
          />
          <button
            className="mt-4 bg-gradient-to-r from-orange-400 to-red-600  text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={handleTipsClick}
          >
            {isSketchMode ? "Undo" : "Tips"}
          </button>
          <div className="mt-4">
            <div className="text-start ">
              <p>
                <span className="text-cyan-700 font-semibold">Color Info :</span>{" "}
                Purple: F090W, Blue: F187N and F770W, Cyan: F200W, Green:
                F1130W; Yellow: F335M, Orange: F444W, Red: F470N and F1500W
              </p>
            </div>
          </div>
        </div>

        <div className="relative w-3/4 p-4">
        {/* add a button which will change canvasbg (gray,black,offwhite, origial white)  */}
          <canvas
            ref={canvasRef}
            width={window.innerWidth / 1.5}
            height={window.innerHeight / 1.059}
            style={{
              border: "6px solid #9FE2BF",
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
              className=" bg-gradient-to-r from-blue-500  to-cyan-300 text-white p-2 rounded hover:bg-blue-600"
              onClick={handleSave}
            >
              <FaSave />
            </button>
            <button
              className="bg-gradient-to-r from-green-500  to-teal-300 text-white p-2 rounded hover:bg-green-600"
              onClick={handleUndo}
            >
              <FaUndo />
            </button>
            <button
              className="bg-gradient-to-r from-yellow-500  to-red-300 text-white p-2 rounded hover:bg-yellow-600"
              onClick={handleRedo}
            >
              <FaRedo />
            </button>
            <button
              className=" bg-gradient-to-r from-red-400 to-orange-600 text-white p-2  rounded hover:bg-red-600"
              onClick={handleEraser}
            >
              <FaEraser />
            </button>

            <div className="fixed right-2  top-4 flex flex-col space-y-2">
              <button
                className=" bg-gradient-to-r from-gray-500 to-orange-600 w-3/4 ms-auto text-white p-2 rounded hover:bg-gray-600"
                onClick={handleBrush}
              >
                <FaPaintBrush  />
              </button>
              <button
                className="bg-gradient-to-r from-cyan-500 to-purple-500  w-3/4 ms-auto text-white p-2 rounded hover:bg-purple-600"
                onClick={handleBrush}
              >
                <FaPalette />
              </button>

          <select className="bg-gradient-to-r from-orange-600 to-cyan-500 rounded p-1 w-3/4 ms-auto" onChange={(e) => changeCanvasBg(e.target.value)}>
        <option value="" disabled selected>Canvas Color</option>
        <option value="gray">Gray</option>
        <option value="black">Black</option>
        <option value="offwhite">Off White</option>
        <option value="white">Original White</option>
      </select>
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
                </button>Settings</h3>
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
          
              <div className="absolute top-60 left-4 z-10 color-picker">
                <HexColorPicker color={currentColor} onChange={handleColorChange} />
              </div>
        
              </div>
            )}
            
          </div>
        </div>

      </div>


      {showSaveGif && (
        <div className="absolute inset-0 flex flex-col gap-2 justify-center items-center bg-black bg-opacity-50">
          <img src="/nasagif.gif" alt="Saving GIF" />
          <button className="bg-gradient-to-r from-orange-400 to-red-600 p-3" onClick={handleShare}>Share</button>
        </div>
      )}

    </>
  );
};

export default DrawingBoard;
