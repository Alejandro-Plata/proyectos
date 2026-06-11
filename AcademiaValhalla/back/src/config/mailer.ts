import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export async function enviarCodigoReset(email: string, code: string, username: string): Promise<void> {
    
    if (!process.env.SMTP_USER) return;
    
    await transporter.sendMail({
        from: `"Soporte" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Código de recuperación de contraseña',
        html: `<p>Hola <strong>${username}</strong>,</p><p>Tu código de verificación es: <strong>${code}</strong></p><p>Caduca en 10 minutos.</p>`,
    });
    
}
