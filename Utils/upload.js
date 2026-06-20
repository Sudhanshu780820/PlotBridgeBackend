require("dotenv").config(); // 👈 This reads the .env file
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// CONFIGURATION USING ENVIRONMENT VARIABLES
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

console.log("✅ Cloudinary configuration initialized");

// Test connection
cloudinary.api.ping((err, result) => {
    if (err) {
        console.error("❌ Cloudinary Connection Error:", err.message);
    } else {
        console.log("✅ Cloudinary Connected Successfully!");
    }
});

// Configure storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "plotbridge",
        allowed_formats: ["jpg", "jpeg", "png"]
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

module.exports = upload;