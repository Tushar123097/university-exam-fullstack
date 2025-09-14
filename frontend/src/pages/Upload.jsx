import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Upload = () => {
  const [category, setCategory] = useState("");
  const [branch, setBranch] = useState("");
  const [semester, setSemester] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("⚠️ Please select a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", category);
    formData.append("branch", branch);
    formData.append("semester", semester);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:3000/documents/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(res.data.message || "✅ File uploaded successfully!");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);

      setCategory("");
      setBranch("");
      setSemester("");
      setFile(null);
    } catch (err) {
      const msg = err.response?.data?.message || "❌ Upload failed";
      setMessage(msg);
    }
  };

  return (
    <div className="w-full relative min-h-screen flex flex-col items-center justify-start bg-gradient-to-r from-blue-700 via-indigo-800 to-purple-900 overflow-hidden px-4 py-6">
      {/* Back Button in top-left */}
      <button
        onClick={() => navigate("/dashboard")}
        className="self-start mb-6 py-2 px-4 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-white font-semibold transition"
      >
        Back
      </button>

      <motion.div
        className="relative z-10 bg-white/10 backdrop-blur-md p-10 rounded-xl shadow-xl w-full max-w-lg"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-extrabold text-white mb-6 text-center">
          📤 Upload Document
        </h2>

        <form onSubmit={handleUpload} className="flex flex-col gap-4">
          {/* Category */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="p-3 rounded-lg bg-black/40 text-white outline-none focus:ring-2 focus:ring-yellow-400 appearance-none"
          >
            <option value="">Select Category</option>
            <option value="PyQ">PYQ</option>
            <option value="Notes">Notes</option>
            <option value="Quantum">Quantum</option>
          </select>

          {/* Branch */}
          <select
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            required
            className="p-3 rounded-lg bg-black/40 text-white outline-none focus:ring-2 focus:ring-yellow-400 appearance-none"
          >
            <option value="">Select Branch</option>
            <option value="CSE">CSE</option>
            <option value="IT">IT</option>
            <option value="ME">ME</option>
            <option value="CE">CE</option>
          </select>

          {/* Semester */}
          <select
            value={semester}
            onChange={(e) => setSemester(Number(e.target.value))}
            required
            className="p-3 rounded-lg bg-black/40 text-white outline-none focus:ring-2 focus:ring-yellow-400 appearance-none"
          >
            <option value="">Select Semester</option>
            {[...Array(8)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                Semester {i + 1}
              </option>
            ))}
          </select>

          {/* File Upload */}
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            required
            className="p-3 rounded-lg border-2 border-yellow-400 bg-transparent text-white outline-none 
              file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 
              file:bg-yellow-400 file:text-white hover:file:bg-yellow-500 cursor-pointer"
          />

          {/* Upload Button */}
          <button
            type="submit"
            className="mt-4 py-3 rounded-2xl bg-yellow-400 hover:bg-yellow-500 text-white font-semibold shadow-lg transition transform hover:scale-105"
          >
            Upload
          </button>
        </form>

        {/* Message */}
        {message && (
          <p className="text-center mt-4 text-white font-semibold">{message}</p>
        )}
      </motion.div>
    </div>
  );
};

export default Upload;
