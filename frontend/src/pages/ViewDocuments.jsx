import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config/server";

const ViewDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [category, setCategory] = useState("");
  const [branch, setBranch] = useState("");
  const [semester, setSemester] = useState("");
  const [message, setMessage] = useState("");
  const [pdfUrls, setPdfUrls] = useState({}); // store blob URLs for each doc

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const fetchDocuments = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/documents?category=${category || ""}&branch=${branch || ""}&semester=${semester || ""}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDocuments(res.data);
      setMessage(res.data.length === 0 ? "No documents found." : "");

      // Fetch PDF blobs for each document
      const pdfs = {};
      await Promise.all(
        res.data.map(async (doc) => {
          try {
            const fileRes = await axios.get(`${BASE_URL}/documents/${doc._id}/view`, {
              headers: { Authorization: `Bearer ${token}` },
              responseType: "blob",
            });
            pdfs[doc._id] = URL.createObjectURL(fileRes.data);
          } catch (err) {
            console.error("Error fetching PDF for", doc.filename);
          }
        })
      );
      setPdfUrls(pdfs);
    } catch (err) {
      console.error(err);
      setMessage("Error fetching documents.");
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [category, branch, semester]);

  const openPdf = (id) => {
    if (pdfUrls[id]) {
      window.open(pdfUrls[id]);
    } else {
      alert("PDF not loaded yet.");
    }
  };

  return (
    <div className="w-full min-h-screen px-4 py-8 bg-gradient-to-r from-blue-700 via-indigo-800 to-purple-900 flex flex-col items-center">
      <button
        onClick={() => navigate("/dashboard")}
        className="self-start mb-4 py-2 px-4 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-white font-semibold transition"
      >
        Back
      </button>

      <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6 text-center">
        📂 View Documents
      </h2>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 w-full max-w-4xl justify-center">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-3 rounded-lg bg-black/40 text-white outline-none border border-yellow-400 flex-1"
        >
          <option value="">All Categories</option>
          <option value="PyQ">PyQ</option>
          <option value="Notes">Notes</option>
          <option value="Quantum">Quantum</option>
        </select>

        <select
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          className="p-3 rounded-lg bg-black/40 text-white outline-none border border-yellow-400 flex-1"
        >
          <option value="">All Branches</option>
          <option value="CSE">CSE</option>
          <option value="IT">IT</option>
          <option value="ME">ME</option>
          <option value="CE">CE</option>
        </select>

        <select
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          className="p-3 rounded-lg bg-black/40 text-white outline-none border border-yellow-400 flex-1"
        >
          <option value="">All Semesters</option>
          {[...Array(8)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              Semester {i + 1}
            </option>
          ))}
        </select>
      </div>

      {message && <p className="text-white italic mb-4">{message}</p>}

      {/* Document List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {documents.map((doc) => (
          <motion.div
            key={doc._id}
            className="bg-white/10 backdrop-blur-md p-4 rounded-xl flex flex-col"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-white font-bold">{doc.filename}</h3>
            <p className="text-white text-sm mb-2">
              Category: {doc.category} | Branch: {doc.branch} | Semester: {doc.semester}
            </p>

            {/* Embed PDF */}
            {pdfUrls[doc._id] && (
              <iframe
                src={pdfUrls[doc._id]}
                title={doc.filename}
                className="w-full h-48 sm:h-56 md:h-64 lg:h-48 rounded-lg mb-2"
              ></iframe>
            )}

            {/* Open in new tab */}
            <button
              onClick={() => openPdf(doc._id)}
              className="mt-auto py-2 px-4 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-white font-semibold transition"
            >
              Open PDF
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ViewDocuments;
