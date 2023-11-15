const mysql = require('mysql');
const {promisify} = require('util');
const { database } = require('./keys');
const { error } = require('console');
const pool = mysql.createPool(database);

//MODULO DE PRUEBA DE CONEXION DE LA DB
pool.getConnection((error, connection) => {
    if (error) {

        if (error.code === 'PROTOCOL _CONNECTION_LOST') {
            console.error('Se ha perdido la conexión a la Base de Datos');
        }
        if (error.code === 'ER_CON_COUNT_ERROR') {
            console.error('La Base de Datos tiene Demasiadas Conexiones');
        }
        if (error.code === 'ECONNREFUSED') {
            console.error('Error al Conectarse a la Base de Datos');
        }
    }
    if (connection) connection.release();
    console.warn('La Base de Datos se a Conectado Correctamente');
    return;
});

pool.query= promisify(pool.query);
module.exports = pool;