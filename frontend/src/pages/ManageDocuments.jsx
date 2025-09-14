// src/pages/ManageDocuments.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ManageDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await axios.get("http://localhost:3000/documents", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDocuments(res.data);
      } catch (err) {
        console.error("Error fetching docs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, [token]);

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`http://localhost:3000/documents/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage(res.data.message);

      // ✅ Redirect to Dashboard after delete
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      console.error("Delete error:", err);
      setMessage("Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-700 via-indigo-800 to-purple-900 text-white text-xl">
        Loading documents...
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start bg-gradient-to-r from-blue-700 via-indigo-800 to-purple-900 px-4 py-12 relative overflow-hidden">
      {/* Back Button */}
     <button
  onClick={() => navigate("/dashboard")}
  className="self-start mb-4 py-2 px-4 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-white font-semibold transition relative z-10"
>
  Back
</button>

      <div className="absolute inset-0 bg-black/30 z-0"></div>

      <motion.div
        className="relative z-10 w-full max-w-4xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          Manage Your Documents
        </h2>

        {message && (
          <p className="mb-4 p-3 bg-green-600/70 text-white text-center rounded-lg">
            {message}
          </p>
        )}

        {documents.length === 0 ? (
          <p className="text-gray-200 text-center">No documents uploaded yet.</p>
        ) : (
          <div className="space-y-4">
            {documents.map((doc) => (
              <motion.div
                key={doc._id}
                whileHover={{ scale: 1.02 }}
                className="flex items-center justify-between bg-white/10 backdrop-blur-md p-4 rounded-xl shadow-md text-white"
              >
                <span className="truncate max-w-xs">{doc.filename}</span>
                <button
                  onClick={() => handleDelete(doc._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md transition"
                >
                  Delete
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ManageDocuments;
