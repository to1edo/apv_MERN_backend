import express from "express";
import { registrar, perfil, confirmar, autenticar, olvidePassword, comprobarToken, cambiarPassword, actualizarPerfil, actualizarPassword }from '../controllers/veterinarioController.js';
import checkAuth from "../middleware/authMiddleware.js";

const router = express.Router()

router.post('/', registrar)
router.get('/confirmar/:token', confirmar)
router.post('/login', autenticar)
router.post('/olvide-password', olvidePassword)
router.get('/olvide-password/:token', comprobarToken)
router.post('/olvide-password/:token', cambiarPassword)


//rutas protegidas
router.get('/perfil', checkAuth , perfil)
router.put('/perfil/:id', checkAuth , actualizarPerfil)
router.post('/actualizar-password', checkAuth , actualizarPassword)

export default router;