const express = require('express');
const router = express.Router();
const cursoController = require('../controllers/cursoController');

router.get('/', cursoController.obtenerCursos);
router.get('/:id', cursoController.obtenerCursoPorId);
router.post('/', cursoController.crearCurso);
router.delete('/:id', cursoController.eliminarCurso);
router.put('/:id/estado', cursoController.actualizarEstadoCurso);

module.exports = router;
