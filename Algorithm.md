Encryption Algorithm :

1. Start
2. If data size is small (e.g., text):
   a. Encrypt the data using RSA with the recipient's public key:
   encryptedData = RSA_Encrypt(data, publicKeyRSA)
   b. Generate a QR code containing `encryptedData`
   QRCode = GenerateQRCode(encryptedData)
   c. Save the QR code to `outputQR`
3. Else if data size is large (e.g., image, PDF):
   a. Generate a random AES key:
   aesKey = GenerateRandomAESKey()
   b. Encrypt the data using AES:
   encryptedData = AES_Encrypt(data, aesKey)
   c. Encrypt the AES key using RSA with the recipient's public key:
   encryptedAESKey = RSA_Encrypt(aesKey, publicKeyRSA)
   d. Create metadata for the encrypted data (e.g., file storage location or cloud link)
   metadata = CreateMetadata(encryptedDataLocation)
   e. Combine metadata and encrypted AES key into a payload:
   payload = Combine(metadata, encryptedAESKey)
   f. Generate a QR code containing `payload`
   QRCode = GenerateQRCode(payload)
   g. Save the QR code to `outputQR`
4. End

Decryption Algorithm :

1. Start
2. Read the QR code to extract data:
   qrData = ReadQRCode(qrCode)
3. If the data is RSA-encrypted (small data):
   a. Decrypt the data using RSA with the recipient's private key:
   decryptedData = RSA_Decrypt(qrData, privateKeyRSA)
   b. Output `decryptedData`
4. Else if the data contains metadata and an encrypted AES key:
   a. Parse the payload:
   metadata, encryptedAESKey = ParsePayload(qrData)
   b. Decrypt the AES key using RSA with the recipient's private key:
   aesKey = RSA_Decrypt(encryptedAESKey, privateKeyRSA)
   c. Retrieve the encrypted data using the metadata (e.g., download from cloud storage):
   encryptedData = RetrieveData(metadata)
   d. Decrypt the data using AES with the decrypted AES key:
   decryptedData = AES_Decrypt(encryptedData, aesKey)
   e. Output `decryptedData`
5. End

Supporting Functions:

1. GenerateQRCode(data): Converts data into a QR code image.
2. ReadQRCode(qrCode): Extracts data from a QR code image.
3. RSA_Encrypt(data, key) / RSA_Decrypt(data, key): Performs RSA encryption or decryption.
4. AES_Encrypt(data, aesKey) / AES_Decrypt(data, aesKey): Performs AES encryption or decryption.
5. GenerateRandomAESKey(): Generates a random symmetric AES key.
6. CreateMetadata(location): Creates metadata for file location or cloud link.
7. Combine(metadata, encryptedKey) / ParsePayload(qrData): Combines or parses payload components.
8. RetrieveData(metadata): Fetches encrypted data using metadata.
