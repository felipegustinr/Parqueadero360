const express = require('express');
const router = express.Router();

const pool= require('../database');

router.get('/register',(req, res) =>{
res.render('links/register');
});

router.post('/register', async (req, res)=> {

    const {idUsuario = 1, nombres, email, phone, address } = req.body
    const new_User = {
        idUsuario,
        nombres,
        email,
        phone,
        address
    };
    await pool.query('INSERT INTO usuario set ?', [new_User]);
    console.log(new_User)
    res.send('recibido');
});
module.exports= router;