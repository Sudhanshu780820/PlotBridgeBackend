const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const User = require("../models/user");

// --- NEW IMPORTS FOR VERCEL DEPLOYMENT ---
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API Key Exists:", !!process.env.CLOUDINARY_API_KEY);
console.log("API Secret Exists:", !!process.env.CLOUDINARY_API_SECRET);

// Helper function to upload RAM buffers to Cloudinary
const uploadBufferToCloudinary = (buffer, folderName) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: folderName },
      (error, result) => {
        if (result) {
          resolve(result.secure_url); // Returns the https://... url
        } else {
          reject(error);
        }
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

const signupUser = async (req, res) => {
  try {
    const { fullName, email, phone, userType, password } = req.body;
    console.log("BODY:", req.body);
console.log("FILES:", req.files);

console.log("CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY ? "SET" : "MISSING");
console.log("CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET ? "SET" : "MISSING");

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists." });
    }

    // 2. Hash the password securely
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Upload files directly to Cloudinary from memory buffers
    let profilePhotoUrl = null;
    let identityCardUrl = null;

    // Check and upload Profile Photo
    // Note: We use .buffer instead of .filename now
    if (req.files?.["profilePhoto"]) {
        profilePhotoUrl = await uploadBufferToCloudinary(req.files["profilePhoto"][0].buffer, "PlotBridge/Profiles");
        console.log("Uploading profile photo...");
    }

    // Check and upload Identity Card
    if (req.files?.["identityCard"]) {
        identityCardUrl = await uploadBufferToCloudinary(req.files["identityCard"][0].buffer, "PlotBridge/IDCards");
        console.log("Uploading identity card...");
    } else {
      return res.status(400).json({ message: "Identity Card is required for verification." });
    }

    // 4. Create and save the new user with Cloudinary URLs
    const newUser = new User({
      fullName,
      email,
      phone,
      userType,
      password: hashedPassword,
      profilePhoto: profilePhotoUrl, // Saving the Cloudinary URL
      identityCard: identityCardUrl, // Saving the Cloudinary URL
    });

    await newUser.save();

    // 5. Generate a JWT so frontend can use it immediately
    const JWT_SECRET = process.env.JWT_SECRET || "super_secret_jwt_key_plotbridge";
    const token = jwt.sign(
      { id: newUser._id, userType: newUser.userType },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Respond with token + user
    res.status(201).json({
      message: "Account created successfully!",
      token,
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        userType: newUser.userType,
        profilePhoto: newUser.profilePhoto,
        phone: newUser.phone,
        identityCard: newUser.identityCard
      }
    });
  }catch (error) {
  console.error("Signup Controller Error:", error);

  res.status(500).json({
    message: error.message,
    stack: error.stack
  });
}
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide both email and password." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const JWT_SECRET = process.env.JWT_SECRET || "super_secret_jwt_key_plotbridge";
    const token = jwt.sign(
      { id: user._id, userType: user.userType },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        userType: user.userType,
        profilePhoto: user.profilePhoto,
        phone: user.phone,
        identityCard: user.identityCard
      }
    });

  } catch (error) {
    console.error("Login Controller Error:", error);
    res.status(500).json({ message: "Server error during login." });
  }
};

module.exports = { signupUser, loginUser };