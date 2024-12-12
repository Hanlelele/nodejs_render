const User = require("../models/User");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();

const validateUserData = (data) => {
  const errors = {};

  if (!data.username || data.username.length < 3 || data.username.length > 30) {
    errors.username = "Username must be between 3 and 30 characters";
  }

  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  if (!data.email || !emailRegex.test(data.email)) {
    errors.email = "Invalid email format";
  }

  if (!data.password || data.password.length < 6) {
    errors.password = "Password must be at least 6 characters long";
  }

  return errors;
};

const authController = {
  //REGISTER
  registerUser: async (req, res) => {
    try {
      const errors = validateUserData(req.body);

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ 
          success: false,
          message: errors,
          data: {},
      });
      }

      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.password, salt);

      const testUser = await User.findOne({ username: req.body.username });
      const testEmail = await User.findOne({ email: req.body.email });

      if (testUser !== null) {
        return res.status(401).json({
          success: false,
          message: "Username is duplicated!",
          data: {},
        });
      }

      if (testEmail !== null) {
        return res.status(403).json({
          success: false,
          message: "Email is duplicated!",
          data: {},
        });
      }

      //Create new user
      const newUser = await new User({
        username: req.body.username,
        email: req.body.email,
        password: hashed,
      });

      //Save user to DB
      const user = await newUser.save();

      return res.status(200).json({
        success: true,
        message: "Register successfully !",
        data: user,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err,
        data: {},
      });
    }
  },

  //LOGIN
  loginUser: async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Incorrect email",
          data: {},
        });
      }

      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (!validPassword) {
        return res.status(404).json({
          success: false,
          message: "Incorrect password",
          data: {},
        });
      }

      if (user && validPassword) {
        const { password, ...others } = user._doc;

        return res.status(200).json({
          success: true,
          message: "Log in successfully !",
          data: { ...others },
        });
      }
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        data: {},
      });
    }
  },

  //LOG OUT
  logOut: async (req, res) => {
    res.status(200).json({
      success: true,
      message: "Logged out successfully!",
    });
  },
};

module.exports = authController;
