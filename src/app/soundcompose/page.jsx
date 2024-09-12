"use client";
import Navbar from '@/components/Navbar';
import React, { useState, useEffect } from 'react';
import { FiPlay, FiStopCircle, FiRepeat, FiSave, FiShare2 } from 'react-icons/fi';

const ShareComposition = ({ onSend }) => {
    const [email, setEmail] = useState('');

    const handleSend = () => {
        if (email) {
            onSend(email);
        }
    };

    return (
        <div className="fixed z-10 top-1/2 right-1/4 w-1/2  p-4 rounded-lg shadow-md overflow-hidden">
  <div className="relative bg-indigo-500 bg-opacity-80 rounded-lg p-6 shadow-lg group">
    <div className="absolute inset-0 bg-blue-400 opacity-0 group-hover:opacity-100 transition-all duration-1000 ease-in-out rounded-r-full origin-top"></div>
    <div className="relative z-10">
      <h3 className="text-white text-lg font-semibold mb-4">Share your composition</h3>
      <input
        type="email"
        placeholder="Friend's Email Address"
        className="p-2 border rounded w-full mb-4"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleSend} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
        Send
      </button>
    </div>
  </div>
</div>

    );
};

const SoundPage = () => {
    const originalSound = '/m2.wav';
    const harmoniumSounds = [
        '/Recording_14.m4a',
        '/Recording_14.m4a',
        '/Recording_15.m4a',
        '/Recording_16.m4a',
        '/Recording_17.m4a',
        '/Recording_18.m4a',
        '/Recording_19.m4a',
        
    ];

    const [audioInstance, setAudioInstance] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isUserPlaying, setIsUserPlaying] = useState(false);
    const [userComposition, setUserComposition] = useState([]);
    const [progress, setProgress] = useState(0);
    const [userProgress, setUserProgress] = useState(0);
    const [showShareComponent, setShowShareComponent] = useState(false);

    useEffect(() => {
        if (isPlaying) {
            const interval = setInterval(() => {
                setProgress(prev => Math.min(prev + 10, 100)); // Simulate progress
            }, 500);
            return () => clearInterval(interval);
        }
    }, [isPlaying]);

    useEffect(() => {
        if (isUserPlaying) {
            const interval = setInterval(() => {
                setUserProgress(prev => Math.min(prev + 10, 100)); // Simulate user composition progress
            }, 500);
            return () => clearInterval(interval);
        }
    }, [isUserPlaying]);

    const playOriginal = () => {
        if (audioInstance) {
            audioInstance.pause();
        }
        const audio = new Audio(originalSound);
        setAudioInstance(audio);
        setIsPlaying(true);
        audio.play();
        audio.onended = () => {
            setIsPlaying(false);
            setProgress(100); 
        };
    };

    const stopOriginal = () => {
        if (audioInstance) {
            audioInstance.pause();
            setIsPlaying(false);
            setProgress(0); 
        }
    };

    const restartOriginal = () => {
        stopOriginal();
        playOriginal();
    };

    const startComposition = () => {
        setUserComposition([]);
        setUserProgress(0);
    };

    const stopComposition = () => {
        setIsUserPlaying(false);
        setUserProgress(0);
        // Stop all currently playing sounds in the composition
        userComposition.forEach((sound) => {
            const audio = new Audio(sound);
            audio.pause();
            audio.currentTime = 0;
        });
    };

    const restartComposition = () => {
        stopComposition();
        playUserComposition();
    };

    const playHarmoniumKey = (sound) => {
        const audio = new Audio(sound);
        audio.play();
        setUserComposition([...userComposition, sound]);
    };

    const playUserComposition = () => {
        setIsUserPlaying(true);
        userComposition.forEach((sound, index) => {
            setTimeout(() => {
                const audio = new Audio(sound);
                audio.play();
                if (index === userComposition.length - 1) {
                    setIsUserPlaying(false);
                    setUserProgress(100);
                }
            }, index * 1000
        ); // Delay between notes
    });
};

