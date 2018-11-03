var express = require('express');

var mdAutentificacion = require('../middlewares/autenticacion');

var app = express();


var Hospital = require('../models/hospital');

// ========================================
//  Obtener todos los hospitales
// ========================================

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Hospital.find({})
        .populate('usuario', 'nombre email')
        .skip(desde)
        .limit(5)
        .exec(
            (err, hospitales) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al cargar los hospitales',
                        errors: err
                    });
                }

                Hospital.count({}, (err, cuenta) => {

                    res.status(200).json({
                        ok: true,
                        hospitales: hospitales,
                        total: cuenta
                    });

                });



            })
});

// ========================================
//  Actulizar hospital
// ========================================
app.put('/:id', mdAutentificacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (err, hospital) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar el hospital',
                errors: err
            });
        }

        if (!hospital) {

            return res.status(400).json({
                ok: false,
                mensaje: 'El hospital con el id:' + id + ' no existe',
                errors: { messsage: 'No existe un hospital con ese ID' }
            });

        }

        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;

        hospital.save((err, hospitalGuardado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar el hospital',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                hospital: hospitalGuardado
            });

        })

    });

});

// ========================================
//  Crear un nuevo hospital
// ========================================
app.post('/', mdAutentificacion.verificaToken, (req, res) => {

    var body = req.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario._id
    });

    hospital.save((err, hospitalGuardado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al crear el hospital',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado
        });

    })

});

// ========================================
//  Borrar un hospital por id
// ========================================
app.delete('/:id', mdAutentificacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar el hospital',
                errors: err
            });
        }

        if (!hospitalBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un hospital con ese id',
                errors: { messsage: 'No existe un hospital con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            hospital: hospitalBorrado
        });

    });

});

module.exports = app;