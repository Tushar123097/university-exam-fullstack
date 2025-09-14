const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  data: { type: Buffer, required: true }, // store the file content
  uploader: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: { type: String, enum: ["PyQ", "Notes", "Quantum"], required: true },
  branch: { type: String, enum: ["CSE", "IT", "ME", "CE"], required: true },
  semester: { type: Number, min: 1, max: 8, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Document", documentSchema);