const saveComposition = () => {
    localStorage.setItem('savedComposition', JSON.stringify(userComposition));
    console.log('Composition saved in local storage:', userComposition);
};

const shareComposition = () => {
    setShowShareComponent(true);
};

const handleSendEmail = (email) => {
    console.log(`Composition sent to ${email}`);
    setShowShareComponent(false);
};
const backgroundImage='/bg2.png'
return (
    <><Navbar></Navbar>
    <div className="flex flex-col items-center justify-center min-h-screen" style={{ backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',}}>
        
        <div className="grid grid-cols-6 gap-6">
            {/* Original Sound Card */}
            <div className="relative bg-indigo-400 bg-opacity-50 shadow-lg rounded-lg p-6 transform transition duration-700 ease-in-out hover:scale-105 hover:shadow-xl overflow-hidden group col-span-2">
                <div className="absolute inset-0 bg-blue-300 opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-150 transition-all duration-1000 ease-in-out rounded-full origin-bottom-left"></div>
                <div className="relative top-1/3 z-10 ">
                    <p>Original Music</p>
                    <div className="w-full h-2 bg-gray-300 rounded-full mt-2 mb-4 ">
                        <div style={{ width: `${progress}%` }} className="h-full bg-blue-500 rounded-full"></div>
                    </div>
                    <div className="flex space-x-4">
                        <button onClick={playOriginal} disabled={isPlaying}>
                            <FiPlay size={24} />
                        </button>
                        <button onClick={stopOriginal} disabled={!isPlaying}>
                            <FiStopCircle size={24} />
                        </button>
                        <button onClick={restartOriginal} disabled={isPlaying}>
                            <FiRepeat size={24} />
                        </button>
                    </div>
                </div>
            </div>

            {/* User Composition Card */}
            <div className="relative bg-indigo-400 bg-opacity-50 shadow-lg rounded-lg p-6 transform transition duration-700 ease-in-out hover:scale-110 hover:shadow-2xl overflow-hidden group col-span-4">
                <div className="absolute inset-0 bg-blue-200 opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-150 transition-all duration-1000 ease-in-out rounded-full origin-bottom-left"></div>
                <div className="relative text-center z-10">
                    <p className='text-black-400 text-3xl mb-5'>Your Composition </p>
                    <div className="w-full h-2 bg-gray-300 rounded-full mt-2 mb-4">
                        <div style={{ width: `${userProgress}%` }} className="h-full bg-green-500 rounded-full"></div>
                    </div>
                    <div className="flex justify-center item-center space-x-4">
                        <button onClick={startComposition}>
                            <FiPlay size={24} /> Start
                        </button>
                        <button onClick={restartComposition}>
                            <FiRepeat size={24} /> Restart 
                        </button>
                        <button onClick={stopComposition}>
                            <FiStopCircle size={24} /> Stop
                        </button>
                    </div>

                    {/* Harmonium Keys */}
                    <div className="grid items-center justify-center grid-cols-4 gap-4 mt-6">
                        {harmoniumSounds.slice(0, 7).map((sound, index) => (
                            <button key={index} onClick={() => playHarmoniumKey(sound)} className="bg-green-500 text-white p-4 rounded-lg hover:bg-green-600">
                                Key {index + 1}
                            </button>
                        ))}
                    </div>

                    <div className="flex justify-center item-center space-x-4 mt-6">
                        <button onClick={playUserComposition} disabled={userComposition.length === 0 || isUserPlaying}>
                            <FiPlay size={24} /> Play Composition
                        </button>
                        <button onClick={stopComposition} disabled={!isUserPlaying}>
                            <FiStopCircle size={24} /> Stop Composition
                        </button>
                    </div>

                    <div className="flex justify-center item-center space-x-4 mt-4">
                        <button onClick={saveComposition}>
                            <FiSave size={24} /> Save
                        </button>
                        <button onClick={shareComposition}>
                            <FiShare2 size={24} /> Share
                        </button>
                    </div>
                </div>
            </div>
        </div>

    </div>
    {showShareComponent && <ShareComposition onSend={handleSendEmail} />}
    </>
);
};

export default SoundPage;
