import React, { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token"); // store token on login
    if (!token) return;

    axios
      .get("http://localhost:3000/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch((err) => console.error(err));
  }, []);

  if (!user) return <p className="text-white text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-700 via-indigo-800 to-purple-900 px-4">
     
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl text-center text-gray-200 shadow-lg">
        <h2 className="text-3xl font-bold text-yellow-400 mb-4">Profile</h2>
        <p><span className="font-semibold text-blue-400">Name:</span> {user.name}</p>
        <p><span className="font-semibold text-blue-400">Email:</span> {user.email}</p>
      </div>
    </div>
  );
};

export default Profile;
