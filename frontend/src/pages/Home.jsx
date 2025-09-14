import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const features = [
  {
    title: "PYQs",
    description: "Find previous year questions to ace your exams.",
    icon: "📚",
  },
  {
    title: "Notes",
    description: "Access or share notes for all subjects and semesters.",
    icon: "📝",
  },
  {
    title: "Quantum",
    description: "Prepare with important questions and practice material.",
    icon: "⚡",
  },
];

const faqs = [
  {
    question: "How do I upload?",
    answer: "Sign up or login, go to the dashboard, click on Upload, and fill the form.",
  },
  {
    question: "What types of documents can I upload?",
    answer: "You can upload PYQs, Notes, or Quantum study materials as PDF files.",
  },
  {
    question: "What if I upload the wrong document?",
    answer: "You can delete the incorrect upload from the dashboard and upload the correct file. Make sure to select the correct category, branch, and semester.",
  },
];

const Home = () => {
  const [activeFAQ, setActiveFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  return (
    <div className="w-full relative bg-gradient-to-r from-blue-700 via-indigo-800 to-purple-900 overflow-hidden">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 z-0"></div>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-16">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-wide">
          Welcome to <span className="text-yellow-400">University Hub</span>
        </h1>

        <motion.p
          className="text-lg sm:text-xl md:text-2xl text-gray-200 font-bold mb-6 max-w-2xl"
          animate={{ x: [-5, 5, -5] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          Find & share <span className="text-blue-300 italic">PYQs</span>,{" "}
          <span className="text-green-300 italic">Notes</span>, and{" "}
          <span className="text-purple-300 italic">Quantum</span> your exam prep made easy!
        </motion.p>

        <div className="flex gap-6 justify-center mb-8 flex-wrap">
          <Link
            to="/signup"
            className="px-6 py-3 rounded-2xl bg-yellow-400 hover:bg-yellow-500 text-white font-semibold shadow-lg transition transform hover:scale-105"
          >
            Signup
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 rounded-2xl bg-white/90 hover:bg-white text-blue-600 font-semibold shadow-lg transition transform hover:scale-105"
          >
            Login
          </Link>
        </div>

        {/* How It Works Text */}
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          How It Works
        </h2>
      </div>

      {/* Features Section */}
      <div className="relative z-10 py-4 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              className="bg-white/10 backdrop-blur-md rounded-xl p-6 flex flex-col items-center text-center hover:scale-105 transition transform"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: idx * 0.2 }}
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold italic text-white mb-2">{feature.title}</h3>
              <p className="text-gray-200 italic">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="relative z-10 py-12 px-4 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">FAQs</h2>
        <div className="flex flex-col gap-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white/10 backdrop-blur-md rounded-xl p-4 cursor-pointer"
              onClick={() => toggleFAQ(idx)}
            >
              <h3 className="text-white font-semibold text-lg flex justify-between items-center">
                {faq.question}
                <span className="ml-2">{activeFAQ === idx ? "−" : "+"}</span>
              </h3>
              {activeFAQ === idx && (
                <p className="text-gray-200 mt-2">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 bg-black/30 backdrop-blur-md text-white py-6 px-4 mt-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm md:text-base">&copy; {new Date().getFullYear()} University Hub. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-yellow-400 transition">Privacy Policy</a>
            <a href="#" className="hover:text-yellow-400 transition">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
