"use client";
import React, { useState } from 'react';

const StarInfo = () => {
    const [activeSlider, setActiveSlider] = useState('birth');

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
            {/* Left Column - Star Info */}
            <div className="flex flex-col items-center w-full md:w-4/5 p-4">
                {/* Sliders */}
                <div className="flex space-x-4 mb-8">
                    <button
                        className={`py-2 px-4 rounded ${activeSlider === 'birth' ? 'bg-blue-500' : 'bg-gray-700'}`}
                        onClick={() => setActiveSlider('birth')}
                    >
                        Birth
                    </button>
                    <button
                        className={`py-2 px-4 rounded ${activeSlider === 'life' ? 'bg-blue-500' : 'bg-gray-700'}`}
                        onClick={() => setActiveSlider('life')}
                    >
                        Life
                    </button>
                    <button
                        className={`py-2 px-4 rounded ${activeSlider === 'death' ? 'bg-blue-500' : 'bg-gray-700'}`}
                        onClick={() => setActiveSlider('death')}
                    >
                        Death
                    </button>
                </div>

                {/* Content Area */}
                <div className="w-full">
                    {/* Photo/Video Area */}
                    <div className="w-full h-64 bg-gray-800 mb-4">
                        {activeSlider === 'birth' && (
                            <img src="/path/to/birth-image.jpg" alt="Birth of a star" className="w-full h-full object-cover" />
                        )}
                        {activeSlider === 'life' && (
                            <video className="w-full h-full object-cover" controls>
                                <source src="/path/to/life-video.mp4" type="video/mp4" />
                            </video>
                        )}
                        {activeSlider === 'death' && (
                            <img src="/path/to/death-image.jpg" alt="Death of a star" className="w-full h-full object-cover" />
                        )}
                    </div>

                    {/* Info Area */}
                    <div className="bg-gray-800 p-4 rounded-md">
                        {activeSlider === 'birth' && (
                            <p>
                                The birth of a star occurs in stellar nurseries where gas and dust collapse under gravity to form a new star.
                            </p>
                        )}
                        {activeSlider === 'life' && (
                            <p>
                                A star lives through nuclear fusion, where hydrogen atoms fuse into helium, releasing massive energy.
                            </p>
                        )}
                        {activeSlider === 'death' && (
                            <p>
                                The death of a star can result in a supernova, black hole, or neutron star, depending on its mass.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StarInfo;
