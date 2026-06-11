import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './app/context/ThemeProvider';
import { UserProvider } from './app/context/UserProvider';
import { ProtectedRoute } from './app/features/auth/components/ProtectedRoute';
import { RoleGuard } from './app/features/auth/components/RoleGuard';
import { AchievementProvider } from './app/context/AchievementContext';
import { MessagingProvider } from './app/context/MessagingProvider';

const LayoutPanel        = lazy(() => import('./app/layouts').then(m => ({ default: m.LayoutPanel })));
const LandingPage        = lazy(() => import('./app/features/landing/LandingPage').then(m => ({ default: m.LandingPage })));
const LoginPage          = lazy(() => import('./app/features/auth').then(m => ({ default: m.LoginPage })));
const RegisterPage       = lazy(() => import('./app/features/auth').then(m => ({ default: m.RegisterPage })));
const ForgotPasswordPage = lazy(() => import('./app/features/auth/pages/ForgotPasswordPage/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })));
const BannedPage         = lazy(() => import('./app/features/auth/pages/BannedPage/BannedPage').then(m => ({ default: m.BannedPage })));
const OAuthCallbackPage  = lazy(() => import('./app/features/auth/pages/OAuthCallbackPage').then(m => ({ default: m.OAuthCallbackPage })));
const NotFoundPage       = lazy(() => import('./app/features/notFound/NotFoundPage').then(m => ({ default: m.NotFoundPage })));
const CodigoComportamiento = lazy(() => import('./app/features/conduct/CodigoComportamiento').then(m => ({ default: m.CodigoComportamiento })));
const TerminosCondiciones  = lazy(() => import('./app/features/legal/TerminosCondiciones').then(m => ({ default: m.TerminosCondiciones })));

// Dashboard pages
const PaginaPerfil   = lazy(() => import('./app/features/home').then(m => ({ default: m.PaginaPerfil })));
const SettingsPage   = lazy(() => import('./app/features/settings').then(m => ({ default: m.SettingsPage })));
const NotesPage      = lazy(() => import('./app/features/notes').then(m => ({ default: m.NotesPage })));
const NewNotePage    = lazy(() => import('./app/features/notes').then(m => ({ default: m.NewNotePage })));
const CreateNotePage = lazy(() => import('./app/features/notes').then(m => ({ default: m.CreateNotePage })));
const PaginaRetos    = lazy(() => import('./app/features/retos').then(m => ({ default: m.PaginaRetos })));
const ForumPage      = lazy(() => import('./app/features/community').then(m => ({ default: m.ForumPage })));
const CreatePostPage = lazy(() => import('./app/features/community').then(m => ({ default: m.CreatePostPage })));
const PostDetailPage = lazy(() => import('./app/features/community').then(m => ({ default: m.PostDetailPage })));
const UserProfilePage = lazy(() => import('./app/features/community').then(m => ({ default: m.UserProfilePage })));
const MessagingPage  = lazy(() => import('./app/features/messaging').then(m => ({ default: m.MessagingPage })));
const PaginaAsistente = lazy(() => import('./app/features/asistente').then(m => ({ default: m.PaginaAsistente })));
const PaginaAdmin    = lazy(() => import('./app/features/admin').then(m => ({ default: m.PaginaAdmin })));

const PageFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

export default function App() {
  return (
    <UserProvider>
      <ThemeProvider>
        <AchievementProvider>
          <MessagingProvider>
            <BrowserRouter>
              <Suspense fallback={<PageFallback />}>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/oauth/callback" element={<OAuthCallbackPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/banned" element={<BannedPage />} />
                  <Route path="/codigo-comportamiento" element={<CodigoComportamiento />} />
                  <Route path="/terminos" element={<TerminosCondiciones />} />

                  <Route element={<ProtectedRoute />}>
                    <Route path="dashboard" element={<LayoutPanel />}>
                      <Route index element={<PaginaPerfil />} />
                      <Route path="settings" element={<SettingsPage />} />
                      <Route path="notes" element={<NotesPage />} />
                      <Route path="notes/create" element={<CreateNotePage />} />
                      <Route path="notes/:noteId" element={<NewNotePage />} />
                      <Route path="challenges" element={<PaginaRetos />} />
                      <Route path="community" element={<ForumPage />} />
                      <Route path="community/createpost" element={<CreatePostPage />} />
                      <Route path="community/profile/:userId" element={<UserProfilePage />} />
                      <Route path="community/:id" element={<PostDetailPage />} />
                      <Route path="messages" element={<MessagingPage />} />
                      <Route path="assistant" element={<PaginaAsistente />} />

                      <Route element={<RoleGuard allowedRoles={['ADMIN']} />}>
                        <Route path="admin" element={<PaginaAdmin />} />
                      </Route>

                      <Route path="*" element={<NotFoundPage />} />
                    </Route>
                  </Route>

                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </MessagingProvider>
        </AchievementProvider>
      </ThemeProvider>
    </UserProvider>
  );
}
