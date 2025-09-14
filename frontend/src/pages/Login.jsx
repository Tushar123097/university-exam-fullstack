import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { BASE_URL } from "../config/server";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/login`, { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user || { email }));

      setMessage(res.data.message || "Login successful ");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid credentials";
      setMessage(msg);
    }
  };
  return (
    <div className="w-full relative min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-700 via-indigo-800 to-purple-900 overflow-hidden">
      <div className="absolute inset-0 bg-black/40 z-0"></div>
      <motion.div
        className="relative z-10 bg-white/10 backdrop-blur-md p-10 rounded-xl shadow-xl w-full max-w-md"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-extrabold text-white mb-6 text-center">
          Login to <span className="text-yellow-400">University Hub</span>
        </h2>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-3 rounded-lg bg-white/30 text-white placeholder-white outline-none focus:ring-2 focus:ring-yellow-400 transition"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-3 rounded-lg bg-white/30 text-white placeholder-white outline-none focus:ring-2 focus:ring-yellow-400 transition"
          />

          <button
            type="submit"
            className="mt-4 py-3 rounded-2xl bg-yellow-400 hover:bg-yellow-500 text-white font-semibold shadow-lg transition transform hover:scale-105"
          >
            Login
          </button>
        </form>

        {message && (
          <p className="text-center mt-4 text-white font-semibold">{message}</p>
        )}

        <p className="text-gray-200 mt-4 text-center">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="text-yellow-400 font-bold hover:underline">
            Signup
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
