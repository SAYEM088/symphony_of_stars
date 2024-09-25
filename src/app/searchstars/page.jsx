"use client"
import StarMap from '@/components/StarMap';
import React, { useEffect, useState } from 'react';
import starDataJson from '@/components/nasa_json/nasaStarsData.json';
const SearchStars = () => {
    const [starData, setStarData] = useState([]);

    useEffect(() => {
        setStarData(starDataJson);
    }, []);
    return (
        <div>
            {starData.length > 0 ? <StarMap  starData={starData} /> : <p className='text-center'>Loading...</p>}
            <footer style={{ position: 'absolute', right: 0, bottom: 0, width: '20%', background: 'rgba(0, 0, 0, 0.01)', color: 'white', padding: '10px', zIndex: 10 }}>
                <img src='/lines.png'></img>
            </footer>
        </div>
    );
};

export default SearchStars;