const express = require('express');
const router = express.Router();

router.get('/', (req, res) => { res.send("¡Hola, ya funciona!"); });

module.exports = router;