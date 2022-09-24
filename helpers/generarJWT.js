import jwt from "jsonwebtoken"

function generarJWT(id){
    return jwt.sign({id}, process.env.JWT_SECRET)
}

export default generarJWT