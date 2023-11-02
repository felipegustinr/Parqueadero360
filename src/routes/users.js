const express = require('express');
const router = express.Router();

const pool= require('../database');

router.get('/register',(req, res) =>{
res.render('users/register');
});

router.post('/register', async (req, res)=> {

    const {nombres, email, phone, address } = req.body
    const new_User = {
        
        nombres,
        email,
        phone,
        address
    };
    await pool.query('INSERT INTO Usuario (nombres, email, phone, address) VALUES (?, ?, ?, ?)', [new_User.nombres, new_User.email, new_User.phone, new_User.address]);
    res.send('Datos enviados')
});
router.get('/', async (req, res)=>{
    const users= await pool.query('SELECT * FROM ParqueaderoTest.Usuario;');
    console.log(users)
    res.send(users)
});


module.exports= router;