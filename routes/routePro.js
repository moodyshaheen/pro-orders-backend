import express from 'express'
import multer from 'multer'
import { addPro, listPro, removePro, getProductsByIds, updatePro, getProductById } from '../controllers/controlProduct.js'

const proRouter = express.Router()

// 🖼️ إعداد تخزين الصور - Vercel compatible
const storage = multer.memoryStorage(); // Use memory storage for Vercel

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    console.log("📷 File filter - File:", file);
    // Accept only image files
    if (file && file.mimetype && file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else if (!file) {
      // No file is also acceptable
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// 🧩 المسارات
proRouter.post('/add', (req, res, next) => {
  console.log("📝 POST /add - Headers:", req.headers);
  console.log("📝 POST /add - Content-Type:", req.get('Content-Type'));
  next();
}, upload.single('image'), (req, res, next) => {
  console.log("📝 After multer - Body:", req.body);
  console.log("📝 After multer - File:", req.file ? "Present" : "Not present");
  next();
}, addPro)

proRouter.put('/update/:id', upload.single('image'), updatePro)
proRouter.get('/list', listPro)
proRouter.post('/remove', removePro)
proRouter.get('/byIds', getProductsByIds)
proRouter.get('/:id', getProductById)

export default proRouter
