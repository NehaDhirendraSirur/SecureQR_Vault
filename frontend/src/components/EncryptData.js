import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import forge from 'node-forge';

const EncryptData = () => {
  const location = useLocation();
  const { uploadedFile, uploadedText, dataType, publicKey } = location.state || {};
  const [userPublicKey, setUserPublicKey] = useState(publicKey || '');
  const [qrReference, setQrReference] = useState('');
  const [timer, setTimer] = useState(60);
  const [isQrVisible, setIsQrVisible] = useState(true);

  useEffect(() => {
    if (qrReference) {
      const countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev > 0) return prev - 1;
          else {
            setIsQrVisible(false);
            return 0;
          }
        });
      }, 1000);

      return () => clearInterval(countdown);
    }
  }, [qrReference]);

  const handleEncrypt = async () => {
    if (!userPublicKey) {
      alert('Public key is missing!');
      return;
    }

    const pubKey = forge.pki.publicKeyFromPem(userPublicKey);
    let dataToEncrypt = '';

    if (dataType === 'text') {
      dataToEncrypt = uploadedText || '';
      await performHybridEncryption(pubKey, dataToEncrypt);
    } else if (uploadedFile) {
      const reader = new FileReader();
      reader.onload = async () => {
        dataToEncrypt = reader.result;
        await performHybridEncryption(pubKey, dataToEncrypt);
      };
      reader.readAsBinaryString(uploadedFile);
    } else {
      alert('No data uploaded!');
    }
  };

  const performHybridEncryption = async (pubKey, data) => {
    // Generate AES key
    const aesKey = forge.random.getBytesSync(32); // 256-bit AES key
    const iv = forge.random.getBytesSync(16); // Initialization Vector

    // Encrypt data with AES
    const cipher = forge.cipher.createCipher('AES-CBC', aesKey);
    cipher.start({ iv });
    cipher.update(forge.util.createBuffer(data));
    cipher.finish();
    const aesEncryptedData = cipher.output.bytes();

    // Encrypt AES key with RSA
    const rsaEncryptedKey = pubKey.encrypt(aesKey, 'RSA-OAEP');

    // Combine AES-encrypted data and RSA-encrypted AES key
    const encryptedPackage = {
      iv: forge.util.encode64(iv),
      encryptedKey: forge.util.encode64(rsaEncryptedKey),
      data: forge.util.encode64(aesEncryptedData),
    };

    // Simulate storing the encrypted payload and generating a reference (e.g., URL or ID)
    const simulatedStorageUrl = `https://example.com/storage/${Date.now()}`;
    console.log('Storing data at:', simulatedStorageUrl);
    setQrReference(simulatedStorageUrl);
    setTimer(60); // Reset the timer
    setIsQrVisible(true); // Show the QR code again after encryption
  };

  const handleDownloadQRCode = () => {
    const canvas = document.getElementById('qr-code');
    const url = canvas.toDataURL('image/png'); // Get image URL from QR code canvas
    const link = document.createElement('a');
    link.href = url;
    link.download = 'qrcode.png'; // Trigger download
    link.click();
  };

  const handleRegenerateQRCode = () => {
    setQrReference(''); // Clear current QR code
    setIsQrVisible(false); // Hide it temporarily
    setTimer(60); // Reset the timer for the next encryption
  };

  return (
    <div className="encrypt-data">
      <h2>Encrypt Data</h2>
      
      {/* Paste Public Key Section */}
      <div>
        <label>Paste your Public Key:</label>
        <textarea
          value={userPublicKey}
          onChange={(e) => setUserPublicKey(e.target.value)}
          rows="6"
          cols="50"
          placeholder="Paste your public key here"
        />
      </div>

      <div className="uploaded-preview">
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

      <button className="btn encrypt-btn" onClick={handleEncrypt}>
        Encrypt and Generate QR Code
      </button>

      {/* QR Code and Timer */}
      {isQrVisible && qrReference && (
        <div className="qr-display">
          <h3>QR Code (Expires in {timer}s):</h3>
          <QRCodeCanvas id="qr-code" value={qrReference} size={200} />
        </div>
      )}

      {/* Buttons */}
      {qrReference && !isQrVisible && (
        <div>
          <button onClick={handleRegenerateQRCode}>Regenerate QR Code</button>
        </div>
      )}

      {/* Download QR Code Button */}
      {qrReference && (
        <div>
          <button onClick={handleDownloadQRCode}>Download QR Code</button>
        </div>
      )}

      {/* Share Button (Placeholder) */}
      <div>
        <button>Share QR Code</button> {/* Logic for sharing to be implemented later */}
      </div>
    </div>
  );
};

export default EncryptData;
