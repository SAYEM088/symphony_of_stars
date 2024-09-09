"use client";
import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FiCheckCircle, FiUser, FiArrowRightCircle } from 'react-icons/fi';

const ImagePuzzle = () => {
    const images = ['/g1.png', '/g2.png', '/g3.png']; // You can add more images
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [level, setLevel] = useState(1); // Start with level 1
    const [points, setPoints] = useState(0);
    const [pieces, setPieces] = useState([]);
    const [originalPieces, setOriginalPieces] = useState([]);
    const [notification, setNotification] = useState(null);

    const pieceSize = 100; // Fixed piece size

    // Determine grid size based on level
    const getGridSize = (level) => {
        switch (level) {
            case 1: return [1, 2]; // 1 row, 2 columns
            case 2: return [2, 2]; // 2 rows, 2 columns
            case 3: return [2, 3]; // 2 rows, 3 columns
            case 4: return [3, 3]; // 3 rows, 3 columns
            case 5: return [3, 4]; // 3 rows, 4 columns
            case 6: return [4, 4]; // 4 rows, 4 columns
            default: return [4, 4]; // Default to 4x4 if beyond level 6
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
            setPoints(points + 100); // Award points for solving
            setNotification('Puzzle matched!');

            if (level < 6) {
                setLevel(level + 1); // Go to the next level if it's not the last level
            }
        } else {
            setNotification('Keep trying!');
        }
    };

    const switchImage = () => {
        setCurrentImageIndex((currentImageIndex + 1) % images.length); // Switch to the next image
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div style={styles.page}>
                {/* Profile box on the left */}
                <div style={styles.profileBox}>
                    <FiUser size={40} />
                    <div>Level: {level}</div>
                    <div>Points: {points}</div>
                    <button onClick={switchImage} style={styles.switchButton}>
                        <FiArrowRightCircle size={24} /> Switch Image
                    </button>
                </div>

                <div style={styles.puzzleContainer}>
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

                    <button
                        onClick={checkMatch}
                        style={{ marginTop: '20px', display: 'flex', alignItems: 'center' }}
                        className="check-button bg-blue"
                    >
                        <FiCheckCircle style={{ marginRight: '10px' }} size={24} />
                        Check Match
                    </button>

                    {notification && (
                        <div style={{ marginTop: '10px', color: notification === 'Puzzle matched!' ? 'green' : 'red' }}>
                            {notification}
                        </div>
                    )}
                </div>
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
                border: '1px solid #ccc',
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
        left: '20px',
        top: '20px',
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
    },
    puzzleContainer: {
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
        textAlign: 'center',
    },
    switchButton: {
        marginTop: '10px',
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        border: 'none',
        background: 'none',
        color: '#007bff',
        fontWeight: 'bold',
    },
};

export default ImagePuzzle;
