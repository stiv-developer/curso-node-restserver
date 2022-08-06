const { response, request } = require('express');


const usuariosGet = (req = request, res = response) => {

    const { q, numero, nombre } = req.query;

    res.json({
        msg: 'get API - controlador',
        q,
        numero,
        nombre
    });

}

const usuariosPost = (req, res = response) => {
    const { nombre, apellido } = req.body;
    res.json({
        msg: 'patch API - controlador',
        nombre,
        apellido
    });

}

const usuariosPut = (req, res = response) => {

    const { id } = req.params
    res.json({
        msg: 'put API - usuariosPut',
        id
    });

}

const usuariosPatch = (req, res = response) => {

    res.json({
        msg: 'patch API - controlador'
    });

}

const usuariosDelete = (req, res = response) => {

    res.json({
        msg: 'delete API - controlador'
    });

}


module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}