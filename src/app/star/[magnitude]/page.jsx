"use client"
import { useEffect, useState, useRef } from 'react';
import starDataJson from '@/components/data/starsData.json';

const Page = () => {
    const BackgroundMusic = '/m2.wav'; 
    const [magnitude, setMagnitude] = useState('');
    const [starData, setStarData] = useState(null);
    const [svgImage, setSvgImage] = useState('');
    const containerRef = useRef(null);
    const [scale, setScale] = useState(1); // Manage zoom level

    useEffect(() => {
        const url = window.location.href;
        const parts = url.split('/');
        const magnitudePart = parts[parts.length - 1];
        setMagnitude(magnitudePart);

        const data = starDataJson.find(star => star.magnitude.toString() === magnitudePart);
        setStarData(data);

        if (data) {
            if (data.imgSVG === 1) {
                setSvgImage('/p1.svg');
            } else if (data.imgSVG === 2) {
                setSvgImage('/p2.svg');
            } else if (data.imgSVG === 3) {
                setSvgImage('/p3.svg');
            }
        }
    }, [magnitude]);

    // Zoom handler
    const handleWheel = (e) => {
        e.preventDefault();

        const zoomIntensity = 0.1; // Change this for faster or slower zoom
        let newScale = scale + (e.deltaY > 0 ? -zoomIntensity : zoomIntensity);

        // Prevent zooming out beyond original size (scale 1)
        if (newScale < 1) newScale = 1;
        if (newScale > 5) newScale = 5; // Max zoom level
        
        setScale(newScale);
    };

    return (
        <div 
            ref={containerRef}
            onWheel={handleWheel} // Listen for wheel scroll to zoom
            style={{
                backgroundImage: `url(${svgImage})`,
                backgroundSize: `${scale * 100}%`, // Adjust zoom level
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                height: '100vh',
                width: '100vw',
                overflow: 'hidden',
                position: 'relative',
            }}
        >
            {/* Info box */}
            <div style={{
                position: 'fixed',
                bottom: 0,
                width: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                padding: '20px',
                textAlign: 'center',
                zIndex: 1,
            }}>
                {starData ? (
                    <div>
                        <h2>Star Details:</h2>
                        <p><strong>Designation:</strong> {starData.designation}</p>
                        <p><strong>Constellation:</strong> {starData.constellation}</p>
                        <p><strong>RA (hours):</strong> {starData.RA_hour}</p>
                        <p><strong>RA (minutes):</strong> {starData.RA_min}</p>
                        <p><strong>Dec (degrees):</strong> {starData.dec_deg}</p>
                        <p><strong>Magnitude:</strong> {starData.magnitude}</p>
                    </div>
                ) : (
                    <p>No star data found for magnitude {magnitude}</p>
                )}

                {/* Background music */}
                <audio src={BackgroundMusic} autoPlay loop controls style={{ marginTop: '20px' }}>
                    Your browser does not support the audio element.
                </audio>
            </div>
        </div>
    );
}

export default Page;
