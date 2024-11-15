'use client';
import { CiStar } from "react-icons/ci";
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import React, { useState, useEffect, useRef } from 'react';
import { LuSearch, LuSend, LuMinimize2, LuMaximize2 } from "react-icons/lu"; // Added LuMinimize2 and LuMaximize2
import aiAnswers from '@/components/data/aiquanswer.json';
import { SiProbot } from "react-icons/si";
import { GiAstronautHelmet } from "react-icons/gi";
import Navbar from "./Navbar";
import ShareInSocial from "./ShareInSocial";
import { FaMicrophoneAlt } from "react-icons/fa";

const Model = ({ onInteract }) => {
  const { scene } = useGLTF('/jwst1.glb');
  const modelRef = useRef();
  const [rotationSpeed, setRotationSpeed] = useState(0.0005);
  const [scale, setScale] = useState(1.5);

  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += rotationSpeed;
      if (scale < 1.8) {
        setScale((prev) => Math.min(prev + 0.000001, 1.5));
      }
      modelRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <primitive
      position={[0, -2, 0]}
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
  const [recognition, setRecognition] = useState(null);
  const [isExpanded, setIsExpanded] = useState(true);
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
        setChatInput(transcript);
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
          <div className="absolute w-70 left-1/3 ms-10 bottom-2 opacity-70 rounded bg-gradient-to-r from-orange-600 to-cyan-500 text-white p-4 text-center z-30">
            <p className="typewriter">This is James Webb Space Telescope</p>
          </div>
        )}

        <div className=" absolute left-15 top-24  z-20 ">
          <ShareInSocial></ShareInSocial>
        </div>

        <div className={`absolute right-0 bottom-4 z-20 flex flex-col gap-2 ${isExpanded ? 'h-auto' : 'h-20'} transition-all`}>
          <div className={`bg-gradient-to-r from-orange-400 to-cyan-500 bg-opacity-80 shadow-lg rounded-lg p-2 w-${isExpanded ? '3/4' : '20'} transition-all`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center ms-3 space-x-2">
                <SiProbot className="text-3xl bg-gradient-to-r from-cyan-200  to-orange-300 text-red-800 rounded-full p-1" />
                <h2 className="text-lg font-semibold text-pink-900">AI Chatbot</h2>
              </div>
              <button onClick={() => setIsExpanded(!isExpanded)} className="p-2">
                {isExpanded ? <LuMinimize2 className="text-2xl bg-gradient-to-r from-cyan-200  to-orange-300 text-red-800 rounded-full p-1 " /> : <LuMaximize2 className="text-2xl bg-gradient-to-r from-cyan-200  to-orange-300 text-red-800 rounded-full p-1" />}
              </button>
            </div>

            {isExpanded && (
              <div className="grid grid-rows-5 h-64">
                <div className="rows-span-3 chatBox overflow-y-auto pr-2">
                  {chatMessages.map((message, index) => (
                    <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-2 w-3/4`}>
                      {message.type === 'ai' && <GiAstronautHelmet className="mr-2" />}
                      <p className={`text-sm ${message.type === 'user' ? 'text-blue-600' : 'text-gray-800'} bg-gray-100 p-2 rounded-lg`}>
                        {message.message}
                      </p>
                      {message.type === 'user' && <LuSend className="ml-2" />}
                    </div>
                  ))}
                </div>
                <div className="rows-span-2">
                  <div className="flex absolute w-2/4 mx-2 bottom-2 space-x-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      className="flex-1 p-2 border border-gradient-to-r from-cyan-200  to-orange-300  border-xl rounded-md"
                      placeholder="Type your message"
                    />
                    <button onClick={startRecognition} className="p-2 bg-gradient-to-r from-cyan-200  to-orange-300 text-red-800  rounded-full hover:bg-blue-700">
                      <FaMicrophoneAlt className="text-xl" />
                    </button>
                    <button onClick={handleSendMessage} className="p-2 bg-gradient-to-r from-cyan-200  to-orange-300 text-red-800  rounded-full hover:bg-blue-700">
                      <LuSend className="text-xl" />
                    </button>
                  </div>
                </div>
              </div>
            )}
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
            animation: typewriter 5s steps(40, end), blink 0.75s step-end infinite;
          }
          @keyframes blink {
            from, to { border-color: transparent; }
            50% { border-color: white; }
          }
          .chatBox {
            height: 190px;
            width: 400px;
          }
        
        `}</style>
      </div>
    </>
  );
};

export default FirstPage;
