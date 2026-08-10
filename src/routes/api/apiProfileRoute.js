const express = require("express");
const router = express.Router();
const profileController = require("../../controllers/profileController");

// 🗃️ Ver lista de usuarios
router.get("/", profileController.getAllProfiles);

// 👁️ Ver detalles de un usuario
router.get("/:id", profileController.getProfileById);

// ➕ Registrar un nuevo usuario
router.post("/", profileController.createProfile);

// ✍🏻 Modificar un usuario
router.put("/:id", profileController.updateProfile);

// 🗑️ Eliminar un usuario
router.delete("/:id", profileController.deleteProfile);

module.exports = router;