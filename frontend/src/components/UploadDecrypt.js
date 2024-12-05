import React, { useState } from 'react';
import jsQR from 'jsqr'; // Import jsQR for QR code decoding
import { useLocation } from 'react-router-dom';

const UploadDecrypt = () => {
  const location=useLocation();
  const [file, setFile] = useState(null); // Store the uploaded file
  const [privateKey, setPrivateKey] = useState(''); // Store the entered private key
  const { uploadedFile, uploadedText, dataType, publicKey } = location.state || {};
  const [decryptedData, setDecryptedData] = useState(''); // Store decrypted data
  const [error, setError] = useState(''); // Store error messages
  const [flag, setFlag] = useState(false);
  
  // Handle file upload
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
    setDecryptedData('');
  };

  // Handle private key input
  const handlePrivateKeyChange = (e) => {
    setPrivateKey(e.target.value);
    setError('');
  };

  // Decrypt the QR code
  const handleDecrypt = () => {
    setFlag(true);
    if (!file) {
      setError('Please upload a QR code file first.');
      return;
    }

    if (!privateKey) {
      setError('Please enter your private key.');
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, canvas.width, canvas.height);

        if (code && code.data) {
          // Simulate decryption logic
          const decrypted = decryptData(code.data, privateKey);
          if (decrypted) {
            setDecryptedData(decrypted);
            setError('');
          } else {
            setError('Invalid private key. Unable to decrypt data.');
          }
        } else {
          setError('No valid QR code found in the image.');
        }
      };

      img.onerror = () => {
        setError('Failed to load the image. Please upload a valid file.');
      };

      img.src = reader.result;
    };

    reader.onerror = () => {
      setError('Failed to read the file. Please try again.');
    };

    reader.readAsDataURL(file);
  };

  // Simulated decryption function
  const decryptData = (encryptedData, key) => {
    // Example decryption logic (replace this with real decryption logic)
    if (key === 'correct-private-key') {
      return `Decrypted Content: ${encryptedData}`;
    }
    return null; // Return null if decryption fails
  };

  return (
    <div className="upload-decrypt-container">
      <h2>Upload and Decrypt QR Code</h2>

      {/* File Upload */}
      <input type="file" accept="image/*" onChange={handleFileChange} />

      {/* Input for Private Key */}
      <div className="private-key-input">
        <label htmlFor="privateKey">Enter Private Key:</label>
        <input
          type="password"
          id="privateKey"
          value={privateKey}
          onChange={handlePrivateKeyChange}
          placeholder="Enter your private key"
        />
      </div>

      {/* Decrypt Button */}
      <button onClick={handleDecrypt}>Decrypt QR Code</button>

      {/* Decrypted Data */}
      { flag &&(
        // <div className="decrypted-data">
        //   <h3>Decrypted Data:</h3>
        //   <p>{uploadeddata}</p>
        // </div>



<div className="decrypted-data">
<h3>Uploaded Data:</h3>
{dataType === 'text' ? (
  <textarea value={uploadedText} readOnly rows="6" cols="50" />
) : dataType === 'image' ? (
  <img
    src={URL.createObjectURL(uploadedFile)}
    alt="Uploaded"
    style={{ maxWidth: '300px', maxHeight: '300px' }}
  />
) : dataType === 'pdf' ? (
  <embed
    src={URL.createObjectURL(uploadedFile)}
    type="application/pdf"
    width="300"
    height="400"
  />
) : (
  <p>No data uploaded.</p>
)}
</div>
      )}
    </div>
  );
};

export default UploadDecrypt ;
