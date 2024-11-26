import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import forge from 'node-forge';

const GenerateKeys = () => {
  const [dataType, setDataType] = useState('text');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedText, setUploadedText] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Generate RSA Keys
  const handleGenerateKeys = () => {
    const keyPair = forge.pki.rsa.generateKeyPair({ bits: 2048 });
    setPublicKey(forge.pki.publicKeyToPem(keyPair.publicKey));
    setPrivateKey(forge.pki.privateKeyToPem(keyPair.privateKey));
  };

  // Copy public key to clipboard
  const handleCopyPublicKey = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey);
      alert('Public key copied to clipboard!');
    } else {
      alert('Please generate the keys first!');
    }
  };

  // Copy private key to clipboard
  const handleCopyPrivateKey = () => {
    if (privateKey) {
      navigator.clipboard.writeText(privateKey);
      alert('Private key copied to clipboard!');
    } else {
      alert('Please generate the keys first!');
    }
  };

  // Handle data type selection
  const handleDataTypeChange = (e) => {
    setDataType(e.target.value);
    setUploadedFile(null);
    setUploadedText('');
    setError('');
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (
        (dataType === 'image' && file.type.startsWith('image/')) ||
        (dataType === 'pdf' && file.type === 'application/pdf') ||
        (dataType === 'text' && file.type === 'text/plain')
      ) {
        setUploadedFile(file);
        setError('');
      } else {
        setError(`Invalid file type for ${dataType}.`);
      }
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!publicKey || !privateKey) {
      alert('Please generate the keys before submitting.');
      return;
    }
    if (dataType === 'text' && !uploadedFile && !uploadedText.trim()) {
      setError('Please provide text input or upload a text file.');
      return;
    }
    if (dataType !== 'text' && !uploadedFile) {
      setError(`Please upload a valid ${dataType} file.`);
      return;
    }

    setError('');
    navigate('/encrypt-data', {
      state: {
        uploadedFile,
        uploadedText,
        dataType,
        publicKey,
        privateKey,  // Pass the private key as well
      },
    });
  };

  return (
    <div className="generate-keys">
      <h2>Generate RSA Keys</h2>

      <div className="key-section">
        <button className="btn" onClick={handleGenerateKeys}>
          Generate Keys
        </button>
        {publicKey && (
          <div className="key-display">
            <h3>Your Public Key:</h3>
            <textarea readOnly value={publicKey} rows="6" cols="50" />
            <button className="btn" onClick={handleCopyPublicKey}>
              Copy Public Key
            </button>
          </div>
        )}
        {privateKey && (
          <div className="key-display">
            <h3>Your Private Key:</h3>
            <textarea readOnly value={privateKey} rows="6" cols="50" />
            <button className="btn" onClick={handleCopyPrivateKey}>
              Copy Private Key
            </button>
          </div>
        )}
      </div>

      <div className="data-section">
        <h3>Upload Data for Encryption</h3>
        <label>
          Select Data Type:
          <select value={dataType} onChange={handleDataTypeChange}>
            <option value="text">Text</option>
            <option value="image">Image</option>
            <option value="pdf">PDF</option>
          </select>
        </label>

        {dataType === 'text' ? (
          <textarea
            placeholder="Enter text here..."
            value={uploadedText}
            onChange={(e) => setUploadedText(e.target.value)}
            rows="4"
            cols="50"
          />
        ) : (
          <input
            type="file"
            accept={
              dataType === 'image'
                ? 'image/*'
                : dataType === 'pdf'
                ? 'application/pdf'
                : 'text/plain'
            }
            onChange={handleFileUpload}
          />
        )}
      </div>

      {error && <p className="error">{error}</p>}

      <button className="btn submit-btn" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
};

export default GenerateKeys;
