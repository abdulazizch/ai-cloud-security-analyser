import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Play, 
  Search, 
  Filter, 
  Download, 
  FileText, 
  Code2, 
  Shield, 
  Moon, 
  Sun,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  FileCode,
  Clock,
  Users,
  BarChart3
} from 'lucide-react';

const SecurityAnalyzer = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [uploadMethod, setUploadMethod] = useState('file');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [codeInput, setCodeInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [expandedIssues, setExpandedIssues] = useState(new Set());
  const fileInputRef = useRef(null);

  // Mock data for demonstration
  const analysisResults = [
    {
      id: 1,
      filename: 'auth.js',
      line: 45,
      issueType: 'SQL Injection',
      severity: 'Critical',
      confidence: 95,
      recommendation: 'Use parameterized queries to prevent SQL injection attacks',
      codeSnippet: `const query = "SELECT * FROM users WHERE id = " + userId;
// Vulnerable: Direct string concatenation
db.query(query, callback);`
    },
    {
      id: 2,
      filename: 'config.py',
      line: 12,
      issueType: 'Hardcoded Secret',
      severity: 'High',
      confidence: 98,
      recommendation: 'Move sensitive data to environment variables',
      codeSnippet: `API_KEY = "sk-1234567890abcdef"  # Hardcoded secret
DATABASE_URL = "postgresql://user:pass@localhost/db"`
    },
    {
      id: 3,
      filename: 'validation.js',
      line: 78,
      issueType: 'XSS Vulnerability',
      severity: 'Medium',
      confidence: 87,
      recommendation: 'Sanitize user input before rendering in DOM',
      codeSnippet: `element.innerHTML = userInput;  // Potential XSS
// Should use textContent or proper sanitization`
    },
    {
      id: 4,
      filename: 'utils.py',
      line: 23,
      issueType: 'Weak Encryption',
      severity: 'Low',
      confidence: 76,
      recommendation: 'Use stronger encryption algorithms like AES-256',
      codeSnippet: `cipher = DES.new(key, DES.MODE_ECB)  # Weak encryption
# Consider using AES instead`
    }
  ];

  const getSeverityColor = (severity) => {
    const colors = {
      'Critical': 'text-red-400 bg-red-500/20 border-red-500/30',
      'High': 'text-orange-400 bg-orange-500/20 border-orange-500/30',
      'Medium': 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30',
      'Low': 'text-blue-400 bg-blue-500/20 border-blue-500/30'
    };
    return colors[severity] || 'text-gray-400 bg-gray-500/20 border-gray-500/30';
  };

  const getSeverityIcon = (severity) => {
    switch(severity) {
      case 'Critical': return '🔴';
      case 'High': return '🟠';
      case 'Medium': return '🟡';
      case 'Low': return '🔵';
      default: return '⚪';
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('File uploaded:', file.name);
    }
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setAnalysisComplete(false);
    
    // Simulate analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
    }, 3000);
  };

  const toggleIssueExpansion = (issueId) => {
    const newExpanded = new Set(expandedIssues);
    if (newExpanded.has(issueId)) {
      newExpanded.delete(issueId);
    } else {
      newExpanded.add(issueId);
    }
    setExpandedIssues(newExpanded);
  };

  const filteredResults = analysisResults.filter(result => {
    const matchesSearch = result.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.issueType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || result.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const themeClasses = isDarkMode 
    ? 'bg-gray-900 text-white' 
    : 'bg-gray-100 text-gray-900';

  return (
    <div className={`min-h-screen transition-all duration-300 ${themeClasses}`}>
      {/* Header */}
      <header className="border-b border-gray-700/50 backdrop-blur-xl bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  AI Cloud Security Analyzer
                </h1>
                <p className="text-sm text-gray-400">Advanced vulnerability detection for web applications</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <nav className="flex space-x-1">
                {['dashboard', 'reports', 'about'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg transition-all duration-200 capitalize ${
                      activeTab === tab 
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
              
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 transition-all duration-200"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Upload Section */}
            <div className="backdrop-blur-xl bg-gray-800/30 rounded-2xl border border-gray-700/50 p-6">
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
                <div 
                  className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center hover:border-blue-500/50 transition-all duration-300 cursor-pointer bg-gray-700/10"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg mb-2">Drop files here or click to upload</p>
                  <p className="text-sm text-gray-400">Supports ZIP archives, individual files, or folders</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    multiple
                    accept=".zip,.js,.py,.php,.java,.ts,.jsx,.tsx"
                    onChange={handleFileUpload}
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <textarea
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value)}
                    placeholder="Paste your source code here..."
                    className="w-full h-64 p-4 bg-gray-800/50 border border-gray-600 rounded-xl text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
              )}

              <div className="flex justify-center mt-6">
                <button
                  onClick={handleAnalyze}
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
            </div>

            {/* Analysis Progress */}
            {isAnalyzing && (
              <div className="backdrop-blur-xl bg-gray-800/30 rounded-2xl border border-gray-700/50 p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 border-3 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                  <div>
                    <h3 className="font-semibold">AI Analysis in Progress</h3>
                    <p className="text-sm text-gray-400">Scanning for vulnerabilities and security issues...</p>
                  </div>
                </div>
                <div className="mt-4 bg-gray-700/50 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full animate-pulse" style={{width: '65%'}}></div>
                </div>
              </div>
            )}

            {/* Results Panel */}
            {analysisComplete && (
              <div className="backdrop-blur-xl bg-gray-800/30 rounded-2xl border border-gray-700/50 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-green-400" />
                    Analysis Results
                  </h2>
                  
                  <div className="flex space-x-3">
                    <button className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-all duration-200 flex items-center space-x-2">
                      <Download className="w-4 h-4" />
                      <span>PDF Report</span>
                    </button>
                    <button className="px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-all duration-200 flex items-center space-x-2">
                      <FileText className="w-4 h-4" />
                      <span>JSON Export</span>
                    </button>
                  </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {['Critical', 'High', 'Medium', 'Low'].map((severity) => {
                    const count = analysisResults.filter(r => r.severity === severity).length;
                    return (
                      <div key={severity} className={`p-4 rounded-xl border ${getSeverityColor(severity)}`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm opacity-80">{severity}</p>
                            <p className="text-2xl font-bold">{count}</p>
                          </div>
                          <span className="text-2xl">{getSeverityIcon(severity)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Filters */}
                <div className="flex space-x-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search issues..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                  
                  <select
                    value={severityFilter}
                    onChange={(e) => setSeverityFilter(e.target.value)}
                    className="px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  >
                    <option value="all">All Severities</option>
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                {/* Issues List */}
                <div className="space-y-4">
                  {filteredResults.map((issue) => (
                    <div key={issue.id} className="bg-gray-700/30 rounded-xl border border-gray-600/50 overflow-hidden">
                      <div 
                        className="p-4 cursor-pointer hover:bg-gray-700/50 transition-all duration-200"
                        onClick={() => toggleIssueExpansion(issue.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            {expandedIssues.has(issue.id) ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                            <div>
                              <h4 className="font-semibold">{issue.issueType}</h4>
                              <p className="text-sm text-gray-400">{issue.filename}:{issue.line}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(issue.severity)}`}>
                              {getSeverityIcon(issue.severity)} {issue.severity}
                            </span>
                            <span className="text-sm text-gray-400">{issue.confidence}% confidence</span>
                          </div>
                        </div>
                      </div>
                      
                      {expandedIssues.has(issue.id) && (
                        <div className="px-4 pb-4 border-t border-gray-600/50">
                          <div className="mt-4">
                            <h5 className="font-medium mb-2">Recommendation:</h5>
                            <p className="text-sm text-gray-300 mb-4">{issue.recommendation}</p>
                            
                            <h5 className="font-medium mb-2">Code Snippet:</h5>
                            <pre className="bg-gray-800/50 p-3 rounded-lg text-sm overflow-x-auto">
                              <code>{issue.codeSnippet}</code>
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="backdrop-blur-xl bg-gray-800/30 rounded-2xl border border-gray-700/50 p-6">
            <h2 className="text-xl font-semibold mb-6">Past Reports</h2>
            <div className="text-center py-12">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-400">No previous reports found. Run an analysis to generate your first report.</p>
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="backdrop-blur-xl bg-gray-800/30 rounded-2xl border border-gray-700/50 p-6">
            <h2 className="text-xl font-semibold mb-6">About AI Cloud Security Analyzer</h2>
            <div className="space-y-6">
              <p className="text-gray-300">
                This MSc project demonstrates an advanced AI-powered security analysis tool designed to identify 
                vulnerabilities in web application source code. The system combines machine learning algorithms 
                with static code analysis to provide comprehensive security assessments.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-gray-700/30 rounded-xl">
                  <Shield className="w-8 h-8 text-blue-400 mb-3" />
                  <h3 className="font-semibold mb-2">Security First</h3>
                  <p className="text-sm text-gray-400">Advanced AI models trained on security best practices</p>
                </div>
                
                <div className="p-4 bg-gray-700/30 rounded-xl">
                  <Users className="w-8 h-8 text-green-400 mb-3" />
                  <h3 className="font-semibold mb-2">Developer Friendly</h3>
                  <p className="text-sm text-gray-400">Intuitive interface designed for security analysts</p>
                </div>
                
                <div className="p-4 bg-gray-700/30 rounded-xl">
                  <BarChart3 className="w-8 h-8 text-purple-400 mb-3" />
                  <h3 className="font-semibold mb-2">Comprehensive Reports</h3>
                  <p className="text-sm text-gray-400">Detailed analysis with actionable recommendations</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SecurityAnalyzer;