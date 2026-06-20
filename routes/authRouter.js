const express = require("express");
const router = express.Router();
const { signupUser,loginUser } = require("../controllers/authController");


const upload = require("../config/multer"); 

// Define the POST route
// upload.fields() perfectly maps to the 'dataToSend.append()' names in your React frontend
router.post(
  "/signup",
  upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "identityCard", maxCount: 1 },
  ]),
  signupUser
);
router.post("/login", loginUser);

module.exports = router;