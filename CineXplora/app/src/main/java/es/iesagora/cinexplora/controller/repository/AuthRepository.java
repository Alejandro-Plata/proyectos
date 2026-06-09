package es.iesagora.cinexplora.controller.repository;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.firebase.auth.AuthCredential;
import com.google.firebase.auth.AuthResult;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.auth.GoogleAuthProvider;

import es.iesagora.cinexplora.model.UserProfile;

public class AuthRepository {

    private final FirebaseAuth auth;
    private final UserRepository userRepository = new UserRepository();

    public AuthRepository() {
        auth = FirebaseAuth.getInstance();
    }

    public interface AuthCallback {
        void onSuccess(FirebaseUser user);
        void onError(String message);
    }

    public void login(String email, String password, AuthCallback callback) {
        auth.signInWithEmailAndPassword(email, password)
                .addOnSuccessListener(result -> callback.onSuccess(auth.getCurrentUser()))
                .addOnFailureListener(e -> callback.onError(mapError(e)));
    }

    public void register(String email, String password, AuthCallback callback) {
        auth.createUserWithEmailAndPassword(email, password)
                .addOnSuccessListener(result -> callback.onSuccess(auth.getCurrentUser()))
                .addOnFailureListener(e -> callback.onError(mapError(e)));
    }

    public void registerAndSaveProfile(String email, String password,
                                       String name, AuthCallback callback) {
        auth.createUserWithEmailAndPassword(email, password)
                .addOnSuccessListener(result -> {
                    FirebaseUser user = auth.getCurrentUser();
                    if (user == null) {
                        callback.onError("Error al obtener el usuario tras registro.");
                        return;
                    }

                    UserProfile profile = new UserProfile(
                            name,
                            email,
                            null,
                            System.currentTimeMillis()
                    );

                    userRepository.saveProfile(user.getUid(), profile, new UserRepository.UserCallback() {
                        @Override
                        public void onSuccess() {
                            callback.onSuccess(user);
                        }

                        @Override
                        public void onError(String message) {
                            callback.onSuccess(user);
                        }
                    });
                })
                .addOnFailureListener(e -> callback.onError(mapError(e)));
    }

    public FirebaseUser getCurrentUser() {
        return auth.getCurrentUser();
    }

    public void logout() {
        auth.signOut();
    }

    private String mapError(Exception e) {
        if (e == null) return "Error desconocido.";

        String errorMsg = e.getMessage();
        if (errorMsg == null) return "Error desconocido.";

        // Control de errores de autenticación para una mejor experiencia de usuario

        if (errorMsg.contains("EMAIL_ALREADY_IN_USE") || errorMsg.contains("email-already-in-use")) {
            return "El correo electrónico ya está en uso.";
        }

        if (errorMsg.contains("WEAK_PASSWORD") || errorMsg.contains("weak-password")) {
            return "La contraseña es muy débil.";
        }

        // Para login u otros errores de autenticación según petición del usuario
        return "Email o contraseña incorrectos";
    }

    public void loginWithGoogle(String idToken, OnCompleteListener<AuthResult> listener) {
        AuthCredential credential = GoogleAuthProvider.getCredential(idToken, null);
        auth.signInWithCredential(credential).addOnCompleteListener(listener);
    }

    public void sendPasswordResetEmail(String email, OnCompleteListener<Void> listener) {
        auth.sendPasswordResetEmail(email)
                .addOnCompleteListener(listener);
    }
}