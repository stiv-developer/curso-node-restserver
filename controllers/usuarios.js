const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const usuariosGet = async(req = request, res = response) => {

    // const { q, numero, nombre } = req.query;
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };
    // const usuarios = await Usuario.find()
    //     .skip(Number(desde))
    //     .limit(Number(limite));

    const [total, usuarios] = await Promise.all([
        Usuario.count(query),
        Usuario.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ])

    res.json({
        total,
        usuarios
    });

}

const usuariosPost = async(req, res = response) => {


    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });
    // ENCRIPTAR LA CONTRASEÑA
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);
    // GUARDAR EN DB
    await usuario.save();
    res.json({
        msg: 'patch API - controlador',
        usuario
    });

}

const usuariosPut = async(req, res = response) => {

    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    // TODO VALIDAR contra base de datos
    if (password) {
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }
    const usuario = await Usuario.findByIdAndUpdate(id, resto);
    res.json({
        msg: 'put API - usuariosPut',
        usuario
    });

}

const usuariosPatch = (req, res = response) => {

    res.json({
        msg: 'patch API - controlador'
    });

}

const usuariosDelete = async(req, res = response) => {

    const { id } = req.params;
    //FISICAMENTE LO BORRAMOS
    // const usuario = await Usuario.findByIdAndDelete( id );
    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });

    // SABER QUE USUARIO FUE AUTENTICADO
    // const usuarioAutenticado = req.usuario;

    res.json({
        usuario
        //usuarioAutenticado
    });

}


module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}