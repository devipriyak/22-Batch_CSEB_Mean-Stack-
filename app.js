const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Secret key for encryption and decryption (same key must be used for both operations)
const ENCRYPTION_KEY = crypto.randomBytes(32); // 32 bytes key for AES-256

// Function to encrypt text
function encrypt(text) {
    const iv = crypto.randomBytes(16); // Generate random IV for each encryption
    const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    console.log(`Encrypting: iv=${iv.toString('hex')} EncryptedText=${encrypted}`);
    return { iv: iv.toString('hex'), encryptedText: encrypted }; // Return both encrypted text and IV
}

// Function to decrypt text
function decrypt(encryptedText, iv) {
    try {
        const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, Buffer.from(iv, 'hex'));
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        console.log(`Decrypting: iv=${iv} encryptedText=${encryptedText} decryptedText=${decrypted}`);
        return decrypted;
    } catch (error) {
        console.error('Decryption failed:', error.message);
        throw new Error('Decryption failed');
    }
}

// Function to hash text using SHA-256
function hash(text) {
    return crypto.createHash('sha256').update(text).digest('hex');
}

// Route for encryption
app.post('/encrypt', (req, res) => {
    const { text } = req.body;
    const { iv, encryptedText } = encrypt(text);
    res.json({ iv, encryptedText });
});

// Route for decryption
app.post('/decrypt', (req, res) => {
    const { encryptedText, iv } = req.body;
    try {
        const decryptedText = decrypt(encryptedText, iv);
        res.json({ decryptedText });
    } catch (err) {
        res.status(500).json({ error: 'Decryption failed' });
    }
});

// Route for hashing
app.post('/hash', (req, res) => {
    const { text } = req.body;
    const hashedText = hash(text);
    res.json({ hashedText });
});

// Serve the HTML form for user input
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
