const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async(req = request, res = response, next) => {
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        // Leer el usuario que corresponde al uid
        const usuario = await Usuario.findById(uid);

        // SI NO SE ENCUNTRA EL USUARIO
        if (!usuario) {
            return res.status(401).json({
                msg: 'TOKEN NO VALIDO - USUARIO NO EXISTE EN DB'
            })
        }

        // VEREFICAR SI EL "UID TIENE ESTADO TRUE"
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'TOKEN NO VALIDO'
            })
        };


        req.usuario = usuario;

        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no valido'
        })
    }
}

module.exports = {
    validarJWT
}