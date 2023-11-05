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
    res.flash('correcto','Dato creado correctamente');
    res.redirect('/users')
});

router.get('/', async (req, res)=>{
    const users= await pool.query('SELECT * FROM ParqueaderoTest.Usuario;');
    res.render('users/list',{users});
});

router.get('/delete/:idUsuario', async (req, res) =>{
    const {idUsuario} = req.params;
    await pool.query('DELETE FROM Usuario WHERE (idUsuario = ? )',[idUsuario]);
    res.redirect('/users');
});

router.get('/edit/:idUsuario', async (req,res)=>{
    const{idUsuario} = req.params;
    const users = await pool.query('SELECT * FROM Usuario WHERE (idUsuario = ?)',[idUsuario]);
    res.render('users/edit',{list:users[0]});
});

router.post('/edit/:idUsuario', async (req,res)=>{
    const {idUsuario} = req.params;
    const {nombres, email, phone,address} = req.body;
    const editedUser = {
        nombres,
        email,
        phone,
        address
    };
    await pool.query('UPDATE Usuario SET ? WHERE idUsuario = ? ',[editedUser,idUsuario]);
    res.redirect('/users');
});

module.exports= router;