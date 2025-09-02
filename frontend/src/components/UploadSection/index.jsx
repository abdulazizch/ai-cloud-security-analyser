import React, { useState } from 'react'
import {Upload} from 'lucide-react';

const UploadSection = ({fileInputRef}) => {
    const [fileUploadText, setFileUploadText] = useState('Drop files here or click to upload')

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileUploadText('File uploaded: '+ file.name);
        }
        else{
            setFileUploadText('Drop files here or click to upload')
        }
    };

  return (
    <>
        <div 
            className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center hover:border-blue-500/50 transition-all duration-300 cursor-pointer bg-gray-700/10"
            onClick={() => fileInputRef.current?.click()}
        >
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg mb-2">{fileUploadText}</p>
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
    </>
  )
}

export default UploadSection