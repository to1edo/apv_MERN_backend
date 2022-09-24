import mongoose from "mongoose"
import bcrypt from "bcrypt"
import generarToken from "../helpers/generarToken.js"

const VeterinarioSchema = mongoose.Schema({
    nombre:{
        type: String,
        require: true,
        trim: true
    },

    password:{
        type: String,
        require: true
    },

    email:{
        type: String,
        require: true,
        trim: true,
        unique: true
    },

    telefono:{
        type: String,
        default: null,
        trim:true
    },

    web:{
        type: String,
        default: null,
        trim: true
    },

    token:{
        type: String,
        default: generarToken(),
    },

    confirmado:{
        type: Boolean,
        default: false
    }
})

//Hashear password
VeterinarioSchema.pre("save", async function(next){

    //verificar si ya ha sido hasheado
    if(!this.isModified("password")){
        next()
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt);
})

//comprobar password

VeterinarioSchema.methods.comprobarPassword = async function (passwordFormulario) {
    return await bcrypt.compare(passwordFormulario, this.password)
}

const Veterinario = mongoose.model("Veterinario", VeterinarioSchema);

export default Veterinario;
