// src/app/draw/page.jsx
'use client'; // Required for using hooks in the app directory

import React, { useRef, useState, useEffect } from 'react';
import { FaUndo, FaRedo, FaEraser, FaPaintBrush, FaSave } from 'react-icons/fa'; // Importing React icons


const DrawingBoard = () => {
    const backgroundImage = '/gb.png'
    const saveSound = './m2.wav'
    const saveGif1 = '/nasagif.gif'
    const saveGif2 = '/celebration.gif'
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [history, setHistory] = useState([]);
    const [redoStack, setRedoStack] = useState([]);
    const [isEraserActive, setIsEraserActive] = useState(false);
    const [showSaveGif, setShowSaveGif] = useState(false);

    const startDrawing = (e) => {
        setIsDrawing(true);
        const ctx = canvasRef.current.getContext('2d');
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
        setRedoStack([]); // Clear redo stack on new action
    };

    const handleSave = () => {
        const dataURL = canvasRef.current.toDataURL();
        // Simulate saving to local directory (in a real app, you could save to a server or use a download link)
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'drawing.png';
        link.click();

        // Trigger GIF and sound
        setShowSaveGif(true);
        const audio = new Audio(saveSound);
        audio.play();

        // Hide the GIF after 3 seconds
        setTimeout(() => {
            setShowSaveGif(false);
        }, 3000);

        console.log('Drawing saved to local directory.');
    };

    const handleLoad = () => {
        const savedDrawing = localStorage.getItem('drawing');
        if (savedDrawing) {
            const ctx = canvasRef.current.getContext('2d');
            const img = new Image();
            img.src = savedDrawing;
            img.onload = () => {
                ctx.drawImage(img, 0, 0);
            };
        }
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
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height); // Clear canvas
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
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height); // Clear entire canvas
        setHistory([]); // Clear history
        setRedoStack([]); // Clear redo stack
        setIsEraserActive(true);
    };

    const handleBrush = () => {
        setIsEraserActive(false);
    };

    useEffect(() => {
        const ctx = canvasRef.current.getContext('2d');
        ctx.lineWidth = 5;
        ctx.strokeStyle = 'black';
        handleLoad(); // Load the saved drawing when the component mounts
    }, []);

    return (
        <div
            className="flex"
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                height: '100vh'
            }}
        >
            {/* Left Column for Image */}
            <div className="w-1/2 p-4 border-r">
                <img 
                    src="https://via.placeholder.com/400" 
                    alt="Placeholder" 
                    className="w-full h-auto" 
                />
            </div>

            {/* Right Column for Drawing Board */}
            <div className="relative w-1/2 p-4">
                <canvas
                    ref={canvasRef}
                    width={window.innerWidth / 2.1}
                    height={window.innerHeight / 1.059}
                    style={{
                        border: '1px solid black',
                        cursor: isEraserActive ? 'crosshair' : 'auto',
                    }}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                />
                
                {/* Vertical Icon Panel */}
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2">
                    <button
                        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 active:bg-blue-700 transition duration-200"
                        onClick={handleSave}
                        title="Save Drawing"
                    >
                        <FaSave />
                    </button>
                    <button
                        className="bg-green-500 text-white p-2 rounded hover:bg-green-600 active:bg-green-700 transition duration-200"
                        onClick={handleUndo}
                        title="Undo"
                    >
                        <FaUndo />
                    </button>
                    <button
                        className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 active:bg-yellow-700 transition duration-200"
                        onClick={handleRedo}
                        title="Redo"
                    >
                        <FaRedo />
                    </button>
                    <button
                        className="bg-red-500 text-white p-2 rounded hover:bg-red-600 active:bg-red-700 transition duration-200"
                        onClick={handleEraser}
                        title="Clear Board"
                    >
                        <FaEraser />
                    </button>
                    <button
                        className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 active:bg-gray-700 transition duration-200"
                        onClick={handleBrush}
                        title="Brush"
                    >
                        <FaPaintBrush />
                    </button>
                </div>

                {/* Save GIF and Music */}
                {showSaveGif && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
        {/* Background GIF (saveGif1) */}
        <img
            src={saveGif1}
            alt="Saving Background"
            className="absolute inset-0 w-full h-full object-cover z-40" 
            style={{ pointerEvents: 'none' }} // Ensure that background gif is not interactive
        />
        {/* Foreground GIF (saveGif2) */}
        <img
            src={saveGif2}
            alt="Saving Foreground"
            className="relative w-1/2 h-1/2 z-50" // Foreground centered gif
        />
    </div>
)}

            </div>
        </div>
    );
};

export default DrawingBoard;
