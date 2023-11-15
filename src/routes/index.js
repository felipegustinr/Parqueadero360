const express = require('express');
const router = express.Router();
// MODULO PAGINA PRINCIPAL 
router.get('/', (req, res) => {
    res.send('Bienvenido');
});

module.exports = router;