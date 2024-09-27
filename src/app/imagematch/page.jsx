"use client";
import Navbar from '@/components/Navbar';
import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FaUserAstronaut } from "react-icons/fa";
import { FiCheckCircle, FiUser, FiArrowRightCircle, FiX } from 'react-icons/fi'; // Import FiX for cross button

const ImagePuzzle = () => {
    const images = ['/g1.png', '/g2.png', '/g3.png'];
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [level, setLevel] = useState(1); 
    const [points, setPoints] = useState(0);
    const [pieces, setPieces] = useState([]);
    const [originalPieces, setOriginalPieces] = useState([]);
    const [notification, setNotification] = useState(null);
    const [showSurprise, setShowSurprise] = useState(false); // For showing GIF

    const pieceSize = 100;

    const getGridSize = (level) => {
        switch (level) {
            case 1: return [1, 2];
            case 2: return [2, 2];
            case 3: return [2, 3];
            case 4: return [3, 3];
            case 5: return [3, 4];
            case 6: return [4, 4];
            default: return [4, 4];
        }
    };

    const [gridRows, gridCols] = getGridSize(level);

    useEffect(() => {
        initializePuzzle();
    }, [level, currentImageIndex]);

    const initializePuzzle = () => {
        const shuffledPieces = shufflePieces(gridRows * gridCols);
        setPieces(shuffledPieces);
        setOriginalPieces([...Array(gridRows * gridCols).keys()]);
    };

    const shufflePieces = (size) => {
        const shuffled = [...Array(size).keys()];
        return shuffled.sort(() => Math.random() - 0.5);
    };

    const onDropPiece = (fromIndex, toIndex) => {
        const newPieces = [...pieces];
        [newPieces[fromIndex], newPieces[toIndex]] = [newPieces[toIndex], newPieces[fromIndex]];
        setPieces(newPieces);
    };

    const checkMatch = () => {
        const isMatched = pieces.every((piece, idx) => piece === originalPieces[idx]);
        if (isMatched) {
            setPoints(points + 100);
            setNotification('');
            setShowSurprise(true); // Show the GIF

            if (level < 6) {
                setLevel(level + 1); 
            }
        } else {
            setNotification('Keep trying!');
        }
    };

    const switchImage = () => {
        setCurrentImageIndex((currentImageIndex + 1) % images.length);
    };

    const handleShare = () => {
        const shareText = `I just completed Level ${level} on the Image Puzzle game! Check it out!`;
        if (navigator.share) {
            navigator.share({
                title: 'Image Puzzle',
                text: shareText,
                url: window.location.href,
            })
            .then(() => console.log('Successfully shared'))
            .catch((error) => console.log('Error sharing', error));
        } else {
            alert('Sharing is not supported on this browser. Copy the link to share: ' + window.location.href);
        }
    };

    const handleCloseSurprise = () => {
        setShowSurprise(false); // Hide the GIF and surprise container
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <Navbar />
            <div className="fixed top-7 left-5">
                <img src="/board.png" style={{ width: '450px', height: '500px' }} className="boardimage" alt="background" />
            </div>
            <div style={styles.page}>
                <div style={styles.profileBox}>
                    <FaUserAstronaut size={40} className='mt-2 p-1 bg-gradient-to-r from-cyan-200  border-2 border-white to-orange-300 ' />
                    <div>Level: {level}</div>
                    <div>Points: {points}</div>
                    <button onClick={switchImage} style={styles.switchButton}>
                        <FiArrowRightCircle size={20} /> Switch Image
                    </button>
                </div>

                {/* Puzzle Container */}
                <div className='w-1/3 h-1/3 text-center' style={styles.puzzleContainer}>
                    <div className="flex justify-center items-center">
                        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${gridCols}, ${pieceSize}px)` }}>
                            {pieces.map((pieceIndex, idx) => (
                                <PuzzlePiece
                                    key={idx}
                                    image={images[currentImageIndex]}
                                    index={idx}
                                    pieceIndex={pieceIndex}
                                    pieceSize={pieceSize}
                                    gridRows={gridRows}
                                    gridCols={gridCols}
                                    onDropPiece={onDropPiece}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Check Match Button Always at Bottom */}
                    <button
                        onClick={checkMatch}
                        style={{ margin:"auto", marginTop: '2rem', display: 'flex', alignItems: 'center',  }}
                        className=" check-button  bg-gradient-to-r from-cyan-200  border-2 border-white to-orange-300 text-red-800 bg-opacity-50  rounded-full p-2"
                    >
                        <FiCheckCircle style={{ marginRight: '10px' }} size={24} />
                        Check Match
                    </button>

                    {/* Notification */}
                    {notification && (
                        <div style={{ marginTop: '10px', color: notification === 'Puzzle matched!' ? 'green' : 'red' }}>
                            {notification}
                        </div>
                    )}
                </div>

                {/* Surprise GIF and Share Button */}
                {showSurprise && (
                    <div className='flex flex-col gap-5' style={styles.surpriseContainer}>
                        <FiX
                            size={30}
                            style={styles.closeButton}
                            onClick={handleCloseSurprise}
                        />
                        <img
                            src="nasagif.gif"
                            alt="Surprise GIF"
                            className="surprise-gif w-1/2"
                        />
                        {/* Share Button */}
                        <button onClick={handleShare} className="bg-blue-500 text-white rounded-lg px-4 py-2">
                            Share Your Victory!
                        </button>
                    </div>
                )}
            </div>
        </DndProvider>
    );
};

const PuzzlePiece = ({ image, index, pieceIndex, pieceSize, gridRows, gridCols, onDropPiece }) => {
    const [{ isDragging }, drag] = useDrag({
        type: 'piece',
        item: { index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, drop] = useDrop({
        accept: 'piece',
        drop: (item) => onDropPiece(item.index, index),
    });

    const x = (pieceIndex % gridCols) * pieceSize;
    const y = Math.floor(pieceIndex / gridCols) * pieceSize;

    return (
        <div
            ref={(node) => drag(drop(node))}
            style={{
                width: pieceSize,
                height: pieceSize,
                backgroundImage: `url(${image})`,
                backgroundPosition: `-${x}px -${y}px`,
                backgroundSize: `${pieceSize * gridCols}px ${pieceSize * gridRows}px`,
                opacity: isDragging ? 0.5 : 1,
                border: '1px solid #66cc99',
            }}
        />
    );
};

const styles = {
    page: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f0f0f0',
        backgroundImage: `url('/bg.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    profileBox: {
        position: 'absolute',
        left: '100px',
        top: '188px',
        fontWeight: 700,
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1px',
        color: "#3aa2f4"
    },
    puzzleContainer: {
        padding: '20px',
        background: 'linear-gradient(135deg,  #cc6699, #4caf50)',
        borderRadius: '8px',
        border:'2px solid white',
        boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
        textAlign: 'center',
        height:'auto'
    },    
    switchButton: {
        marginTop: '5px',
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        border: 'none',
        background: 'none',
        color: '#007bff',
        fontWeight: 'bold',
    },
    surpriseContainer: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    closeButton: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        cursor: 'pointer',
        color: 'white',
    },
};

export default ImagePuzzle;
