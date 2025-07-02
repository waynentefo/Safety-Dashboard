const util = require('util');
const Multer = require('multer');
const path = require('path');
const fs = require('fs');

const maxSize = 10 * 1024 * 1024;

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure disk storage
const storage = Multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${base}-${uniqueSuffix}${ext}`);
  },
});

// Create multer instance
let processFile = Multer({
  storage,
  limits: { fileSize: maxSize },
}).single('file');

// Promisify for async/await
let processFileMiddleware = util.promisify(processFile);

module.exports = processFileMiddleware;
