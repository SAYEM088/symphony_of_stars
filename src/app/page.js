"use client"
import FirstPage from '@/components/FirstPage';
import Navbar from '@/components/Navbar';
export default function Home() {

  return (
    <div>
    <Navbar></Navbar>
    <FirstPage/>
      <footer style={{ position: 'absolute', bottom: 0, width: '20%', background: 'rgba(0, 0, 0, 0.01)', color: 'white', padding: '10px', zIndex: 10 }}>
        <p>&copy; 2024 Space Exploration</p>
      </footer>

    </div>
  );
}
