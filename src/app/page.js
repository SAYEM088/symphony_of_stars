"use client"
import { useState, useEffect } from 'react';
import StarMap from '../components/StarMap';
import starDataJson from '../components/data/starsData.json';

export default function Home() {
  const [starData, setStarData] = useState([]);

  useEffect(() => {
    setStarData(starDataJson);
  }, []);

  return (
    <div>
      {/* Navbar */}
      <nav style={{ position: 'absolute', top: 0, width: '20%', background: 'rgba(0, 0, 0, 0.01)', color: 'white', padding: '10px', zIndex: 10 }}>
        <h1>Star Map Navigation</h1>
      </nav>

      {/* StarMap as background */}
      {starData.length > 0 ? <StarMap starData={starData} /> : <p>Loading...</p>}

      {/* Footer */}
      <footer style={{ position: 'absolute', bottom: 0, width: '100%', background: 'rgba(0, 0, 0, 0.01)', color: 'white', padding: '10px', zIndex: 10 }}>
        <p>&copy; 2024 Space Exploration</p>
      </footer>
    </div>
  );
}
