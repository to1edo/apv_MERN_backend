import jwt, { decode } from 'jsonwebtoken'
import Veterinario from '../models/Veterinario.js';

async function checkAuth(req, res, next) {

    let token
    console.log(req.headers.authorization)
    if( req.headers.authorization &&  req.headers.authorization.startsWith('Bearer') ){
        
        try {
            token = req.headers.authorization.split(' ')[1];
            console.log(token)
            const decoded = jwt.verify(token, process.env.JWT_secret)
            console.log(decoded)
            req.veterinario = await Veterinario.findById(decoded.id).select("-password -token -confirmado")
            console.log(req.veterinario)
            return next()

        } catch (error) {
            const e = new Error('Token no valido')
            return  res.status(403).json({ msg: e.message })
        }
    }

    if(!token){
        const error = new Error('Token no valido o inexistente')
        return res.status(403).json({ msg: error.message })
    }
    
    // next() ??
}



export default checkAuth