const { response } = require("express");
const bcryptjs = require("bcryptjs");

const Usuario = require("../models/usuario");

const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");


const login = async(req, res = response) => {

    const { correo, password } = req.body;

    try {
        // VEREFICAR SI EL EMAIL EXISTE
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            })
        }
        // SI EL USUARIO ESTA ACTIVO
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false'
            })
        }
        // VEREFICAR LA CONTRASEÑA
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            })
        }
        // GENERAR EL JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
}

const googleSignIn = async(req, res = response) => {
    // EL ID TOKEN DEBE DE VENIR DE REQUEST
    const { id_token } = req.body;

    try {
        // SIN DESESTRUCTURACION
        // const googleUser = await googleVerify(id_token);

        // CON DESESTRUCTURACION
        const { correo, nombre, img } = await googleVerify(id_token);

        let usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            //TENGO QUE CREARLO
            // EN DATA SE VA ALMACENAR LOS DATOS DEL USUARIO
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                rol: 'ADMIN_ROLE',
                google: true
            }
            usuario = new Usuario(data);
            await usuario.save();
        }

        // SI EL USUARIO EN DB
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

        // GENERAR EL JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });
    } catch (error) {
        console.log(error)
        res.status(400).json({
            msg: 'El token no es valido'
        })
    }
}


module.exports = {
    login,
    googleSignIn
}