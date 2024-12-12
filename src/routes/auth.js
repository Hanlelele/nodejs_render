const router = require("express").Router();
const authController = require("../controllers/authController");

// api/auth

//REGISTER
router.post("/register", authController.registerUser);

// //LOG IN
router.post("/login", authController.loginUser);

 //LOG OUT
router.post("/logout", authController.logOut);

module.exports = router;
