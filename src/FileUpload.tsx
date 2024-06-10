import React, { useState } from 'react';
import axios from 'axios';
import { FaUpload } from 'react-icons/fa';
import io from 'socket.io-client';

interface FileUploadProps {
  sessionId: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ sessionId }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleFileUpload = async () => {
    console.log('handleFileUpload called'); // Debugging log
    if (file) {
      console.log('File selected:', file.name); // Debugging log
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('sessionId', sessionId);

      try {
        const response = await axios.post('http://localhost:6789/upload_resume', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const resumeText = response.data.resume_text;

        // Emit the resume text to the server to integrate into the session context
        const socket = io();
        socket.emit('uploadResume', { sessionId, resumeText });

        // Reset file state after successful upload
        setFile(null);

        // Notify the user about successful upload
        alert('Resume uploaded successfully!');
      } catch (error) {
        console.error('Error uploading file:', error);
        alert('Failed to upload resume. Please try again.');
      } finally {
        setUploading(false);
      }
    } else {
      alert('No file selected. Please choose a file to upload.');
    }
  };

  return (
    <div className="file-upload flex flex-col items-center">
      <p className="mb-4 text-xl font-semibold text-center text-blue-600">
        {file ? `File selected: ${file.name}` : '🙋🏽‍♂️ Hey you! Click on the button below to upload your resume'}
      </p>
      <label htmlFor="resume-upload" className="upload-label flex flex-col items-center cursor-pointer">
        <input
          type="file"
          id="resume-upload"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <div className="upload-button flex items-center justify-center p-4 border border-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition duration-200">
          <FaUpload className="upload-icon mr-2" />
          <span className="upload-text">{file ? 'Change File' : 'Choose File'}</span>
        </div>
      </label>
      <button
        className="upload-submit mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
        onClick={handleFileUpload}
        disabled={uploading}
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
};

export default FileUpload;
