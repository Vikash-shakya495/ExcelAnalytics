const multer = require('multer');
const XLSX = require('xlsx');
const UploadModel = require('../models/Upload');
const path = require('path');

// Configure multer storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.xls' && ext !== '.xlsx') {
      return cb(new Error('Only Excel files are allowed'));
    }
    cb(null, true);
  },
}).single('file');

exports.uploadExcel = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
      // Parse Excel file buffer using SheetJS
      const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: null });

      // Save upload metadata and parsed data
      const uploadDoc = await UploadModel.create({
        user: req.user.id,
        filename: req.file.filename || req.file.originalname,
        originalname: req.file.originalname,
        data: jsonData,
      });

      res.status(201).json({ message: 'File uploaded and parsed successfully', upload: uploadDoc });
    } catch (e) {
      console.error('Upload Error:', e);
      res.status(500).json({ error: 'Failed to parse and save Excel file' });
    }
  });
};

// Get upload history for user
exports.getUploadHistory = async (req, res) => {
  try {
    const uploads = await UploadModel.find({ user: req.user.id }).sort({ uploadDate: -1 });
    res.status(200).json(uploads);
  } catch (e) {
    console.error('Get Upload History Error:', e);
    res.status(500).json({ error: 'Failed to fetch upload history' });
  }
};

// Delete upload by ID for user
exports.deleteUpload = async (req, res) => {
  try {
    const uploadId = req.params.id;
    const upload = await UploadModel.findOne({ _id: uploadId, user: req.user.id });
    if (!upload) {
      return res.status(404).json({ error: 'Upload not found or unauthorized' });
    }
    await UploadModel.deleteOne({ _id: uploadId });
    res.status(200).json({ message: 'Upload deleted successfully' });
  } catch (e) {
    console.error('Delete Upload Error:', e);
    res.status(500).json({ error: 'Failed to delete upload' });
  }
};
