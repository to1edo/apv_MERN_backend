import jwt, { decode } from 'jsonwebtoken'
import Veterinario from '../models/Veterinario.js';

async function checkAuth(req, res, next) {

    let token

    if( req.headers.authorization &&  req.headers.authorization.startsWith('Bearer') ){
        
        try {
            token = req.headers.authorization.split(' ')[1];
            console.log(token, process.env.JWT_secret)
            const decoded = jwt.verify(token, process.env.JWT_secret)
            //here
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