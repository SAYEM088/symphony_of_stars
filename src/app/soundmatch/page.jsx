"use client";
import Navbar from '@/components/Navbar';
import React, { useState, useRef, useEffect } from 'react'; // Import useRef and useEffect here
import { FaStop, FaPause, FaRedo } from 'react-icons/fa'; 
import WaveSurfer from 'wavesurfer.js'; // Make sure to import WaveSurfer

const SoundMatchPage = () => {

    const [quizAnswer, setQuizAnswer] = useState('');
    const [showSurprise, setShowSurprise] = useState(false);
    const correctAnswer = "Option 1"; 

    const waveSurferRef = useRef(null); // useRef inside the component
    const waveformRef = useRef(null); // useRef inside the component

    useEffect(() => {
        if (waveformRef.current) {
            waveSurferRef.current = WaveSurfer.create({
                container: waveformRef.current,
                waveColor: "violet",
                progressColor: 'purple',
                cursorColor: 'navy',
                barWidth: 2,
                barRadius: 3,
                responsive: true,
                height: 40,
                normalize: true,
                backend: 'MediaElement',
            });
    
            waveSurferRef.current.load("/scal-1.mp3");
    
            return () => {
                if (waveSurferRef.current) {
                    waveSurferRef.current.destroy();
                }
            };
        }
    }, [waveformRef]); // Add waveformRef in the dependency array

   
    const handleSubmit = () => {
        if (quizAnswer === correctAnswer) {
            setShowSurprise(true);
        }
    };

    const backgroundImage ='/bg2.png';

    return (
        <>
            <Navbar />
            <div
                style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover' }}
                className="sound-match-page p-6 min-h-screen "
            >
                <h1 className="text-white text-2xl">Quiz</h1>
                <div className=" flex items-center mt-20 space-x-8 justify-center">
                <div className="card bg-gradient-to-r from-pink-500 to-orange-500 shadow-md rounded-lg p-20 w-full max-w-md">
                    <h3 className="text-lg text-white text-center mb-6 font-bold mb-2">Symphony of A star</h3>
                        <div ref={waveformRef} className="flex-1 h-10 border border-2 border-white rounded-lg w-full bg-gradient-to-r from-green-400 to-purple-600"></div>
                    <div className="controls flex gap-2 mt-4 justify-around">
                        <button  className="flex border-2 border-white items-center justify-center bg-gradient-to-r from-cyan-400 to-red-500 text-white rounded-lg px-4 py-2">
                            <FaStop className="mr-2" /> Stop
                        </button>
                        <button  className="flex border-2 border-white items-center justify-center bg-gradient-to-r from-red-400 to-green-500 text-white rounded-lg px-4 py-2">
                            <FaPause className="mr-2" /> Pause
                        </button>
                        <button className="flex border-2 border-white items-center justify-center bg-gradient-to-r from-green-400 to-cyan-500 text-white rounded-lg px-4 py-2">
                            <FaRedo className="mr-2" /> Restart
                        </button>
                    </div>
                </div>
                <div className="card bg-gradient-to-r from-orange-500 to-pink-500 shadow-md rounded-lg px-10 py-8 w-full max-w-md">
                    <h3 className="text-lg font-bold mb-4">Q: Which Name is appropriate for this Symphony?</h3>
                    <div className="options space-y-2 mb-4">
                        <label className="block">
                            <input
                                type="radio"
                                value="Option 1"
                                checked={quizAnswer === "Option 1"}
                                onChange={(e) => setQuizAnswer(e.target.value)}
                                className="mr-2"
                            />
                            L1527 and Protostar
                        </label>
                        <label className="block">
                            <input
                                type="radio"
                                value="Option 2"
                                checked={quizAnswer === "Option 2"}
                                onChange={(e) => setQuizAnswer(e.target.value)}
                                className="mr-2"
                            />
                            Southern Ring Nebula
                        </label>
                        <label className="block">
                            <input
                                type="radio"
                                value="Option 3"
                                checked={quizAnswer === "Option 3"}
                                onChange={(e) => setQuizAnswer(e.target.value)}
                                className="mr-2"
                            />
                            WR 124
                        </label>
                        <label className="block">
                            <input
                                type="radio"
                                value="Option 4"
                                checked={quizAnswer === "Option 4"}
                                onChange={(e) => setQuizAnswer(e.target.value)}
                                className="mr-2"
                            />
                            NGC 346
                        </label>
                    </div>
                    <button
                        onClick={handleSubmit}
                        className="bg-gradient-to-r from-teal-500 to-red-600 text-white rounded-lg px-4 py-2 w-full"
                    >
                        Submit
                    </button>
                    {showSurprise && (
                        <div className="surprise mt-4">
                            <img
                                src="https://media.giphy.com/media/3o7TKOit78vfbFz3fK/giphy.gif"
                                alt="Surprise GIF"
                                className="rounded-lg mb-4"
                            />
                            <audio controls autoPlay className="w-full">
                                <source src="surprise-music.mp3" type="audio/mpeg" />
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                    )}
                </div>
            </div>
            </div>
        </>
    );
};

export default SoundMatchPage;
