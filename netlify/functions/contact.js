const nodemailer = require("nodemailer");

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Método no permitido" }),
      };
    }

    const { name, email, message } = JSON.parse(event.body || "{}");

    if (!name || !email || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Faltan campos requeridos." }),
      };
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Formulario Web" <${process.env.SMTP_USER}>`,
      to: process.env.EMAIL_TO,
      subject: `Nuevo mensaje desde la web - ${name}`,
      replyTo: email,
      text: `
Nombre: ${name}
Correo: ${email}

Mensaje:
${message}
      `,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "Mensaje enviado correctamente." }),
    };
  } catch (error) {
    console.error("Error enviando correo:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error interno enviando el mensaje." }),
    };
  }
};
