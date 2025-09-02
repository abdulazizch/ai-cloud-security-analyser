import React from 'react'
import { FileText } from 'lucide-react'

const PastReports = ({isDarkMode}) => {
  return (
    <div className={`backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6 ${
          isDarkMode 
            ? 'bg-gray-800/50 border-gray-700 shadow-gray-900/20' 
            : 'bg-white/70 border-gray-200 shadow-gray-500/10'
        }`}>
        <h2 className="text-xl font-semibold mb-6">Past Reports</h2>
        <div className="text-center py-12">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-400">No previous reports found. Run an analysis to generate your first report.</p>
        </div>
    </div>
  )
}

export default PastReports