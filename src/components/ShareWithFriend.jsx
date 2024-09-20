import React, { useState } from 'react';
import emailjs from 'emailjs-com'; 
import Navbar from './Navbar';

const ShareWithFriend = ({ composition, onClose }) => {
    const [email, setEmail] = useState('');
    const [emailSent, setEmailSent] = useState(false);

    const handleSendEmail = () => {
        const templateParams = {
            to_email: email,
            message: `Check out this music composition: ${composition.join(', ')}`,
        };

        emailjs.send(
            'service_6rqp5ln',  
            'template_n8788bb',   
            templateParams,
            'VJj5P0rOsntq8kNtD'  
        )
        .then((response) => {
            console.log('Email sent successfully', response.status, response.text);
            setEmailSent(true);
        })
        .catch((error) => {
            console.error('Error sending email:', error.text || error);
        });
    };

    return (
        <>
        <Navbar/>
        <div className="fixed top-1/2 z-20 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="mb-4">Share Composition</h2>
                {!emailSent ? (
                    <>
                        <input
                            type="email"
                            placeholder="Enter friend's email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border border-gray-300 p-2 rounded mb-4 w-full"
                        />
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={handleSendEmail}
                                className="bg-blue-500 text-white p-2 rounded"
                            >
                                Send
                            </button>
                            <button
                                onClick={onClose}
                                className="bg-red-500 text-white p-2 rounded"
                            >
                                Close
                            </button>
                        </div>
                    </>
                ) : (
                    <div>
                        <p>Email sent successfully!</p>
                        <button
                            onClick={onClose}
                            className="bg-blue-500 text-white p-2 rounded mt-4"
                        >
                            Close
                        </button>
                    </div>
                )}
            </div>
        </div>
        </>
    );
};

export default ShareWithFriend;
