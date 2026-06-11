import jwt from 'jsonwebtoken'

export const generarJWT = (user_id: string, expiresIn: string = '30d') => {
    return jwt.sign({ id: user_id }, process.env.JWT_SECRET!, { expiresIn } as jwt.SignOptions);
};

export const verificarJWT = (token: string): { id: string } | null => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    } catch {
        return null;
    }
};
