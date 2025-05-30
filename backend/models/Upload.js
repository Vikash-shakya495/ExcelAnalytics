const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  filename: { type: String, required: true },
  originalname: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
  data: { type: Object, required: true }, // Parsed Excel data stored as JSON
});

module.exports = mongoose.model('Upload', uploadSchema);
