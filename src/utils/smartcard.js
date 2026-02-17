const QRCode = require('qrcode');
const crypto = require('crypto');

// Use a secret key from environment (32 bytes hex)
const ENCRYPTION_KEY = process.env.SMARTCARD_ENCRYPTION_KEY; 
const ALGORITHM = 'aes-256-gcm';

function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

function decrypt(encryptedData) {
  const [ivHex, authTagHex, encryptedHex] = encryptedData.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

async function generatePatientQR(patientData) {
  const dataString = JSON.stringify(patientData);
  const encrypted = encrypt(dataString);
  // Generate QR as data URL
  const qrDataURL = await QRCode.toDataURL(encrypted);
  return qrDataURL;
}

function parsePatientQR(encryptedData) {
  try {
    const decrypted = decrypt(encryptedData);
    return JSON.parse(decrypted);
  } catch (e) {
    throw new Error('Invalid QR code');
  }
}

module.exports = { generatePatientQR, parsePatientQR };