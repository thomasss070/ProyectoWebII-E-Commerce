const profileService = require("../services/profileService");

// GET /api/users
const getAllProfiles = (req, res) => {
    try {
        const profiles = profileService.getAllProfiles();
        res.status(200).json(profiles);
    } catch (error) {
        console.error("Error al obtener perfiles:", error);
        res.status(500).json({ error: "Error al obtener la lista de usuarios" });
    }
};

// GET /api/users/:id
const getProfileById = (req, res) => {
    try {
        const profile = profileService.getProfileById(req.params.id);
        if (!profile) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        res.status(200).json(profile);
    } catch (error) {
        console.error("Error al obtener perfil:", error);
        res.status(500).json({ error: "Error al obtener los detalles del usuario" });
    }
};

// POST /api/users
const createProfile = (req, res) => {
    try {
        const { name, email } = req.body;
        if (!name || !email) {
            return res.status(400).json({ error: "Nombre y email son obligatorios" });
        }

        const newProfile = profileService.createProfile(req.body);
        res.status(201).json(newProfile);
    } catch (error) {
        console.error("Error al crear perfil:", error);
        res.status(500).json({ error: "Error al registrar el usuario" });
    }
};

// PUT /api/users/:id
const updateProfile = (req, res) => {
    try {
        const updatedProfile = profileService.updateProfile(req.params.id, req.body);
        if (!updatedProfile) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        res.status(200).json(updatedProfile);
    } catch (error) {
        console.error("Error al actualizar perfil:", error);
        res.status(500).json({ error: "Error al modificar el usuario" });
    }
};

// DELETE /api/users/:id
const deleteProfile = (req, res) => {
    try {
        const isDeleted = profileService.deleteProfile(req.params.id);
        if (!isDeleted) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        res.status(200).json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar perfil:", error);
        res.status(500).json({ error: "Error al eliminar el usuario" });
    }
};

module.exports = {
    getAllProfiles,
    getProfileById,
    createProfile,
    updateProfile,
    deleteProfile
};