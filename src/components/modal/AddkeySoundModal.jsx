import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';

const AddKeySoundModal = ({ isOpen, onClose, onUpload }) => {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = () => {
        if (file) {
            onUpload(file);
            onClose(); // Only close if the file is uploaded
        } else {
            alert("Please select a file to upload.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center transition-opacity duration-300 ease-in-out">
            <div className="relative bg-white p-6 rounded-lg shadow-lg transform scale-100 transition-transform duration-300 ease-out w-full max-w-md">
                {/* Close Button */}
                <button 
                    onClick={onClose} 
                    className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 transition-colors duration-200 ease-in-out"
                >
                    <IoClose size={24} />
                </button>

                <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload Your Sound</h2>
                <input 
                    type="file" 
                    accept="audio/*" 
                    onChange={handleFileChange} 
                    className="mb-4 border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {file && <p className="text-gray-600 mb-2">Selected: {file.name}</p>}
                <div className="mt-4 flex justify-end space-x-2">
                    <button 
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 ease-in-out"
                        onClick={handleUpload}
                    >
                        Upload
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

export default AddKeySoundModal;
