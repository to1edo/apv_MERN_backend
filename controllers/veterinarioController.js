import Veterinario from "../models/Veterinario.js"
import generarJWT from "../helpers/generarJWT.js"
import generarToken from "../helpers/generarToken.js"
import emailRegistro from "../helpers/emailRegistro.js"
import emailOlvidePassword from "../helpers/emailOlvidePassword.js"

const registrar = async (req,res)=>{

    const { email,nombre } = req.body

    //verificar si el usuario ya se encuentra registrado
    const existeUsuario = await Veterinario.findOne({ email })

    if(existeUsuario){
        const error = new Error('El usuario ya esta registrado')
        return res.status(400).json({ msg: error.message })
    }


    // guardar registro
    try {
        const veterinarioModelo = new Veterinario(req.body)
        const veterinarioGuardado = await veterinarioModelo.save();

        //enviar email de confirmacion
        emailRegistro({
            nombre,
            email,
            token: veterinarioGuardado.token
        })
        
        res.json(veterinarioGuardado)

    } catch (error) {
        console.log(error)
    }

}

const perfil =  (req,res)=>{

    const { veterinario } = req
    res.json({ veterinario })
}

const confirmar =  async(req,res)=>{

    const token =  req.params.token

    const existeUsuario = await Veterinario.findOne({ token })

    if(!existeUsuario){
        const error = new Error('El token no es valido')
        return res.status(404).json({ msg: error.message })
    }

    try {

        existeUsuario.token = null
        existeUsuario.confirmado = true

        await existeUsuario.save();
        
        res.json({ msg: 'Tu cuenta ha sido confirmada'})
    } catch (error) {
        console.log(error)
    }

}

const autenticar =  async(req,res)=>{

    const { email, password} = req.body
    
    //verificar si el usuario existe
    const usuario = await Veterinario.findOne({ email })
    if(!usuario){
        const error = new Error('El usuario no esta registrado')
        return res.status(404).json({ msg: error.message })
    }

    //verificar si el usuario esta confirmado
    if(!usuario.confirmado){
        const error = new Error('El usuario no esta confirmado')
        return res.status(401).json({ msg: error.message })
    }

    //si el usuario existe y esta confirmado, verificar el password
    const esCorrecta = await usuario.comprobarPassword(password, usuario.password)

    if(!esCorrecta){
        const error = new Error('EL password es incorrecto')
        return res.status(401).json({ msg: error.message })
    }
    
    //autenticar usuario
    const jwt = generarJWT(usuario.id)
    res.json({
        _id:usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        web: usuario.web,
        telefono:usuario.telefono,
        jwt 
    })

}


const olvidePassword = async(req, res)=>{

    const {email} = req.body

    //verificar si el usuario existe
    const usuario = await Veterinario.findOne({ email })
    if(!usuario){
        const error = new Error('El usuario no esta registrado')
        return res.status(404).json({ msg: error.message })
    }

    //verificar si el usuario esta confirmado
    if(!usuario.confirmado){
        const error = new Error('El usuario no esta confirmado')
        return res.status(401).json({ msg: error.message })
    }

    try {

        usuario.token = generarToken()
        await usuario.save()

        //enviar email de validacion
        emailOlvidePassword({ nombre: usuario.nombre, email: usuario.email, token: usuario.token })
        
        return res.json({ msg: "Hemos enviado un email con las instrucciones"})

    } catch (error) {
        console.log(error)
    }

    return res.json({ token })
}

const comprobarToken= async(req, res)=>{
    const {token} = req.params

    //verificar si el token es valido
    const usuario = await Veterinario.findOne({ token })
    if(!usuario){
        const error = new Error('El token no es valido')
        return res.status(404).json({ msg: error.message })
    }

    return res.json({ msg: "token valido" })
}

const cambiarPassword = async(req, res)=>{

    const { password, confirmPassword} = req.body
    const {token} = req.params

    //verificar si el token es valido
    const usuario = await Veterinario.findOne({ token })
    if(!usuario){
        const error = new Error('El token no es valido')
        return res.status(404).json({ msg: error.message })
    }

    //verificar coincidencia
    if(password !== confirmPassword){
        const error = new Error('Las contraseñas no coinciden')
        return res.status(404).json({ msg: error.message })
    }
    

    try {

        usuario.password = password
        usuario.token = null
        await usuario.save()

        return res.json({ msg: "La contraseña ha sido cambiada" })

    } catch (error) {
        console.log(error)
    }

}

const actualizarPerfil = async(req,res)=>{
    const { nombre, email, telefono,web} = req.body

    const {id} = req.params

    //verificar si el id es valido
    const usuario = await Veterinario.findOne({ _id: id })

    //verificar si el new email ya esta registrado
    const estaRegistrado = await Veterinario.findOne({ email })

    if(email !== usuario.email && estaRegistrado){
        const error = new Error('El email que intenta usar pertenece a otro usuario')
        return res.status(404).json({ msg: error.message })
    }
    
    if(!usuario){
        const error = new Error('Petición no válida')
        return res.status(404).json({ msg: error.message })
    }

    if ([nombre.trim(), email.trim()].includes('')) {
        const error = new Error('El nombre y Email son obligatorios')
        return res.status(403).json({ msg: error.message })
    }

    usuario.nombre = nombre
    usuario.email = email
    usuario.telefono = telefono
    usuario.web = web

    try {
        await usuario.save()
        return res.json({ msg: "Los datos fueron cambiados correctamente" })

    } catch (error) {
        console.log(error)
    }
}

const actualizarPassword = async(req,res)=>{
    const { password, newPassword, id} = req.body

    console.log(req.body)
    //verificar si el id es valido
    const usuario = await Veterinario.findOne({ _id: id })

    if(!usuario){
        const error = new Error('Petición no válida')
        return res.status(404).json({ msg: error.message })
    }

    if ([password.trim(), newPassword.trim()].includes('')) {
        const error = new Error('Todos lo campos son obligatorios')
        return res.status(403).json({ msg: error.message })
    }

    //verificar el password actual
    const esCorrecta = await usuario.comprobarPassword(password, usuario.password)

    if(!esCorrecta){
        const error = new Error('EL password actual es incorrecto')
        return res.status(401).json({ msg: error.message })
    }

    usuario.password = newPassword
    try {
        await usuario.save()
        return res.json({ msg: "La contraseña fue cambiada correctamente" })

    } catch (error) {
        console.log(error)
    }
}

export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    cambiarPassword,
    comprobarToken,
    actualizarPerfil,
    actualizarPassword
}