const express = require('express');
const router = express.Router();

const pool= require('../database');

router.get('/register',(req, res) =>{
res.render('links/register');
});

router.post('/register', async (req, res)=> {

    const {nombres, email, phone, address } = req.body
    const new_User = {
        
        nombres,
        email,
        phone,
        address
    };
    await pool.query('INSERT INTO Usuario VALUES (idUsuario,nombres,email,phone,address)',[new_User, new_User.nombres,new_User.email,new_User.phone,new_User.address]);
    console.log(new_User);
    res.send('recibido');
});
module.exports= router;