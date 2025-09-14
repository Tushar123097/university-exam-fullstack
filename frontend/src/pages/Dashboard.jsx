import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token"); 
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center text-white text-xl">
        Loading dashboard...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start bg-gradient-to-r from-blue-700 via-indigo-800 to-purple-900 px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/30 z-0"></div>

      {/* Top Right Menu */}
  {/* Top Left Hamburger Menu */}
{/* Top Left Hamburger Menu */}
<div className="absolute top-4 left-4 text-2xl cursor-pointer z-30">
  <button
    className="text-white text-3xl"
    onClick={() => setMenuOpen(!menuOpen)}
  >
    ☰
  </button>

  {menuOpen && (
    <div className="absolute left-0 mt-2 bg-white/10 backdrop-blur-md rounded-lg shadow-lg text-white w-44 p-2 z-40">
      {/* User Info */}
      <div className="px-3 py-2 border-b border-white/20 mb-2">
        <p className="font-semibold">{user.name}</p>
        <p className="text-sm text-gray-300">{user.email}</p>
      </div>

      {/* Options */}
      <button
        onClick={() => navigate("/profile")}
        className="block w-full text-left px-3 py-2 rounded hover:bg-white/20"
      >
        Profile
      </button>
      <button className="block w-full text-left px-3 py-2 rounded hover:bg-white/20">
        Settings 
      </button>
      <button className="block w-full text-left px-3 py-2 rounded hover:bg-white/20">
        Reset
      </button>
    </div>
  )}
</div>

      {/* Quick Actions */}
      <motion.div
        className="relative z-10 w-full max-w-6xl grid grid-cols-1 sm:grid-cols-3 gap-8 mt-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Upload Card */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate("/upload")}
          className="bg-white/10 backdrop-blur-md p-10 rounded-3xl shadow-xl cursor-pointer flex flex-col items-center justify-center text-center"
        >
          <div className="text-6xl mb-4">📤</div>
          <h3 className="text-xl font-bold text-yellow-400 mb-2">Upload</h3>
          <p className="text-gray-200 italic">PYQs, Notes, or Quantum.</p>
        </motion.div>

        {/* View Card */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate("/view")}
          className="bg-white/10 backdrop-blur-md p-10 rounded-3xl shadow-xl cursor-pointer flex flex-col items-center justify-center text-center"
        >
          <div className="text-6xl mb-4">📂</div>
          <h3 className="text-xl font-bold text-green-400 mb-2">View</h3>
          <p className="text-gray-200 italic">All materials in one place.</p>
        </motion.div>

        {/* Delete Card */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate("/my-documents")}
          className="bg-white/10 backdrop-blur-md p-10 rounded-3xl shadow-xl cursor-pointer flex flex-col items-center justify-center text-center"
        >
          <div className="text-6xl mb-4">🗑️</div>
          <h3 className="text-xl font-bold text-red-400 mb-2">Delete</h3>
          <p className="text-gray-200 italic">Manage and delete your uploads.</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
