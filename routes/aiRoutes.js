const express = require("express");
const router = express.Router();

const {
    searchProperties,
    compareProperties
} = require("../controllers/aiController");

router.post("/search", searchProperties);

router.post("/compare", compareProperties);
router.post("/chat", chatAI);

module.exports = router;