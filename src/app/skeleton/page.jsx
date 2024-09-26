"use client"; // For client-side rendering
import { useState, useRef, useEffect } from 'react';

export default function Home() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [isSketchMode, setIsSketchMode] = useState(false);
  const canvasRef = useRef(null);

  // Function to handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImageUrl(URL.createObjectURL(file)); // Create a temporary URL for the image preview
    }
  };

  // Function to draw sketch outline
  const drawSketch = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("Canvas is not initialized yet!");
      return;
    }

    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = imageUrl;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the original image
      ctx.drawImage(img, 0, 0, img.width, img.height);

      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Convert image to grayscale and create outline effect
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3; // Average of R, G, B for grayscale
        data[i] = data[i + 1] = data[i + 2] = avg < 140 ? 0 : 200; // Convert to black and white for sketch effect
      }

      // Put image data back on canvas
      ctx.putImageData(imageData, 0, 0);
      setIsSketchMode(true);
    };

    img.onerror = () => {
      console.error("Error loading the image");
    };
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      {/* Input to pick an image */}
      <div style={{ marginBottom: '10px' }}>
        <input type="file" onChange={handleImageChange} />
      </div>

      {/* Button to generate the sketch outline */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={drawSketch}
          disabled={!selectedImage}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: selectedImage ? 'pointer' : 'not-allowed',
          }}
        >
          Generate Sketch Outline
        </button>
      </div>

      {/* Frame and margin for the selected image */}
      <div style={{ marginBottom: '20px' }}>
        {imageUrl && !isSketchMode && (
          <div
            style={{
              border: '2px solid #ccc',
              padding: '10px',
              display: 'inline-block',
              borderRadius: '10px',
              boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
            }}
          >
            <img
              src={imageUrl}
              alt="Selected"
              style={{ maxWidth: '100%', borderRadius: '8px' }}
            />
          </div>
        )}
      </div>

      {/* Frame and margin for the sketch outline */}
      <div>
        {imageUrl && (
          <div
            style={{
              border: '2px solid #000',
              padding: '10px',
              display: 'inline-block',
              borderRadius: '10px',
              backgroundColor: '#f8f8f8',
              boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
            }}
          >
            <canvas ref={canvasRef} style={{ maxWidth: '100%', borderRadius: '8px' }} />
          </div>
        )}
      </div>
    </div>
  );
}
