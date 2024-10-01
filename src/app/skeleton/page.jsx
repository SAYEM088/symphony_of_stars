"use client"
import React, { useState } from 'react';
import axios from 'axios';

const Page = () => {
  const [inputValue, setInputValue] = useState('');

  const postToDB = async () => {
    console.log(inputValue)
    try {
      const response = await axios.post('http://localhost:3000/api/mongo', {
        data: inputValue,
      });
      console.log('Data sent:', response.data);
    } catch (error) {
      console.error('Error posting data:', error);
    }
  };

  return (
    <div>
      <input 
        type="text" 
        className='h-80 m-5 w-5/6' 
        value={inputValue} 
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button className='bg-green-500 p-5' onClick={postToDB}>Push</button>
    </div>
  );
};

export default Page;
