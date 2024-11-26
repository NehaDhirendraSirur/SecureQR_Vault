import React, { useState } from 'react';
import jsQR from 'jsqr'; // Import jsQR for QR code decoding

const UploadDecrypt = () => {
  const [file, setFile] = useState(null);   // Store the uploaded file
  const [privateKey, setPrivateKey] = useState('');  // Store entered private key
  const [decryptedData, setDecryptedData] = useState(null); // Store decrypted data
  const [error, setError] = useState(''); // Store any error messages

  // Handle file upload
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle private key change
  const handlePrivateKeyChange = (e) => {
    setPrivateKey(e.target.value);
  };

  // Handle decryption logic
  const handleDecrypt = () => {
    if (!file) {
      alert('Please upload a QR code file first');
      return;
    }

    if (!privateKey) {
      alert('Please enter your private key');
      return;
    }

    // Create an image element to load the uploaded file
    const img = new Image();
    const reader = new FileReader();

    reader.onload = function(event) {
      img.src = event.target.result;  // Set the image source to the file data
    };

    reader.onerror = function() {
      setDecryptedData(null);
      setError('Error reading file');
    };

    reader.readAsDataURL(file);  // Read the file as a data URL

    img.onload = function() {
      // Create a canvas to extract pixel data
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the image onto the canvas
      ctx.drawImage(img, 0, 0, img.width, img.height);

      // Get the image data (pixel data) from the canvas
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, canvas.width, canvas.height);  // Pass pixel data to jsQR

      if (code) {
        const encryptedData = code.data; // Simulated encrypted data from QR code
        const actualPrivateKey = privateKey;  // Use the private key generated earlier

        // Simulate the decryption process by checking the private key
        if (privateKey === actualPrivateKey) {
          const decrypted = decryptData(encryptedData); // Simulate decryption function
          setDecryptedData(decrypted);
          setError('');
        } else {
          setDecryptedData(null);
          setError('Invalid private key');
        }
      } else {
        setDecryptedData(null);
        setError('No QR code found in the image');
      }
    };
  };

  // Simulated decryption function (replace with actual decryption logic)
  const decryptData = (encryptedData) => {
    // Directly returning the decrypted content
    return `Decrypted Content: ${encryptedData}`;  // Replace with actual decrypted data logic
  };

  return (
    <div className="upload-decrypt-container">
      <h2>Upload and Decrypt QR Code</h2>

      {/* File Upload */}
      <input type="file" onChange={handleFileChange} />
      
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

      {/* Error message if key is incorrect */}
      {error && <p className="error-message">{error}</p>}

      {/* Display decrypted data if private key is correct */}
      {decryptedData && (
        <div className="decrypted-data">
          <h3>Decrypted Data:</h3>
          <p>{decryptedData}</p>
        </div>
      )}
    </div>
  );
};

export default UploadDecrypt;
