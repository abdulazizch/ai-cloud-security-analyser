import React from 'react'
import { Shield, Users, BarChart3 } from 'lucide-react';

const About = ({isDarkMode}) => {
  return (
    <div className={`backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6 ${
          isDarkMode 
            ? 'bg-gray-800/50 border-gray-700 shadow-gray-900/20' 
            : 'bg-white/70 border-gray-200 shadow-gray-500/10'
        }`}>
    <h2 className="text-xl font-semibold mb-6">About AI Cloud Security Analyzer</h2>
    <div className="space-y-6">
        <p className="text-gray-300">
        This project demonstrates an advanced AI-powered security analysis tool designed to identify 
        vulnerabilities in web application source code. The system combines machine learning algorithms 
        with static code analysis to provide comprehensive security assessments.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`p-4 rounded-xl ${
          isDarkMode 
            ? 'bg-gray-800/50 border-gray-700 shadow-gray-900/20' 
            : 'bg-white/70 border border-gray-200 shadow-gray-500/10'
        }`}>
            <Shield className="w-8 h-8 text-blue-400 mb-3" />
            <h3 className="font-semibold mb-2">Security First</h3>
            <p className="text-sm text-gray-400">Advanced AI models trained on security best practices</p>
        </div>
        
        <div className={`p-4 rounded-xl ${
          isDarkMode 
            ? 'bg-gray-800/50 border-gray-700 shadow-gray-900/20' 
            : 'bg-white/70 border border-gray-200 shadow-gray-500/10'
        }`}>
            <Users className="w-8 h-8 text-green-400 mb-3" />
            <h3 className="font-semibold mb-2">Developer Friendly</h3>
            <p className="text-sm text-gray-400">Intuitive interface designed for security analysts</p>
        </div>
        
        <div className={`p-4 rounded-xl ${
          isDarkMode 
            ? 'bg-gray-800/50 border-gray-700 shadow-gray-900/20' 
            : 'bg-white/70 border border-gray-200 shadow-gray-500/10'
        }`}>
            <BarChart3 className="w-8 h-8 text-purple-400 mb-3" />
            <h3 className="font-semibold mb-2">Comprehensive Reports</h3>
            <p className="text-sm text-gray-400">Detailed analysis with actionable recommendations</p>
        </div>
        </div>
    </div>
    </div>
  )
}

export default About