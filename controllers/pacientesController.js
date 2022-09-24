import Paciente from "../models/Paciente.js"

const mostrarPacientes = async(req,res)=>{
    const pacientes = await Paciente.find({veterinario: req.veterinario})

    if(!pacientes){
        return res.json({msg: "No hay pacientes registrados"})
    }
    res.json(pacientes)
}

const mostrarPaciente = async(req,res)=>{

    const id = req.params.id
    
    const paciente = await Paciente.findById(id)

    if(!paciente || paciente.veterinario.toString() !== req.veterinario._id.toString()){
        return res.json({msg: "Consulta no valida"})
    }

    
    res.json(paciente)

}

const registrarPaciente = async(req,res)=>{

    const paciente = new Paciente(req.body)
    
    try {
        paciente.veterinario = req.veterinario._id
        const pacienteRegistrado =  await paciente.save()
        
        console.log(pacienteRegistrado)
        res.json(pacienteRegistrado)
    } catch (error) {
        console.log(error.response)
    }

}


const actualizarPaciente = async(req,res)=>{

    const id = req.params.id
    const {nombre, propietario,email,fechaAlta,sintomas} = req.body

    const paciente = await Paciente.findById(id)

    if(!paciente || paciente.veterinario.toString() !== req.veterinario._id.toString()){
        return res.json({msg: "Peticion no valida"})
    }

    paciente.nombre = nombre;
    paciente.propietario = propietario;
    paciente.email = email;
    paciente.fechaAlta = fechaAlta;
    paciente.sintomas = sintomas;

    try {
        const pacienteActualizado = await paciente.save()
        res.json(pacienteActualizado)
        
    } catch (error) {
        console.log(error)
    }


}

const eliminarPaciente = async(req,res)=>{

    const id = req.params.id
    
    const paciente = await Paciente.findById(id)

    if(!paciente || paciente.veterinario.toString() !== req.veterinario._id.toString()){
        return res.json({msg: "Peticion no valida"})
    }

    try {
        await paciente.deleteOne()
        res.json({msg: "Paciente eliminado"})
        
    } catch (error) {
        console.log(error)
    }
    
}

export{
    mostrarPacientes,
    mostrarPaciente,
    registrarPaciente,
    actualizarPaciente,
    eliminarPaciente
}