import React, { useEffect, useState } from 'react'
import { FileText } from 'lucide-react'
import axios from 'axios'
import AnalysisResult from '../../components/AnalysisResult'

const PastReports = ({ isDarkMode }) => {
  const [reports, setReports] = useState([])
  const [findings, setFindings] = useState([])
  const [activeFile, setActiveFile] = useState('')

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get("http://localhost:8000/reports-list/")
        setReports(res.data.reports)
      } catch (err) {
        console.error("Error fetching reports:", err)
      }
    }
    fetchReports()
  }, [])

  const handleReportClick = async (report) => {
    try {
      const res = await axios.get(`http://localhost:8000/report-file/?filename=${encodeURIComponent(report)}`)
      setFindings(res?.data?.findings)
      setActiveFile(res?.data?.metadata?.filename)
      // console.log(res.data)
    } catch (err) {
      console.error("Error fetching report file:", err)
    }
  }

  return (
    <div className={`backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6 ${
      isDarkMode 
        ? 'bg-gray-800/50 border-gray-700 shadow-gray-900/20' 
        : 'bg-white/70 border-gray-200 shadow-gray-500/10'
    }`}>
      <h2 className="text-xl font-semibold mb-6">Past Reports</h2>

      {reports.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-400">No previous reports found. Run an analysis to generate your first report.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {reports.map((report) => (
            <li
              key={report}
              className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-100/50 cursor-pointer"
              onClick={() => handleReportClick(report)}
            >
              <FileText className="w-5 h-5 text-gray-500" />
              <span>{report}</span>
            </li>
          ))}
        </ul>
      )}

      <div className='mt-10'>
        {findings.length > 0 && (
          <AnalysisResult analysisResults={findings} isDarkMode={isDarkMode} fileName= {activeFile} />
        )}
      </div>
    </div>
  )
}

export default PastReports
