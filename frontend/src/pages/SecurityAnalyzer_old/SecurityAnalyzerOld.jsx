import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Play, 
  Download, 
  Search, 
  Filter, 
  Moon, 
  Sun, 
  FileText, 
  Code, 
  Shield,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  BarChart3,
  History,
  Settings
} from 'lucide-react';

const SecurityAnalyzerOld = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasResults, setHasResults] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [codeInput, setCodeInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [expandedItems, setExpandedItems] = useState(new Set());
  const fileInputRef = useRef(null);

  // Mock analysis results
  const analysisResults = [
    {
      id: 1,
      filename: 'auth.py',
      lineNumber: 42,
      issueType: 'SQL Injection',
      severity: 'Critical',
      confidence: 0.95,
      recommendation: 'Use parameterized queries to prevent SQL injection attacks.',
      codeSnippet: `cursor.execute("SELECT * FROM users WHERE id = " + user_id)`
    },
    {
      id: 2,
      filename: 'config.js',
      lineNumber: 15,
      issueType: 'Hardcoded Secret',
      severity: 'High',
      confidence: 0.88,
      recommendation: 'Move sensitive credentials to environment variables.',
      codeSnippet: `const API_KEY = "sk-1234567890abcdef"`
    },
    {
      id: 3,
      filename: 'validation.py',
      lineNumber: 28,
      issueType: 'Input Validation',
      severity: 'Medium',
      confidence: 0.72,
      recommendation: 'Implement proper input sanitization for user data.',
      codeSnippet: `return eval(user_input)`
    },
    {
      id: 4,
      filename: 'headers.js',
      lineNumber: 8,
      issueType: 'Missing Security Headers',
      severity: 'Low',
      confidence: 0.65,
      recommendation: 'Add security headers like X-Frame-Options and CSP.',
      codeSnippet: `app.use(express.static('public'))`
    }
  ];

  const getSeverityIcon = (severity) => {
    switch (severity.toLowerCase()) {
      case 'critical': return '🟥';
      case 'high': return '🟧';
      case 'medium': return '🟨';
      case 'low': return '🟩';
      default: return '⚪';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'text-red-400 bg-red-900/20 border-red-500/30';
      case 'high': return 'text-orange-400 bg-orange-900/20 border-orange-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-900/20 border-yellow-500/30';
      case 'low': return 'text-green-400 bg-green-900/20 border-green-500/30';
      default: return 'text-gray-400 bg-gray-900/20 border-gray-500/30';
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // Simulate analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      setHasResults(true);
    }, 3000);
  };

  const toggleExpanded = (id) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const filteredResults = analysisResults.filter(result => {
    const matchesSearch = result.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.issueType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || 
                           result.severity.toLowerCase() === severityFilter.toLowerCase();
    return matchesSearch && matchesSeverity;
  });

  const severityCounts = analysisResults.reduce((acc, result) => {
    acc[result.severity.toLowerCase()] = (acc[result.severity.toLowerCase()] || 0) + 1;
    return acc;
  }, {});

  const theme = darkMode ? 'dark' : '';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`border-b backdrop-blur-sm sticky top-0 z-50 ${darkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-blue-500" />
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  AI Cloud Security Analyzer
                </h1>
              </div>
            </div>
            
            <nav className="flex items-center space-x-6">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  activeTab === 'dashboard' 
                    ? 'bg-blue-600 text-white' 
                    : darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('reports')}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  activeTab === 'reports' 
                    ? 'bg-blue-600 text-white' 
                    : darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <History className="h-4 w-4 inline mr-2" />
                Past Reports
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  activeTab === 'about' 
                    ? 'bg-blue-600 text-white' 
                    : darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                About
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Upload Section */}
            <div className={`p-8 rounded-2xl shadow-xl backdrop-blur-sm border ${
              darkMode 
                ? 'bg-gray-800/50 border-gray-700 shadow-gray-900/20' 
                : 'bg-white/70 border-gray-200 shadow-gray-500/10'
            }`}>
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <Upload className="h-6 w-6 mr-3 text-blue-500" />
                Upload Source Code
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* File Upload */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium opacity-80">Upload ZIP or Folder</label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all hover:scale-[1.02] ${
                      darkMode 
                        ? 'border-gray-600 hover:border-blue-500 bg-gray-800/30' 
                        : 'border-gray-300 hover:border-blue-400 bg-gray-50/50'
                    } ${uploadedFile ? 'border-green-500' : ''}`}
                  >
                    <Upload className="h-12 w-12 mx-auto mb-4 opacity-60" />
                    {uploadedFile ? (
                      <div>
                        <p className="text-green-500 font-medium">{uploadedFile.name}</p>
                        <p className="text-sm opacity-60">File uploaded successfully</p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-medium">Drop files here or click to browse</p>
                        <p className="text-sm opacity-60">Supports ZIP, folders, and individual files</p>
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".zip,.js,.py,.php,.java,.cs,.cpp,.rb,.go"
                  />
                </div>

                {/* Code Editor */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium opacity-80">Or Paste Code</label>
                  <div className={`rounded-xl border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                    <div className={`flex items-center px-4 py-2 border-b ${darkMode ? 'border-gray-600 bg-gray-800/50' : 'border-gray-300 bg-gray-100/50'} rounded-t-xl`}>
                      <Code className="h-4 w-4 mr-2 opacity-60" />
                      <span className="text-sm opacity-80">Code Editor</span>
                    </div>
                    <textarea
                      value={codeInput}
                      onChange={(e) => setCodeInput(e.target.value)}
                      placeholder="Paste your source code here..."
                      className={`w-full h-40 p-4 font-mono text-sm resize-none rounded-b-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        darkMode ? 'bg-gray-900/50 text-gray-300' : 'bg-white text-gray-900'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Analyze Button */}
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || (!uploadedFile && !codeInput.trim())}
                  className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                    isAnalyzing
                      ? 'bg-blue-600 text-white cursor-wait'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-xl'
                  }`}
                >
                  {isAnalyzing ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Analyzing...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Play className="h-5 w-5 mr-3" />
                      Start AI Analysis
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Results Section */}
            {(hasResults || isAnalyzing) && (
              <div className={`p-8 rounded-2xl shadow-xl backdrop-blur-sm border ${
                darkMode 
                  ? 'bg-gray-800/50 border-gray-700 shadow-gray-900/20' 
                  : 'bg-white/70 border-gray-200 shadow-gray-500/10'
              }`}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold flex items-center">
                    <BarChart3 className="h-6 w-6 mr-3 text-green-500" />
                    Analysis Results
                  </h2>
                  
                  {hasResults && (
                    <div className="flex space-x-3">
                      <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <Download className="h-4 w-4 mr-2" />
                        PDF Report
                      </button>
                      <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        <FileText className="h-4 w-4 mr-2" />
                        JSON Export
                      </button>
                    </div>
                  )}
                </div>

                {isAnalyzing && (
                  <div className="text-center py-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                    <p className="text-lg font-medium">AI is analyzing your code...</p>
                    <p className="text-sm opacity-60 mt-2">This may take a few moments</p>
                  </div>
                )}

                {hasResults && (
                  <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                      <div className={`p-4 rounded-xl ${darkMode ? 'bg-red-900/20 border border-red-500/30' : 'bg-red-50 border border-red-200'}`}>
                        <div className="text-2xl font-bold text-red-500">{severityCounts.critical || 0}</div>
                        <div className="text-sm opacity-80">Critical</div>
                      </div>
                      <div className={`p-4 rounded-xl ${darkMode ? 'bg-orange-900/20 border border-orange-500/30' : 'bg-orange-50 border border-orange-200'}`}>
                        <div className="text-2xl font-bold text-orange-500">{severityCounts.high || 0}</div>
                        <div className="text-sm opacity-80">High</div>
                      </div>
                      <div className={`p-4 rounded-xl ${darkMode ? 'bg-yellow-900/20 border border-yellow-500/30' : 'bg-yellow-50 border border-yellow-200'}`}>
                        <div className="text-2xl font-bold text-yellow-500">{severityCounts.medium || 0}</div>
                        <div className="text-sm opacity-80">Medium</div>
                      </div>
                      <div className={`p-4 rounded-xl ${darkMode ? 'bg-green-900/20 border border-green-500/30' : 'bg-green-50 border border-green-200'}`}>
                        <div className="text-2xl font-bold text-green-500">{severityCounts.low || 0}</div>
                        <div className="text-sm opacity-80">Low</div>
                      </div>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 opacity-60" />
                        <input
                          type="text"
                          placeholder="Search files or issues..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                            darkMode 
                              ? 'bg-gray-800/50 border-gray-600 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                      </div>
                      
                      <select
                        value={severityFilter}
                        onChange={(e) => setSeverityFilter(e.target.value)}
                        className={`px-4 py-2 rounded-lg border ${
                          darkMode 
                            ? 'bg-gray-800/50 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      >
                        <option value="all">All Severities</option>
                        <option value="critical">Critical</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>

                    {/* Results List */}
                    <div className="space-y-4">
                      {filteredResults.map((result) => (
                        <div
                          key={result.id}
                          className={`p-6 rounded-xl border transition-all hover:shadow-lg ${
                            darkMode 
                              ? 'bg-gray-800/30 border-gray-600 hover:bg-gray-800/50' 
                              : 'bg-white/70 border-gray-200 hover:bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 flex-1">
                              <span className="text-2xl">{getSeverityIcon(result.severity)}</span>
                              <div className="flex-1">
                                <div className="flex items-center space-x-3">
                                  <h3 className="font-semibold text-lg">{result.issueType}</h3>
                                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(result.severity)}`}>
                                    {result.severity}
                                  </span>
                                </div>
                                <p className="opacity-80 mt-1">
                                  <span className="font-medium">{result.filename}</span> : Line {result.lineNumber}
                                </p>
                                <p className="text-sm opacity-60 mt-1">
                                  Confidence: {Math.round(result.confidence * 100)}%
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => toggleExpanded(result.id)}
                              className={`p-2 rounded-lg transition-colors ${
                                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                              }`}
                            >
                              {expandedItems.has(result.id) ? (
                                <ChevronDown className="h-5 w-5" />
                              ) : (
                                <ChevronRight className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                          
                          {expandedItems.has(result.id) && (
                            <div className="mt-6 pt-6 border-t border-gray-600">
                              <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                  <h4 className="font-medium mb-3 text-blue-400">Recommendation</h4>
                                  <p className="text-sm opacity-80 leading-relaxed">
                                    {result.recommendation}
                                  </p>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-3 text-orange-400">Code Snippet</h4>
                                  <div className={`p-4 rounded-lg font-mono text-sm ${
                                    darkMode ? 'bg-gray-900/50' : 'bg-gray-100'
                                  }`}>
                                    <code>{result.codeSnippet}</code>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {filteredResults.length === 0 && (
                      <div className="text-center py-12">
                        <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
                        <h3 className="text-xl font-semibold mb-2">No Issues Found</h3>
                        <p className="opacity-60">Your code appears to be secure based on the current filter criteria.</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'reports' && (
          <div className={`p-8 rounded-2xl shadow-xl backdrop-blur-sm border ${
            darkMode 
              ? 'bg-gray-800/50 border-gray-700 shadow-gray-900/20' 
              : 'bg-white/70 border-gray-200 shadow-gray-500/10'
          }`}>
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <History className="h-6 w-6 mr-3 text-purple-500" />
              Past Reports
            </h2>
            <div className="text-center py-16">
              <Clock className="h-16 w-16 mx-auto mb-4 opacity-40" />
              <h3 className="text-xl font-semibold mb-2">No Past Reports</h3>
              <p className="opacity-60">Your analysis history will appear here once you start running security scans.</p>
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className={`p-8 rounded-2xl shadow-xl backdrop-blur-sm border ${
            darkMode 
              ? 'bg-gray-800/50 border-gray-700 shadow-gray-900/20' 
              : 'bg-white/70 border-gray-200 shadow-gray-500/10'
          }`}>
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <Info className="h-6 w-6 mr-3 text-blue-500" />
              About AI Cloud Security Analyzer
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-lg leading-relaxed opacity-90">
                This AI-powered security analyzer is designed to help developers and security professionals 
                identify potential vulnerabilities in web application source code. Using advanced machine 
                learning techniques, it can detect various security issues including SQL injection, 
                cross-site scripting (XSS), insecure configurations, and more.
              </p>
              
              <div className="grid md:grid-cols-2 gap-8 mt-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-blue-400">Key Features</h3>
                  <ul className="space-y-2 opacity-80">
                    <li>• AI-powered vulnerability detection</li>
                    <li>• Support for multiple programming languages</li>
                    <li>• Detailed security recommendations</li>
                    <li>• Confidence scoring for each finding</li>
                    <li>• Exportable reports (PDF, JSON)</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-green-400">Supported Languages</h3>
                  <ul className="space-y-2 opacity-80">
                    <li>• Python</li>
                    <li>• JavaScript/Node.js</li>
                    <li>• Java</li>
                    <li>• PHP</li>
                    <li>• C#/.NET</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SecurityAnalyzerOld;