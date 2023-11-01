const express = require('express');
const router = express.Router();

const pool= require('../database');

router.get('/register',(req, res) =>{
res.render('links/register');
});

router.post('/register', (req, res)=> {
res.send('recibido')
});
module.exports= router;