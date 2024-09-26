"use client"
import Navbar from '@/components/Navbar';
import React, { useRef, useState, useEffect } from 'react';
import { FaUndo, FaRedo, FaEraser, FaPaintBrush, FaSave, FaPalette } from 'react-icons/fa';

const DrawingBoard = () => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [history, setHistory] = useState([]);
    const [redoStack, setRedoStack] = useState([]);
    const [isEraserActive, setIsEraserActive] = useState(false);
    const [showSaveGif, setShowSaveGif] = useState(false);
    const [currentColor, setCurrentColor] = useState('#000000'); // Default black color
    const [brushSize, setBrushSize] = useState(5); // Default brush size
    const [showColorPalette, setShowColorPalette] = useState(false);

    const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#000000'];

    const startDrawing = (e) => {
        setIsDrawing(true);
        const ctx = canvasRef.current.getContext('2d');
        ctx.strokeStyle = currentColor; 
        ctx.lineWidth = brushSize; 
        ctx.beginPath();
        ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const ctx = canvasRef.current.getContext('2d');
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
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'drawing.png';
        link.click();
        setShowSaveGif(true);
        const audio = new Audio('./m2.wav');
        audio.play();
        setTimeout(() => setShowSaveGif(false), 3000);
    };

    const handleUndo = () => {
        if (history.length === 0) return;
        const newHistory = [...history];
        const lastDrawing = newHistory.pop();
        setRedoStack((prevRedo) => [...prevRedo, lastDrawing]);
        setHistory(newHistory);
        redraw(newHistory);
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
        const ctx = canvasRef.current.getContext('2d');
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
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        setHistory([]);
        setRedoStack([]);
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
        setShowColorPalette(false);
    };

    useEffect(() => {
        const ctx = canvasRef.current.getContext('2d');
        ctx.lineWidth = brushSize;
        ctx.strokeStyle = currentColor;
    }, [brushSize, currentColor]);

    return (
        <>
            <Navbar />
            <div
                className="flex"
                style={{
                    height: '100vh',
                    backgroundImage: 'url(/backgroundImage.jpg)',
                    backgroundSize: 'cover',
                }}
            >
                <div className="w-1/4 p-4 border-r">
                    <img src="/pilar.png" alt="Placeholder" className="w-full h-2/3 rounded-lg" />
                    <div className=" mt-4">
                       <div className="text-start ps-24 pt-5 ">
                       <p><span className='text-cyan-700 font-bold'>Color Info : </span>Purple: F090W, Blue: F187N and F770W, Cyan: F200W, Green: F1130W; Yellow: F335M, Orange: F444W, Red: F470N and F1500W </p> 
                       </div>
                      
                    </div>
                </div>

                <div className="relative w-3/4 p-4">
                    <canvas
                        ref={canvasRef}
                        width={window.innerWidth /1.5}
                        height={window.innerHeight / 1.059}
                        style={{
                            border: '6px solid #338c97',
                            boxShadow: '0 0 15px rgba(0, 0, 0, 0.3)',
                            borderRadius: '12px',
                            cursor: isEraserActive ? 'crosshair' : 'auto',
                        }}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                    />

                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2">
                        <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600" onClick={handleSave}>
                            <FaSave />
                        </button>
                        <button className="bg-green-500 text-white p-2 rounded hover:bg-green-600" onClick={handleUndo}>
                            <FaUndo />
                        </button>
                        <button className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600" onClick={handleRedo}>
                            <FaRedo />
                        </button>
                        <button className="bg-red-500 text-white p-2 rounded hover:bg-red-600" onClick={handleEraser}>
                            <FaEraser />
                        </button>
                        <button className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600" onClick={handleBrush}>
                            <FaPaintBrush />
                        </button>
                        <button className="bg-purple-500 text-white p-2 rounded hover:bg-purple-600" onClick={toggleColorPalette}>
                            <FaPalette />
                        </button>

                        {showColorPalette && (
                            <div className="flex space-x-2 p-2 bg-white shadow-md rounded-md">
                                {colors.map((color) => (
                                    <div
                                        key={color}
                                        onClick={() => handleColorChange(color)}
                                        className="w-6 h-6 cursor-pointer rounded-full"
                                        style={{ backgroundColor: color }}
                                    ></div>
                                ))}
                            </div>
                        )}

                        <input
                            type="range"
                            min="1"
                            max="20"
                            value={brushSize}
                            onChange={(e) => setBrushSize(e.target.value)}
                            className="mt-2"
                        />
                    </div>

                    {showSaveGif && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
                            <img src="/nasagif.gif" alt="Saving Background" className="absolute inset-0 w-full h-full object-cover z-40" />
                            <img src="/celebration.gif" alt="Saving Foreground" className="relative w-1/2 h-1/2 z-50" />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default DrawingBoard;
