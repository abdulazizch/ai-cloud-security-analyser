import React, { useEffect, useState } from 'react'

const ScanLoader = ({scanProgress}) => {
  const [progress, setProgress] = useState(scanProgress > 85 ? scanProgress : 0);
  useEffect(() => {
    if (progress < 100) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev < 90) {
            return prev + 7;
          } else {
            clearInterval(interval);
            return 100;
          }
        });
      }, 200);

      return () => clearInterval(interval);
    }
  }, [progress]);

  return (
    <div className="backdrop-blur-xl bg-gray-800/30 rounded-2xl border border-gray-700/50 p-6">
        <div className="flex items-center space-x-4">
            <div className="w-8 h-8 border-3 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
            <div>
              <h3 className="font-semibold">AI Analysis in Progress</h3>
              <p className="text-sm text-gray-400">Scanning for vulnerabilities and security issues...</p>
            </div>
        </div>
        <div className="mt-4 bg-gray-700/50 rounded-full h-2">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full animate-pulse transition-all ease-in-out" style={{width: `${progress}%`}}></div>
        </div>
    </div>
  )
}

export default ScanLoader