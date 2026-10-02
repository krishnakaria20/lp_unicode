const express = require("express");
const {registerUser , loginUser , refreshAccessToken , getProfile} = require("../controllers/authController.js");
const authMiddleware = require("../middleware/authMiddleware.js");

const router = express.Router();

router.post("/register" , registerUser);
router.post("/login" , loginUser);

router.post("/refresh-token" , refreshAccessToken);

router.get("/profile" , authMiddleware , getProfile);


module.exports = router;