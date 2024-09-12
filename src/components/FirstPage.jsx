'use client';
import { CiStar } from "react-icons/ci";
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import React, { useState, useEffect, useRef } from 'react';
import { LuSearch, LuSend } from "react-icons/lu";
import aiAnswers from '@/components/data/aiquanswer.json'; 
import { GiSoundWaves } from "react-icons/gi";
import { PiPaintBrushFill } from "react-icons/pi";
import { SiProbot } from "react-icons/si";
import { GiAstronautHelmet } from "react-icons/gi";
import Navbar from "./Navbar";

const Model = ({ onInteract }) => {
  const { scene } = useGLTF('/jwst.glb');
  const modelRef = useRef();
  const [rotationSpeed, setRotationSpeed] = useState(0.0005);
  const [scale, setScale] = useState(0.3);

  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += rotationSpeed; 
      if (scale < 0.6) {
        setScale((prev) => Math.min(prev + 0.0001, 0.6)); 
      }
      modelRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <primitive
      object={scene}
      scale={scale}
      ref={modelRef}
      onClick={onInteract}
      onPointerOver={onInteract}
    />
  );
};

const FirstPage = () => {
  const [showInfo, setShowInfo] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [aiMessage, setAiMessage] = useState('');
  const [recognition, setRecognition] = useState(null); // Store the recognition object

  const handleInteract = () => {
    setShowInfo(true);
    setTimeout(() => setShowInfo(false), 120000);
  };

  const handleSendMessage = () => {
    if (chatInput.trim()) {
      setChatMessages((prev) => [...prev, { type: 'user', message: chatInput }]);

      const matchedAnswer = aiAnswers.find(({ question }) =>
        chatInput.toLowerCase().includes(question.toLowerCase())
      );

      if (matchedAnswer) {
        setTimeout(() => {
          setAiMessage(matchedAnswer.answer);
          setChatMessages((prev) => [...prev, { type: 'ai', message: '' }]);
          // Call the function to speak the AI message
          speakAiMessage(matchedAnswer.answer);
        }, 500); 
      }
      
      setChatInput(''); 
    }
  };

  const speakAiMessage = (message) => {
    const utterance = new SpeechSynthesisUtterance(message);
    speechSynthesis.speak(utterance);
  };

  const startRecognition = () => {
    if (recognition) {
      recognition.start();
    }
  };

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setChatInput(transcript); // Set the input to the recognized speech
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  useEffect(() => {
    if (aiMessage) {
      let i = 0;
      const typeEffect = setInterval(() => {
        setChatMessages((prev) => {
          const lastAiMessage = prev[prev.length - 1];
          if (lastAiMessage && lastAiMessage.type === 'ai') {
            const updatedAiMessage = {
              ...lastAiMessage,
              message: aiMessage.substring(0, i + 1),
            };
            return [...prev.slice(0, prev.length - 1), updatedAiMessage];
          }
          return prev;
        });
        i++;
        if (i === aiMessage.length) clearInterval(typeEffect);
      }, 50);
    }
  }, [aiMessage]);
  return (
    <>
    <Navbar></Navbar>
    <div className="relative w-full h-screen bg-center bg-cover" style={{ backgroundImage: "url('/bg.png')" }}>
      {showInfo && (
        <div className="absolute w-1/3 left-1/3 top-2 opacity-70 rounded bg-gray-600 text-white p-4 text-center z-30">
          <p className="typewriter">......This is James webb Space Telescope............</p>
        </div>
      )}

<div className="absolute left-15 top-1/4 space-y-8 z-20 w-1/4">
        <div className="relative text-orange-100 bg-orange-900 bg-opacity-80 shadow-lg rounded-lg p-6 transform transition duration-700 ease-in-out hover:scale-110 hover:shadow-2xl overflow-hidden group">
          <div className="absolute inset-0 bg-orange-900 opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-150 transition-all duration-1000 ease-in-out rounded-full origin-bottom-left"></div>
          <div className="relative flex items-center space-x-2 z-10">
            <LuSearch className="text-3xl text-orange-50" />
            <h2 className="text-lg font-semibold text-orange-100">Search Stars</h2>
          </div>
          <p className="relative z-10">Click for searching Stars & Galaxy </p>
        </div>

        <div className="relative text-orange-100 bg-orange-900 bg-opacity-80 shadow-lg rounded-lg p-6 transform transition duration-700 ease-in-out hover:scale-110 hover:shadow-2xl overflow-hidden group">
          <div className="absolute inset-0 bg-orange-900 opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-150 transition-all duration-1000 ease-in-out rounded-full origin-bottom-left"></div>
          <div className="relative flex items-center space-x-2 z-10">

            <GiSoundWaves className="text-3xl" />
            <h2 className="text-lg font-semibold">Music Game</h2>
          </div>
          <p className="relative z-10">here you can play and learn with the sound game.</p>
        </div>

        <div className="relative text-orange-100 bg-orange-900 bg-opacity-80 shadow-lg rounded-lg p-6 transform transition duration-700 ease-in-out hover:scale-110 hover:shadow-2xl overflow-hidden group">
          <div className="absolute inset-0 bg-orange-900 opacity-0group-hover:opacity-100 transform scale-0 group-hover:scale-150 transition-all duration-1000 ease-in-out rounded-full origin-bottom-left"></div>
          <div className="relative flex items-center space-x-2 z-10">
          <PiPaintBrushFill className="text-3xl"/>
            <h2 className="text-lg font-semibold">Draw Stars</h2>
          </div>
          <p className="relative z-10">here. you can draw the stars with images</p>
        </div>
      
      </div>

      <div className="absolute right-10 top-1/4  space-y-8 z-20 w-1/4 h-1/2"> 
        <div className="relative flex items-end bg-cyan-600 space-x-2 py-2 rounded ps-10">
          <GiAstronautHelmet className="text-3xl ms-5"/>
          <h2 className="text-lg font-semibold ps-2">Mr. Sam</h2>
          <CiStar className="text-3xl ms-4"/> <span className="text-xl">500</span>
        </div>
        <div className="relative bg-cyan-600 bg-opacity-80 shadow-lg rounded-lg p-6 z-30">
          <div className="relative flex items-center space-x-2">
            <SiProbot className="text-3xl"/>
            <h2 className="text-lg font-semibold">AI Chatbot</h2> 
          </div>
          <div className="chat-box overflow-y-auto h-60 border-b-2 mb-4"> 
            {chatMessages.map((message, index) => (
              <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-2`}>
                {message.type === 'ai' && <GiAstronautHelmet className="mr-2" />}
                <p className={`text-sm ${message.type === 'user' ? 'text-blue-600' : 'text-gray-800'} bg-gray-100 p-2 rounded-lg`}>
                  {message.message}
                </p>
                {message.type === 'user' && <LuSend className="ml-2" />}
              </div>
            ))}
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 p-2 border rounded-md"
              placeholder="Type your message"
              onFocus={startRecognition} // Start recognition when the input is focused
            />
            <button
              onClick={handleSendMessage}
              className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-700"
            >
              <LuSend className="text-xl" />
            </button>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 z-0 flex justify-center items-center">
        <Canvas className="w-full h-full">
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <Model onInteract={handleInteract} />
          <OrbitControls enableZoom={true} />
        </Canvas>
      </div>

      <style jsx>{`
        @keyframes typewriter {
          from { width: 0; }
          to { width: 100%; }
        }

        .typewriter {
          font-family: monospace;
          white-space: nowrap;
          overflow: hidden;
          border-right: 0.15em solid white;
          width: 100%;
          animation: typewriter 5s steps(40, end), blink 0.75s step-end infinite;
        }

        @keyframes blink {
          from, to { border-color: transparent; }
          50% { border-color: white; }
        }

        .chat-box {
          max-height: 100px;
        }
      `}</style>
    </div>
    </>
  );
};

export default FirstPage;
