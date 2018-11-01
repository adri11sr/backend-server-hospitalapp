// Requires
var express = require('express');
var mongoose = require('mongoose');



// Inicializar variables
var app = express();



// Conexion a la base de datos
let urlDB;
if (process.env.NODE_ENV === "dev") {
    urlDB = "mongodb://localhost:27017/hospitalDB";
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;


mongoose.connect('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) throw err;
    console.log(`Base de datos \x1b[32m%s\x1b[0m`, `ONLINE`);
});



// Rutas
app.get('/', (req, res, next) => {

    res.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada con exito'
    })

});



// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server port 3000: \x1b[32m%s\x1b[0m', 'online');
})