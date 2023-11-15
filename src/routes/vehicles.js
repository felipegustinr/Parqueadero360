const express = require('express');
const router = express.Router();
const pool= require('../database');

// MODULO DE REGISTRO DE VEHICULOS

router.get('/register',(req, res) =>{
res.render('vehicles/register');
});

router.post('/register', async (req, res)=> {

    const {placa, marca, modelo, color } = req.body
    const new_Vehicle = {
        
        placa,
        marca,
        modelo,
        color
    };
    await pool.query('INSERT INTO Vehiculo (placa, marca, modelo, color) VALUES (?, ?, ?, ?)', [new_Vehicle.placa, new_Vehicle.marca, new_Vehicle.modelo, new_Vehicle.color]);
    req.flash('success', 'Vehiculo creado Correctamente');
    res.redirect('/vehicles')
});

// MODULO DE LISTADO DE VEHICULOS

router.get('/', async (req, res)=>{
    const vehicles= await pool.query('SELECT * FROM ParqueaderoTest.Vehiculo;');
    res.render('vehicles/list',{vehicles});
});

// MODULO DE ELIMINADO DE VEHICULOS
router.get('/delete/:idVehiculo', async (req, res) =>{
    const {idVehiculo} = req.params;
    await pool.query('DELETE FROM Vehiculo WHERE (idVehiculo = ? )',[idVehiculo]);
    req.flash('success', 'Vehiculo Eliminado Correctamente');
    res.redirect('/vehicles');
});

// MODULO EDICIÓN DE VEHICULOS
router.get('/edit/:idVehiculo', async (req,res)=>{
    const{idVehiculo} = req.params;
    const vehicles = await pool.query('SELECT * FROM Vehiculo WHERE (idVehiculo = ?)',[idVehiculo]);
    res.render('vehicles/edit',{list:vehicles[0]});
});

router.post('/edit/:idVehiculo', async (req,res)=>{
    const {idVehiculo} = req.params;
    const {placa, marca, modelo,color} = req.body;
    const editVehicle = {
        placa,
        marca,
        modelo,
        color
    };
    await pool.query('UPDATE Vehiculo SET ? WHERE idVehiculo = ? ',[editVehicle,idVehiculo]);
    req.flash('success', 'Vehiculo Editado Correctamente');
    res.redirect('/vehicles');
});

module.exports= router;