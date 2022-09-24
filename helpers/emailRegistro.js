import nodemailer from 'nodemailer'

async function emailRegistro({nombre,email,token}) {

    var transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth:{
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })

    // send mail with defined transport object
    let info = await transport.sendMail({
        from: 'APV Administrador de Pacientes de Veterinaria', // sender address
        to: email, // list of receivers
        subject: "Confirma tu cuenta en APV", // Subject line
        text: "Confirma tu cuenta en APV", // plain text body
        html: `
            <p>Hola ${nombre}, confirma tu cuenta en APV</p>
            <p>Tu cuenta ha sido creada correctamente, solo debes confirmarla por medio de siguente enlace: <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Confirmar Cuenta</a></p>
            
            <p>Si no creaste esta cuenta, puedes ignorar este mensaje</p>
        ` // html body
    });

    console.log("enviado: ",info.messageId)
}

export default emailRegistro;