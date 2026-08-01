const express = require('express');
const router = express.Router();

router.get('/test', (req, res) => {
    return res.status(200).json({ status: 200, message: "API funcionando!" });
});

module.exports = router;