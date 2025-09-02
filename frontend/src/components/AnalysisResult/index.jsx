import React, { useState } from 'react';
import { Search, Download, FileText, ChevronDown, ChevronRight, BarChart3} from 'lucide-react';


const AnalysisResult = ({analysisResults, isDarkMode}) => {

    const [searchTerm, setSearchTerm] = useState('');
    const [severityFilter, setSeverityFilter] = useState('all');
    const [expandedIssues, setExpandedIssues] = useState(new Set());
    
    // Mock data for demonstration
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

    const toggleIssueExpansion = (issueId) => {
        const newExpanded = new Set(expandedIssues);
        if (newExpanded.has(issueId)) {
        newExpanded.delete(issueId);
        } else {
        newExpanded.add(issueId);
        }
        setExpandedIssues(newExpanded);
    };

    // const filteredResults = analysisResults.filter(result => {
    //     const matchesSearch = result.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //                         result.issueType.toLowerCase().includes(searchTerm.toLowerCase());
    //     const matchesSeverity = severityFilter === 'all' || result.severity === severityFilter;
    //     return matchesSearch && matchesSeverity;
    // });
    const filteredResults = Array.isArray(analysisResults)
    ? analysisResults.filter(result => {
        const filename = result.filename?.toLowerCase() || "";
        const issueType = result.issueType?.toLowerCase() || "";

        const matchesSearch =
            filename.includes(searchTerm.toLowerCase()) ||
            issueType.includes(searchTerm.toLowerCase());

        const matchesSeverity =
            severityFilter === "all" || result.severity === severityFilter;

        return matchesSearch && matchesSeverity;
        })
    : [];

    
  return (
    <div className={`backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6 ${
          isDarkMode 
            ? 'bg-gray-800/50 border-gray-700 shadow-gray-900/20' 
            : 'bg-white/70 border-gray-200 shadow-gray-500/10'
        }`}>
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
                className={`w-full pl-10 pr-4 py-2 rounded-lg  border focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                    isDarkMode 
                        ? 'bg-gray-800/50 border-gray-700' 
                        : 'bg-white/70 border-gray-200'
                    }`}
                />
            </div>
            
            <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className={`px-4 py-2 rounded-lg focus:outline-none border focus:ring-2 focus:ring-blue-500/50 ${
                isDarkMode 
                    ? 'bg-gray-800/50 border-gray-700' 
                    : 'bg-white/70 border-gray-200'
                }`}
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
                <div key={issue.id} className={`rounded-xl border overflow-hidden ${
                    isDarkMode 
                        ? 'bg-gray-800/50 border-gray-700' 
                        : 'bg-white/70 border-gray-200'
                    }`}>
                <div 
                    className={`p-4 cursor-pointer transition-all duration-200 ${isDarkMode ? `hover:bg-gray-700/50` : `hover:bg-gray-200/40`}`}
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
  )
}

export default AnalysisResult