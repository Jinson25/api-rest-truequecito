const express = require("express");
const passport = require("passport");
const {
  registerUser,
  loginUser,
  getUserProfile,
} = require("../controllers/authController");
const { updateProfile } = require("../controllers/userController");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/user", authMiddleware, getUserProfile);
router.put("/user/profile", authMiddleware, updateProfile);

// Ruta para iniciar el proceso de autenticación con Google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["profile", "email"] })
);
router.get(
  "/discord",
  passport.authenticate("discord", { scope: ["identify", "email"] })
);

// Ruta para obtener el perfil del usuario autenticado
router.get("/profile", (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Usuario no autenticado" });
  }
  res.json({
    id: req.user._id,
    email: req.user.email,
    username: req.user.username,
    avatar: req.user.avatar,
  });
});

module.exports = router;
