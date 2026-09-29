const express = require("express");
const {registerUser , loginUser ,isProtected} = require("../controllers/authController.js");
const authMiddleware = require("../middleware/authMiddleware.js");

const router = express.Router();

router.post("/register" , registerUser);
router.post("/login" , loginUser);

router.get("/protected" , authMiddleware , isProtected);

module.exports = router;