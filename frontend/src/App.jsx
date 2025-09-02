import React, { useState, useEffect } from 'react';
import Routers from './Router/Routers';
// import Topbar from './layout/Topbar';
import Header from './layout/Header';
// import Footer from './layout/Footer';
import './App.scss';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  useEffect(() => {
    const storedMode = localStorage.getItem('themeMode');
    if (storedMode !== null) {
      setIsDarkMode(storedMode === 'true');
    }
  }, []);

  const themeClasses = isDarkMode 
      ? 'bg-gray-900 text-white' 
      : 'bg-gray-50 text-gray-900';


  return (
      <div className={`min-h-screen transition-all duration-300 ${themeClasses}`}>
        {/* <Topbar/> */}
        <Header setIsDarkMode={setIsDarkMode} isDarkMode={isDarkMode}/>
        <main className="max-w-7xl mx-auto px-6 py-8">
          <Routers isDarkMode={isDarkMode}/>
        </main>
        {/* <Footer/> */}
      </div>
  );
}

export default App;
