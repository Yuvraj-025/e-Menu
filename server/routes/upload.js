const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    // Save to the client public assets folder
    cb(null, path.join(__dirname, '../../client/public/assets'));
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname.replace(/\\s+/g, '-')}`);
  }
});

const checkFileType = (file, cb) => {
  const filetypes = /jpg|jpeg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Images only!'));
  }
};

const upload = multer({
  storage,
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
});

// @route   POST /api/upload
// @desc    Upload an image
// @access  Private
router.post('/', protect, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  // Return the path that the client can use to display the image
  res.json({ imagePath: `assets/${req.file.filename}` });
});

module.exports = router;
