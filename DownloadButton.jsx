
import React from 'react';
import axios from 'axios';

export default function DownloadButton() {
  const downloadZip = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/download', {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'tracks.zip');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Download failed:', error);
      alert("Download failed: Could not retrieve the ZIP file.");
    }
  };

  return (
    <button onClick={downloadZip} style={{ padding: '10px 20px', margin: '20px 0', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
      Download ZIP
    </button>
  );
}
