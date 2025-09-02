import {React, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Shield, Moon, Sun} from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = ({ setIsDarkMode, isDarkMode })  => {
  const [activeTab, setActiveTab] = useState('/');

  const handleToggle = () => {
    setIsDarkMode(prev => !prev);
    localStorage.setItem('themeMode', !isDarkMode)
  };

  const navLinks = [
    {
      navlink: 'Home',
      path: '/'
    },
    {
      navlink: 'Past Reports',
      path: '/reports'
    },
    {
      navlink: 'About',
      path: '/about'
    }
  ];

  const location = useLocation(); // gives the current URL

  useEffect(() => {
    // Get the last non-empty segment after "/"
    const segments = location.pathname.split('/').filter(Boolean); // removes empty strings
    const lastSegment = segments.length > 0 ? `/${segments[segments.length - 1]}` : '/';

    setActiveTab(lastSegment);
  }, [location]);


  return (
    <>
      <header className={`border-b border-gray-700/50 backdrop-blur-xl bg-gray-800/50 ${isDarkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-gray-100'}`}>
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  AI Cloud Security Analyzer
                </h1>
                <p className="text-xs text-gray-400">Advanced vulnerability detection for web applications</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <nav className="flex space-x-1">
                {navLinks.map((navItem, index) => (
                  <Link
                    key={index}
                    className={`px-4 py-2 rounded-lg transition-all duration-200 capitalize border ${
                      activeTab === navItem.path
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                        : isDarkMode
                          ? 'text-gray-300 hover:text-white hover:bg-gray-700 border-blue-500/0'
                          : 'border-blue-500/0 text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    to={navItem.path}
                  >
                    {navItem.navlink}
                  </Link>
                ))}

              </nav>
              
              <button
                onClick={handleToggle}
                className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}

export default Header