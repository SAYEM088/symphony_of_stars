"use client"
import { useState, useEffect } from 'react';
import StarMap from '../components/StarMap';
import starDataJson from '../components/data/starsData.json';

import Navbar from '@/components/Navbar';
export default function Home() {
  const [starData, setStarData] = useState([]);

  useEffect(() => {
    setStarData(starDataJson);
  }, []);

  return (
    <div>
      {/* Navbar */}
    <Navbar></Navbar>

      {/* StarMap as background */}
      {starData.length > 0 ? <StarMap starData={starData} /> : <p>Loading...</p>}

      {/* Footer */}
      <footer style={{ position: 'absolute', bottom: 0, width: '20%', background: 'rgba(0, 0, 0, 0.01)', color: 'white', padding: '10px', zIndex: 10 }}>
        <p>&copy; 2024 Space Exploration</p>
      </footer>
      <footer style={{ position: 'absolute', right:0, bottom: 0, width: '20%', background: 'rgba(0, 0, 0, 0.01)', color: 'white', padding: '10px', zIndex: 10 }}>
        <img src='/lines.png'></img>
      </footer>
    </div>
  );
}
