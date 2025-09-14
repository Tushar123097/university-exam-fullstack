// routes/documentRoutes.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Document = require("../models/Document");
const auth = require("../middleware/auth"); // JWT middleware
const router = express.Router();

// -------------------- MULTER CONFIG --------------------
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// -------------------- UPLOAD DOCUMENT --------------------
router.post("/upload", auth, upload.single("file"), async (req, res) => {
  try {
    const { category, branch, semester } = req.body;

    if (!req.file) return res.status(400).json({ error: "File is required" });
    if (!category || !branch || !semester)
      return res
        .status(400)
        .json({ error: "Category, branch, and semester are required" });

    const document = new Document({
      filename: req.file.filename,
      uploader: req.user.id,
      category,
      branch,
      semester,
    });

    await document.save();

    // Public URL
   const fileUrl = `${process.env.BASE_URL}/documents/${document._id}/view`;

    // Respond to frontend
    res.json({ message: "Document uploaded successfully", fileUrl });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

// -------------------- GET DOCUMENTS (with filters) --------------------
router.get("/", auth, async (req, res) => {
  try {
    const { category, branch, semester } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (branch) filter.branch = branch;
    if (semester) filter.semester = Number(semester);

    const documents = await Document.find(filter)
      .populate("uploader", "name email")
      .sort({ createdAt: -1 });

    res.json(documents);
  } catch (err) {
    console.error("Fetch documents error:", err);
    res.status(500).json({ error: "Failed to fetch documents" });
  }
});

// -------------------- VIEW DOCUMENT --------------------
// Optional: Only for uploader (or you can make public)
// routes/documentRoutes.js
router.get("/:id/view", auth, async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Document not found" });

    const filePath = path.join(__dirname, "../uploads", doc.filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found on server" });
    }

    // Set correct headers for PDF / DOC
    const ext = path.extname(doc.filename).toLowerCase();
    let contentType = "application/octet-stream"; // default
    if (ext === ".pdf") contentType = "application/pdf";
    else if (ext === ".doc") contentType = "application/msword";
    else if (ext === ".docx") contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", `inline; filename="${doc.filename}"`);
    res.sendFile(filePath);
  } catch (err) {
    console.error("View document error:", err);
    res.status(500).json({ error: "Failed to view document" });
  }
});

// -------------------- DELETE DOCUMENT --------------------
router.delete("/:id", auth, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) return res.status(404).json({ error: "Document not found" });

    if (document.uploader.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: "You are not allowed to delete this document" });
    }

    const filePath = path.join(__dirname, "../uploads", document.filename);

    // Delete file from disk if exists
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await document.deleteOne();
    res.json({ message: "Document deleted successfully" });
  } catch (err) {
    console.error("Delete document error:", err);
    res.status(500).json({ error: "Delete failed", details: err.message });
  }
});

module.exports = router;
