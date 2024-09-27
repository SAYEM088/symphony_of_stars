"use client"
import Navbar from '@/components/Navbar';
import React, { useState } from 'react';
import { FaStop, FaPause, FaRedo } from 'react-icons/fa'; 

const SoundMatchPage = () => {
    const [progress, setProgress] = useState(0);
    const [quizAnswer, setQuizAnswer] = useState('');
    const [showSurprise, setShowSurprise] = useState(false);
    const correctAnswer = "Option 1"; 

    const handleProgress = () => {
        setProgress(progress + 10);
    };

    const handleSubmit = () => {
        if (quizAnswer === correctAnswer) {
            setShowSurprise(true);
        }
    };
const backgroundImage ='/bg2.png'
    return (
        <><Navbar></Navbar>
        <div style={{backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',}} className="sound-match-page p-6  min-h-screen flex flex-col items-center space-y-8">
            <div className="text-white text-2xl">Quiz</div>
            <div className="card bg-gradient-to-r from-pink-500 to-orange-500 shadow-md rounded-lg  p-20 w-full max-w-md">
                <h3 className="text-lg font-bold mb-2">Symphony of A star</h3>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                    <div
                        className="bg-blue-500 h-2.5 rounded-full"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
                <div className="controls flex gap-2 justify-around">
                    <button onClick={() => setProgress(0)} className="flex border-2 border-white items-center justify-center bg-gradient-to-r from-cyan-400 to-red-500 text-white rounded-lg px-4 py-2">
                        <FaStop className="mr-2" /> Stop
                    </button>
                    <button onClick={() => setProgress(50)} className="flex  border-2 border-white items-center justify-center bg-gradient-to-r from-red-400 to-green-500 text-white rounded-lg px-4 py-2">
                        <FaPause className="mr-2" /> Pause
                    </button>
                    <button onClick={() => handleProgress()} className="flex  border-2 border-white items-center justify-center bg-gradient-to-r from-green-400 to-cyan-500 text-white rounded-lg px-4 py-2">
                        <FaRedo className="mr-2" /> Restart
                    </button>
                </div>
            </div>
            <div className="card bg-violet-200 shadow-md rounded-lg p-4 w-full max-w-md">
                <h3 className="text-lg font-bold mb-4">Q: Which Name is appropiacte for this Symphony?</h3>
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
                    className="bg-blue-500 text-white rounded-lg px-4 py-2 w-full"
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
        </>
    );
};

export default SoundMatchPage;
