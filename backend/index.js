const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
//const documentRoutes = require("./routes/documentRoutes");app.use("/documents", documentRoutes);


const transporter = require("./nodemailerTransporter");
const documentRoutes = require("./routes/documentRoutes"); // require first

const app = express(); // <-- app must be created first
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose
  .connect("mongodb://127.0.0.1:27017/myNewDatabase", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});
const User = mongoose.model("User", userSchema);

// Helper: Generate random password
function generatePassword() {
  return Math.random().toString(36).slice(-8);
}

// -------------------- SIGNUP --------------------
app.post("/signup", async (req, res) => {
  const { name, email } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }

    const password = generatePassword();

    // Save user in DB
    user = new User({ name, email, password });
    await user.save();

    // Send password via email
    await transporter.sendMail({
      from: `"MyApp Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your App Password",
      text: `Hello ${name},\n\nYour password is: ${password}\n\nUse this to login.`,
    });

    res.json({ message: "User created & password sent to email" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Signup failed", details: err.message });
  }
});

// -------------------- LOGIN --------------------
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

// Middleware to verify JWT token
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// GET /me → Get current user info
app.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password"); // use req.user.id
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Server error" });
  }
});




// Serve uploaded files statically
app.use("/uploads", express.static("uploads"));

// -------------------- DOCUMENT ROUTES --------------------
// This must be **after** `app` is created
app.use("/documents", documentRoutes);

// -------------------- START SERVER --------------------
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
