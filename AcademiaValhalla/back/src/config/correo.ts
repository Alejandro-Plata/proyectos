import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const enviarCodigoReset = async (to: string, code: string, username: string) => {
    await transporter.sendMail({
        from: `"Valhalla" <${process.env.SMTP_FROM || 'noreply@valhalla.dev'}>`,
        to,
        subject: 'Código de recuperación — Valhalla',
        html: `
            <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: auto; padding: 32px; background: #0a0b0e; color: #e2e8f0; border-radius: 8px;">
                <h2 style="color: #10b981; margin-bottom: 8px;">Recuperar contraseña</h2>
                <p>Hola <strong>${username}</strong>,</p>
                <p>Tu código de verificación es:</p>
                <div style="text-align: center; margin: 24px 0;">
                    <span style="font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #10b981; background: #15171a; padding: 16px 32px; border-radius: 8px; display: inline-block;">
                        ${code}
                    </span>
                </div>
                <p style="color: #94a3b8; font-size: 14px;">Este código expira en <strong>10 minutos</strong>. Si no solicitaste esto, ignora este mensaje.</p>
            </div>
        `,
    });
};
