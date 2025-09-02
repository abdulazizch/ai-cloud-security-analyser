import React from 'react'

const PasteCodeSection = ({setCodeInput, codeInput}) => {
  return (
    <>
        <div className="space-y-4">
            <textarea
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value)}
            placeholder="Paste your source code here..."
            className="w-full h-64 p-4 bg-gray-800/50 border border-gray-600 rounded-xl text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
        </div>
    </>
  )
}

export default PasteCodeSection