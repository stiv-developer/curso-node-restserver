const { Router } = require('express');

const { usuariosGet, usuariosPut, usuariosPatch, usuariosDelete, usuariosPost } = require('../controllers/usuarios');

const router = Router();

router.get('/', usuariosGet);

router.post('/', usuariosPost);

router.put('/:id', usuariosPut);

router.post('/', usuariosPatch);

router.delete('/', usuariosDelete);

module.exports = router;