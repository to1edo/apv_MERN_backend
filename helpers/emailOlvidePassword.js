import nodemailer from 'nodemailer'

async function emailOlvidePassword({nombre,email,token}) {

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
        subject: "Recupera el acceso a tu cuenta en APV", // Subject line
        text: "Recupera el acceso a tu cuenta", // plain text body
        html: `
            <p>Hola ${nombre}, has solicitado reestablecer la contraseña de tu cuenta en APV</p>
            <p>Para continuar, solo debes seguir el enlace a continuación: <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Cambiar contraseña</a></p>
            
            <p>Si no solicitaste el cambio, puedes ignorar este mensaje</p>
        ` // html body
    });

    console.log("enviado: ",info.messageId)
}

export default emailOlvidePassword;