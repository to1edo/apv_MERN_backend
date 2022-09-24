import express from "express";
import dotenv from 'dotenv';
import cors from "cors";
import conectarDB from "./config/db.js";
import veterinarioRouter from "./routes/veterinarioRouter.js";
import pacientesRouter from "./routes/pacientesRouter.js";

const app = express();
app.use(express.json());
// app.use(express.urlencoded({extended:true}));

dotenv.config(); //detectar y definir la variables de entorno

conectarDB();  // conectar a la DB


//configuracion del cors
const dominiosPermitidos = [process.env.FRONTEND_URL];

const corsOptions={
    origin: function(origin, callback){
        if(dominiosPermitidos.indexOf(origin) !== -1){
            callback(null, true)
        }else{
            callback( new Error('No permitido por CORS'))
        }
    }
}
app.use(cors());

//Routers
app.use('/api/veterinarios', veterinarioRouter )
app.use('/api/pacientes', pacientesRouter )

const port  = process.env.PORT || 4000;

app.listen(port,()=>{
    console.log('Servidor Onfira!!')
})