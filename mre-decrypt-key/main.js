const CryptoJS = require('crypto-js');

// This should be your secret key - in production, store this securely!
const CRYPTO_KEY = process.env.CRYPTO_KEY ?? 'your-secret-key-here';
const TO_DECRYPT = process.env.TO_DECRYPT ?? 'string-to-decrypt'

// Function to decrypt a string
function decryptString(encryptedText) {
    return CryptoJS.AES.decrypt(encryptedText, CRYPTO_KEY)
        .toString(CryptoJS.enc.Utf8)
        .trim();
}

const decrypted = decryptString(TO_DECRYPT);
console.log(`Original: ${TO_DECRYPT}`)
console.log(`After Decrypt: ${decrypted}`)
