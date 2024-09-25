"use client";
import Navbar from '@/components/Navbar';
import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { FaPlay, FaPause, FaRedo } from 'react-icons/fa';
import { motion } from 'framer-motion';

const backgroundImage = '/bg2.png';

const SoundComposer = () => {
    const waveformRef = useRef(null);
    const wavesurfer = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [keyFills, setKeyFills] = useState({});

    useEffect(() => {
        wavesurfer.current = WaveSurfer.create({
            container: waveformRef.current,
            waveColor: 'violet',
            progressColor: 'purple',
            cursorColor: 'navy',
            barWidth: 3,
            barRadius: 3,
            responsive: true,
            height: 50,
            normalize: true,
            backend: 'MediaElement',
        });
        wavesurfer.current.load('/scal-1.mp3');
        return () => {
            if (wavesurfer.current) {
                wavesurfer.current.destroy();
            }
        };
    }, []);

    const handlePlayPause = () => {
        if (wavesurfer.current) {
            if (isPlaying) {
                wavesurfer.current.pause();
                setIsPlaying(false);
            } else {
                wavesurfer.current.play();
                setIsPlaying(true);
            }
        }
    };

    const handleRestart = () => {
        if (wavesurfer.current) {
            wavesurfer.current.stop();
            wavesurfer.current.play();
            setIsPlaying(true);
        }
    };

    const startFilling = (key) => {

        setKeyFills((prevFills) => {
            const newFills = {};
            Object.keys(prevFills).forEach((k) => {
                newFills[k] = k === key ? prevFills[k] : 0;
            });
            return {
                ...newFills,
                [key]: 0,
            };
        });


        const fillInterval = setInterval(() => {
            setKeyFills((prevFills) => ({
                ...prevFills,
                [key]: Math.min((prevFills[key] || 0) + 1, 100),
            }));
        }, 10);


        const handleKeyRelease = () => {
            clearInterval(fillInterval);
            window.removeEventListener('keyup', handleKeyRelease);
        };

        window.addEventListener('keyup', handleKeyRelease);
    };

    const handleKeyPress = (event) => {
        const { key, shiftKey } = event;
        const pressedKey = key === ' ' ? 'space' : (shiftKey ? key.toUpperCase() : key);
        startFilling(pressedKey);
    };



    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, []);

    return (
        <>
       
         
            <div
                className="flex flex-col items-center justify-center min-h-screen"
                style={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: 'cover',
                }}
            >
                 
        <Navbar />
    
                <div className="grid grid-row-3">
                    <div className="rows-span-1 ">
                        <div className="grid grid-cols-5 ">
                            <div className="col-span-1 border border-red-500">
                                <div className="px-24 py-5 h-full  bg-gradient-to-r from-blue-400 to-red-600">
                                    <div
                                        ref={waveformRef}
                                        className="h-14 w-full bg-gradient-to-r from-green-400 to-purple-600 mb-4"
                                    ></div>
                                    <div className="flex space-x-4 mt-4">
                                        <button
                                            className="bg-green-500 text-white p-2 rounded-full hover:bg-green-700 transition-all"
                                            onClick={handlePlayPause}
                                        >
                                            {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
                                        </button>
                                        <button
                                            className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-700 transition-all"
                                            onClick={handleRestart}
                                        >
                                            <FaRedo size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-4 gap-4 border border-red-500">

                                <div className="flex justify-between items-center my-4 px-4">
                                    <div className="">
                                <div className="">
                                    <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-800 transition">
                                        Enter to Save
                                    </button>
                                    <button className="bg-yellow-500 text-white px-4 py-2 rounded-full hover:bg-yellow-700 transition">
                                        →
                                    </button>
                                </div>
                             
                               
                                   
                                    <div className="flex flex-row gap-4 my-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-white">Arohi</span>
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                className="w-full appearance-none bg-red-600 h-4 rounded-full"
                                                style={{
                                                    backgroundImage: 'linear-gradient(to right, red, red)',
                                                    border: '2px solid gray',
                                                    height: '20px',
                                                    borderRadius: '10px',
                                                }}
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-white">oborohi</span>
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                className="w-full appearance-none bg-green-600 h-4 rounded-full"
                                                style={{
                                                    backgroundImage: 'linear-gradient(to right, green, green)',
                                                    border: '2px solid gray',
                                                    height: '20px',
                                                    borderRadius: '10px',
                                                }}
                                            />
                                        </div>
                                    </div>
                                                <div className="">play undo redo button </div>
                                    </div>
                                    <div className="relative">

                                        <img
                                            src="https://upload.wikimedia.org/wikipedia/commons/c/c3/NGC_4414_(NASA-med).jpg"
                                            alt="Galaxy"
                                            className="w-52 h-52"
                                        />


                                        <div
                                            className="absolute inset-0 flex justify-center items-center"
                                            style={{
                                                zIndex: 10,

                                            }}
                                        >
                                            <div
                                                className="h-24 w-48"
                                                style={{
                                                    background: 'rgba(20,0,0,0.3)',
                                                    borderRadius: '2px',
                                                    animation: 'waveAnimation 1.5s infinite',
                                                    zIndex: 11,
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                                <div ref={waveformRef} className="h-14 w-full bg-gradient-to-r from-green-400 to-purple-600"></div>
                            </div>


                        </div>
                    </div>
                    <div className="rows-span-2 border-4 border-green-900">
                        <div className="text-white flex justify-between my-2 ">
                            <button className='bg-blue-500 p-3'>Add your sound</button>
                            <button className='bg-blue-500 p-3'>Change Key Sound</button>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                            <div className="grid grid-cols-7 gap-2">
                                {['f', 'd', 's', 'a', 'w', 'e', 'r'].map((key) => (
                                    <div className="border border-white p-4 text-center relative" key={key}>
                                        <motion.div
                                            className="absolute bottom-0 left-0 w-full bg-blue-500"
                                            animate={{ height: `${keyFills[key] || 0}%` }}
                                            initial={false}
                                            transition={{ duration: 0.001 }}
                                        ></motion.div>
                                        <span className="relative">{key}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-7 gap-2">
                                {['j', 'k', 'l', ';', 'u', 'i', 'o'].map((key) => (
                                    <div className="border border-white p-4 text-center relative" key={key}>
                                        <motion.div
                                            className="absolute bottom-0 left-0 w-full bg-blue-500"
                                            animate={{ height: `${keyFills[key] || 0}%` }}
                                            initial={false}
                                            transition={{ duration: 0.1 }}
                                        ></motion.div>
                                        <span className="relative">{key}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                {[' ', 'y'].map((key) => (
                                    <div className="border border-white p-4 text-center relative" key={key === ' ' ? 'space' : key}>
                                        <motion.div
                                            className="absolute bottom-0 left-0 w-full bg-blue-500"
                                            animate={{ height: `${keyFills[key === ' ' ? 'space' : key] || 0}%` }}
                                            initial={false}
                                            transition={{ duration: 0.1 }}
                                        ></motion.div>
                                        <span className="relative">{key === ' ' ? 'Spacebar' : key}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style>
                {`
  @keyframes waveAnimation {
    0% {
      transform: scale(0.8);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(0.8);
    }
  }
`}
            </style>
        </>
    );
};

export default SoundComposer;
