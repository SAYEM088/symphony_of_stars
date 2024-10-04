"use client";
import Navbar from '@/components/Navbar';
import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { FaPlay, FaPause, FaRedo } from 'react-icons/fa';
import { motion } from 'framer-motion';
import AddKeySoundModal from '@/components/modal/AddkeySoundModal';
import ChangeKeySoundModal from '@/components/modal/ChangeKeySoundMOdal';
import { AiOutlineFileDone } from "react-icons/ai";
const backgroundImage = '/bg2.png';

const SoundComposer = () => {
    // natural sound handling
    const waveformRef = useRef(null);
    const wavesurfer = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    // user composer sound handling
    const userwaveformRef = useRef(null)
    const userwavesurfer = useRef(null);
    const [userIsPlay, setuserIsPlay] = useState(false)
    const [keyFills, setKeyFills] = useState({});
    // State for modals
    const [isAddSoundModalOpen, setIsAddSoundModalOpen] = useState(false);
    const [isChangeKeySoundModalOpen, setIsChangeKeySoundModalOpen] = useState(false);

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
    useEffect(() => {
        userwavesurfer.current = WaveSurfer.create({
            container: userwaveformRef.current,
            waveColor: 'orange',
            progressColor: 'red',
            cursorColor: 'navy',
            barWidth: 3,
            barRadius: 3,
            responsive: true,
            height: 50,
            normalize: true,
            backend: 'MediaElement',
        });
        return () => {
            // Ensure wavesurfer is initialized before trying to destroy it
            if (wavesurfer.current && wavesurfer.current.destroy) {
                wavesurfer.current.destroy();
                wavesurfer.current = null; // Reset the reference to avoid future errors
            }}
    }, [])

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

    // Handle uploading sound files to add new sounds
    const handleAddSoundUpload = (file) => {
        console.log('Uploaded sound:', file.name);
    };

    // Handle updating key sound mappings
    const handleKeySoundUpdate = (key, file) => {
        console.log(`Updated key '${key}' with sound:`, file.name);
    };

    return (
        <>
            <Navbar />
            <div className="fixed z-50">
                <AddKeySoundModal
                    isOpen={isAddSoundModalOpen}
                    onClose={() => setIsAddSoundModalOpen(false)}
                    onUpload={handleAddSoundUpload}
                />
                <ChangeKeySoundModal
                    isOpen={isChangeKeySoundModalOpen}
                    onClose={() => setIsChangeKeySoundModalOpen(false)}
                    onUpdate={handleKeySoundUpdate}
                />

            </div>
            <div
                className="flex flex-col items-center justify-center min-h-screen"
                style={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: 'cover',
                }}
            >



                <div className="grid grid-row-3 mt-8 px-4 w-full">
                    <div className="rows-span-1 ">
                        <div className="grid grid-cols-5 ">
                            <div className="col-span-1 border-2 border-cyan-400 rounded-lg">
                                <div className="px-1  py-5 h-full flex flex-col justify-center items-center  bg-gradient-to-r from-blue-400 to-red-600">
                                    <div className="w-full">
                                        <h1 className='text-white text-xl text-center mb-2'>Original sound</h1>
                                        <div
                                            ref={waveformRef}

                                            className="h-14 border-2 border-white bg-gradient-to-r from-green-400 to-purple-600 mb-4"
                                        ></div>

                                    </div>
                                    <div className="">
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
                            </div>

                            <div className="col-span-4 gap-4 border border-red-500">

                                <div className="flex justify-between items-center my-4 px-4">
                                    <div className="w-full">
                                        <div className=" flex justify-end items-center">
                                            <button className="bg-yellow-500 text-white text-2xl px-4 py-2 rounded-full hover:bg-yellow-700 transition">
                                            <AiOutlineFileDone />
                                            </button>
                                        </div>



                                        <div className="flex flex-row justify-between items-end ms-10 gap-4 my-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-white text-xl">Scailing</span>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    className="w-full appearance-none bg-gradient-to-r from-cyan-400 to-blue-500 h-4 rounded-full"
                                                    style={{

                                                        border: '2px solid white',
                                                        height: '20px',
                                                        borderRadius: '10px',
                                                    }}
                                                />
                                            </div>
                                            <div className="flex items-center  gap-2">
                                                <span className="text-white text-xl">Volume</span>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    className="w-full appearance-none bg-gradient-to-r from-teal-400 to-green-500 h-4 rounded-full"
                                                    style={{

                                                        border: '2px solid white',
                                                        height: '20px',
                                                        borderRadius: '10px',
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex justify-center">
                                            <button className='bg-gradient-to-r from-teal-400 to-green-600 p-3 m-2 border-2 border-white text-2xl rounded-full'>play</button>
                                            <button className='bg-gradient-to-r from-orange-400 to-red-600 p-3 m-2  border-2 border-white text-2xl rounded-full'>restart</button>
                                        </div>
                                    </div>
                                    <div className="relative">

                                        <img
                                            src="/bg2.png"
                                            alt="Galaxy"
                                            className="w-80 ps-10 h-52"
                                        />



                                    </div>
                                </div>
                                <div ref={userwaveformRef}

                                    className="h-14 w-full bg-gradient-to-r from-orange-400 to-red-600 border-2 border-white"></div>
                            </div>


                        </div>
                    </div>
                    <div className="rows-span-2 border-4 border-green-900">
                        <div className="text-white flex justify-between my-2 ">
                            <button className='bg-gradient-to-r from-orange-500 to-pink-500 border-2 border-white text-xl rounded-lg p-3' onClick={() => setIsAddSoundModalOpen(true)}>Add your sound</button>
                            <button className="bg-gradient-to-r from-orange-500 to-red-500 border-2 border-white text-xl rounded-lg p-3">
                                Enter to Save
                            </button>
                            <button className='bg-gradient-to-r from-pink-500 to-orange-500 border-2 border-white text-xl rounded-lg p-3' onClick={() => setIsChangeKeySoundModalOpen(true)} >Change Key Sound</button>
                        </div>
                        <div className="grid grid-cols-1 gap-2 text-white  text-xl bg-red-100">
                            {/* all of the key('f', 'd', 's', 'a', 'w', 'e', 'r','j', 'k', 'l', ';', 'u', 'i', 'o',' ', 'y') will play sound when it press */}
                            <div className="grid grid-cols-7 gap-2 ">
                                {['f', 'd', 's', 'a', 'w', 'e', 'r'].map((key) => (
                                    <div className="border-2 border-white bg-red-300 p-4 text-center relative" key={key}>
                                        <motion.div
                                            className="absolute bottom-0 left-0 w-full bg-gradient-to-r from-green-400 to-pink-500"
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
                                    <div className="border-2 border-white bg-teal-500 p-4 text-center relative" key={key}>
                                        <motion.div
                                            className="absolute bottom-0 left-0 w-full bg-gradient-to-r from-orange-500 to-green-400"
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
                                    <div className="border-2 border-white bg-cyan-500 p-4 text-center relative" key={key === ' ' ? 'space' : key}>
                                        <motion.div
                                            className="absolute bottom-0 left-0 w-full bg-gradient-to-r from-teal-500 to-red-400"
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
