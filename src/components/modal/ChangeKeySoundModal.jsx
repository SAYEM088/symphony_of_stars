import React, { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';

const ChangeKeySoundModal = ({ isOpen, onClose, onUpdate, keyMappings }) => {
    const [selectedKey, setSelectedKey] = useState('f'); // Set default key
    const [file, setFile] = useState(null);

    useEffect(() => {
        // Check if keyMappings and selectedKey exist
        if (keyMappings && keyMappings[selectedKey]) {
            setFile(keyMappings[selectedKey]);
        } else {
            setFile(null); // Reset file if no mapping found
        }
    }, [selectedKey, keyMappings]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpdate = () => {
        onUpdate(selectedKey, file);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed z-50 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                {/* Close Button */}
                <button 
                    onClick={onClose} 
                    className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 transition-colors duration-200 ease-in-out"
                >
                    <IoClose size={24} />
                </button>

                <h2 className="text-xl mb-4">Change Key Sound</h2>
                
                <select 
                    onChange={(e) => setSelectedKey(e.target.value)} 
                    value={selectedKey} 
                    className="border border-gray-300 rounded p-2 w-full mb-4"
                >
                    {Object.keys(keyMappings || {}).map((key) => (
                        <option key={key} value={key}>{key}</option>
                    ))}
                </select>

                <input 
                    type="file" 
                    accept="audio/*" 
                    onChange={handleFileChange} 
                    className="mt-4 w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <div className="mt-4 flex justify-end space-x-2">
                    <button 
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 ease-in-out"
                        onClick={handleUpdate}
                    >
                        Update
                    </button>
                    <button 
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 ease-in-out"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChangeKeySoundModal;
