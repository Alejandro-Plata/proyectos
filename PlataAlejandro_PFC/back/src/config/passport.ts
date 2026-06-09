import dotenv from 'dotenv';
dotenv.config();
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Usuario } from '../modelos/Modelos.js';

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL!,
            scope: ['email', 'profile'],
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await Usuario.findOne({ where: { google_id: profile.id } }) as any;

                if (!user && profile.emails?.[0]?.value) {
                    user = await Usuario.findOne({ where: { email: profile.emails[0].value } }) as any;
                    if (user) {
                        user.google_id = profile.id;
                        user.avatar_url = user.avatar_url || profile.photos?.[0]?.value;
                        await user.save();
                    }
                }

                if (!user) {
                    const baseUsername = profile.displayName?.replace(/\s+/g, '_') || `user_${profile.id.slice(0, 8)}`;
                    let username = baseUsername;
                    let suffix = 1;
                    while (await Usuario.findOne({ where: { username } })) {
                        username = `${baseUsername}_${suffix++}`;
                    }

                    user = await Usuario.create({
                        username,
                        email: profile.emails?.[0]?.value || '',
                        google_id: profile.id,
                        avatar_url: profile.photos?.[0]?.value,
                        role: 'USUARIO',
                        current_level: 1,
                        experience_points: 0,
                        password: '',
                    }) as any;
                }

                return done(null, user);
            } catch (err) {
                return done(err as Error, undefined);
            }
        }
    ));
} else {
    console.warn('Google OAuth no configurado: faltan GOOGLE_CLIENT_ID o GOOGLE_CLIENT_SECRET');
}

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    passport.use(new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: process.env.GITHUB_CALLBACK_URL!,
            scope: ['user:email'],
        },
        async (accessToken: string, refreshToken: string, profile: any, done: any) => {
            try {
                let user = await Usuario.findOne({ where: { github_id: profile.id } }) as any;

                if (!user && profile.emails?.[0]?.value) {
                    user = await Usuario.findOne({ where: { email: profile.emails[0].value } }) as any;
                    if (user) {
                        user.github_id = profile.id;
                        user.github_url = profile._json.html_url;
                        user.avatar_url = user.avatar_url || profile.photos?.[0]?.value;
                        await user.save();
                    }
                }

                if (!user) {
                    const baseUsername = profile.username || `gh_${profile.id}`;
                    let username = baseUsername;
                    let suffix = 1;
                    while (await Usuario.findOne({ where: { username } })) {
                        username = `${baseUsername}_${suffix++}`;
                    }

                    user = await Usuario.create({
                        username,
                        email: profile.emails?.[0]?.value || '',
                        github_id: profile.id,
                        github_url: profile._json?.html_url,
                        avatar_url: profile.photos?.[0]?.value,
                        role: 'USUARIO',
                        current_level: 1,
                        experience_points: 0,
                        password: '',
                    }) as any;
                }

                return done(null, user);
            } catch (err) {
                return done(err as Error, undefined);
            }
        }
    ));
} else {
    console.warn('GitHub OAuth no configurado: faltan GITHUB_CLIENT_ID o GITHUB_CLIENT_SECRET');
}

export default passport;

