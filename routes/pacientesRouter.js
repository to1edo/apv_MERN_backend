import express from "express";
import { mostrarPacientes, mostrarPaciente, registrarPaciente, actualizarPaciente, eliminarPaciente } from '../controllers/pacientesController.js';
import checkAuth from "../middleware/authMiddleware.js";

const router = express.Router()

router.route('/')
    .get(checkAuth, mostrarPacientes)
    .post(checkAuth, registrarPaciente)

router.route('/:id')
    .get(checkAuth,mostrarPaciente)
    .put(checkAuth, actualizarPaciente)
    .delete(checkAuth, eliminarPaciente)


export default router;