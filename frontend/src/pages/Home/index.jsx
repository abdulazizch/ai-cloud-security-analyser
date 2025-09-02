import React, { useState, useRef, useEffect } from 'react';
import { Upload, Play, Search, Download, FileText, Code2, ChevronDown, ChevronRight, FileCode, BarChart3} from 'lucide-react';
import UploadSection from '../../components/UploadSection';
import PasteCodeSection from '../../components/PasteCodeSection';
import ScanLoader from '../../components/ScanLoader';
import AnalysisResult from '../../components/AnalysisResult';
import { analyzeCode, analyzeFile } from "../../services/api/analyzer"

const Home = ({isDarkMode}) => {
  const [uploadMethod, setUploadMethod] = useState('file');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [codeInput, setCodeInput] = useState('');
  const [analysisResults, setAnalysisResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const fileInputRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [scanProgress, setScanProgress] = useState(0);

  const handleCodeAnalyze = async () => {
    setIsAnalyzing(true);
    setAnalysisComplete(false);

    try {
      const response = await analyzeCode(codeInput);
      setAnalysisResults(response?.data?.results);
      setFilteredResults(response?.data?.results);
      setScanProgress(100)
      setTimeout(() => {
        setIsAnalyzing(false);
        setAnalysisComplete(true);
      }, 1000);
      // console.log(response?.data?.results);
    } catch (error) {
      if (error.response?.status === 402) {
        setErrorMessage("Error");
      } else {
        console.error("Analysis Failed:", error);
      }
      setIsAnalyzing(false);
      setAnalysisComplete(true);
    }
  };

  const handleAnalyzeFile = async () => {
    if (!fileInputRef) {
      setErrorMessage("Please select a file first.");
      return;
    }

    setIsAnalyzing(true);
    try {
      const data = await analyzeFile(fileInputRef.current.files[0]);
      setAnalysisResults(data?.results);
      setFilteredResults(data?.results);
      
    } catch (err) {
      setErrorMessage("Analysis failed. Try again.");
      setIsAnalyzing(false);
      console.error(err);
    } finally {
      setScanProgress(100)
      setTimeout(() => {
        setIsAnalyzing(false);
        setAnalysisComplete(true);
      }, 1000);
    }

  };

  useEffect(() => {
    let results = [...analysisResults];

    if (severityFilter !== "all") {
      results = results.filter(r => r.severity === severityFilter);
    }

    if (searchTerm.trim() !== "") {
      results = results.filter(r =>
        r.issueType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.filename.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredResults(results);
  }, [searchTerm, severityFilter, analysisResults]);




  return (
    <div className="space-y-8">
      <div className={`p-8 rounded-2xl shadow-xl backdrop-blur-sm border ${
          isDarkMode 
            ? 'bg-gray-800/50 border-gray-700 shadow-gray-900/20' 
            : 'bg-white/70 border-gray-200 shadow-gray-500/10'
        }`}>
        <h2 className="text-xl font-semibold mb-6 flex items-center">
          <Upload className="w-5 h-5 mr-2 text-blue-400" />
          Upload Source Code
        </h2>
        
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setUploadMethod('file')}
            className={`px-4 py-2 rounded-lg transition-all duration-200 ${
              uploadMethod === 'file' 
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <FileCode className="w-4 h-4 inline mr-2" />
            Upload Files
          </button>
          <button
            onClick={() => setUploadMethod('paste')}
            className={`px-4 py-2 rounded-lg transition-all duration-200 ${
              uploadMethod === 'paste' 
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <Code2 className="w-4 h-4 inline mr-2" />
            Paste Code
          </button>
        </div>

        {uploadMethod === 'file' ? (
          <>
            <UploadSection fileInputRef={fileInputRef}/>
            <div className="flex justify-center mt-6">
              <button
                onClick={handleAnalyzeFile}
                disabled={isAnalyzing}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    <span>Start Analysis</span>
                  </>
                )}
              </button>
            </div>
          </>
        ) : (
          <>
            <PasteCodeSection setCodeInput={setCodeInput} codeInput={codeInput}/>
            <div className="flex justify-center mt-6">
              <button
                onClick={handleCodeAnalyze}
                disabled={isAnalyzing}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    <span>Start Analysis</span>
                  </>
                )}
              </button>
            </div>
          </>
        )} 

      </div>

      {isAnalyzing && (
        <ScanLoader progress={scanProgress}/>
      )}

      {analysisComplete && (
        <AnalysisResult analysisResults={analysisResults} isDarkMode={isDarkMode}/>
      )}

      
    </div>
  )
}

export default Home