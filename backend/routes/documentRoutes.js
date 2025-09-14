// routes/documentRoutes.js
const express = require("express");
const multer = require("multer");
const Document = require("../models/Document");
const auth = require("../middleware/auth"); // JWT middleware
const router = express.Router();

// -------------------- MULTER CONFIG --------------------
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/"); // files stored in uploads folder
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// const upload = multer({ storage });

// // -------------------- UPLOAD DOCUMENT --------------------
// router.post("/upload", auth, upload.single("file"), async (req, res) => {
//   try {
//     const { category, branch, semester } = req.body;

//     if (!req.file) return res.status(400).json({ error: "File is required" });
//     if (!category || !branch || !semester)
//       return res.status(400).json({ error: "Category, branch, and semester are required" });

//     const document = new Document({
//       filename: req.file.filename,
//       uploader: req.user.id, // from JWT
//       category,
//       branch,
//       semester,
//     });

//     await document.save();
//     res.json({ message: "Document uploaded successfully", document });
//   } catch (err) {
//     console.error("Upload error:", err);
//     res.status(500).json({ error: "Upload failed" });
//   }
// });
const storage = multer.memoryStorage(); // keep file in memory
const upload = multer({ storage });

router.post("/upload", auth, upload.single("file"), async (req, res) => {
  try {
    const { category, branch, semester } = req.body;

    if (!req.file) return res.status(400).json({ error: "File is required" });
    if (!category || !branch || !semester)
      return res.status(400).json({ error: "Category, branch, and semester are required" });

    const document = new Document({
      filename: req.file.originalname,
      data: req.file.buffer, // store file content
      uploader: req.user.id,
      category,
      branch,
      semester,
    });

    await document.save();
    res.json({ message: "Document uploaded successfully", document });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});


// -------------------- GET DOCUMENTS (with filters) --------------------
router.get("/", auth, async (req, res) => {
  try {
    const { category, branch, semester } = req.query;

    let filter = {};
    if (category) filter.category = category;
    if (branch) filter.branch = branch;
    if (semester) filter.semester = Number(semester);

    const documents = await Document.find(filter).populate("uploader", "name email");
    res.json(documents);
  } catch (err) {
    console.error("Fetch documents error:", err);
    res.status(500).json({ error: "Failed to fetch documents" });
  }
});

// -------------------- DELETE DOCUMENT --------------------
router.delete("/:id", auth, async (req, res) => {
  try {
    console.log("Delete request for ID:", req.params.id);
    console.log("User from token:", req.user);

    const document = await Document.findById(req.params.id);
    console.log("Document found:", document);

    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    if (document.uploader.toString() !== req.user.id) {
      console.log(
        "Uploader mismatch. Document uploader:",
        document.uploader.toString(),
        "Request user:",
        req.user.id
      );
      return res
        .status(403)
        .json({ error: "You are not allowed to delete this document" });
    }

    await document.deleteOne(); // use deleteOne() instead of remove()
    res.json({ message: "Document deleted successfully" });
  } catch (err) {
    console.error("Delete document error:", err);
    res.status(500).json({ error: "Delete failed", details: err.message });
  }
});


module.exports = router;
