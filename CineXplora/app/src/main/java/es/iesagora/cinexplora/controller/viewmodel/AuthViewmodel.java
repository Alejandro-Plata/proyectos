package es.iesagora.cinexplora.controller.viewmodel;

import android.app.Application;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.google.firebase.auth.FirebaseUser;

import es.iesagora.cinexplora.controller.repository.AuthRepository;
import es.iesagora.cinexplora.controller.repository.UserRepository;
import es.iesagora.cinexplora.model.UserProfile;
import es.iesagora.cinexplora.model.states.AuthState;

public class AuthViewmodel extends AndroidViewModel {

    private final AuthRepository authRepo;
    private final UserRepository userRepository;
    private final MutableLiveData<AuthState> authState = new MutableLiveData<>();
    private final MutableLiveData<String> resetPasswordError = new MutableLiveData<>();
    private final MutableLiveData<Boolean> resetPasswordSuccess = new MutableLiveData<>();
    private final MutableLiveData<Boolean> isLoading = new MutableLiveData<>();

    public AuthViewmodel(@NonNull Application application) {
        super(application);
        userRepository = new UserRepository();
        authRepo = new AuthRepository();
    }

    public MutableLiveData<AuthState> getAuthState() {
        return authState;
    }
    public LiveData<String> getResetPasswordError() {
        return resetPasswordError;
    }
    public LiveData<Boolean> getResetPasswordSuccess() {
        return resetPasswordSuccess;
    }
    public LiveData<Boolean> getIsLoading() {
        return isLoading;
    }

    public FirebaseUser getCurrentUser() {
        return authRepo.getCurrentUser();
    }

    public void logout() {
        authRepo.logout();
    }

    public void login(String email, String password) {
        String error = validate(email, password);
        if (error != null) {
            authState.setValue(AuthState.error(error));
            return;
        }

        authState.setValue(AuthState.loading());

        authRepo.login(email.trim(), password, new AuthRepository.AuthCallback() {
            @Override public void onSuccess(FirebaseUser user) {
                authState.postValue(AuthState.success(user));
            }
            @Override public void onError(String message) {
                authState.postValue(AuthState.error(message));
            }
        });
    }

    public void loginWithGoogle(String idToken) {
        authState.setValue(AuthState.loading());

        authRepo.loginWithGoogle(idToken, task -> {
            if (task.isSuccessful()) {
                FirebaseUser user = task.getResult().getUser();
                authState.setValue(AuthState.success(user));
            } else {
                String error = task.getException() != null ?
                        task.getException().getMessage() : "Error en Google Login";
                authState.setValue(AuthState.error(error));
            }
        });
    }

    public void register(String email, String password, String name) {
        String error = validate(email, password);

        if (error != null) {
            authState.setValue(AuthState.error(error));
            return;
        }

        authState.setValue(AuthState.loading());

        authRepo.register(email.trim(), password, new AuthRepository.AuthCallback() {
            @Override
            public void onSuccess(FirebaseUser user) {
                UserProfile profile = new UserProfile(
                        name,
                        user.getEmail(),
                        null,
                        System.currentTimeMillis()
                );
                userRepository.saveProfile(user.getUid(), profile,
                        new UserRepository.UserCallback() {
                            @Override public void onSuccess() {
                                authState.postValue(AuthState.success(user));
                            }
                            @Override public void onError(String message) {
                                authState.postValue(AuthState.success(user));
                            }
                        });
            }
            @Override
            public void onError(String message) {
                authState.postValue(AuthState.error(message));
            }
        });
    }

    public void resetPassword(String email) {
        isLoading.setValue(true);

        authRepo.sendPasswordResetEmail(email, task -> {
            isLoading.setValue(false);
            if (task.isSuccessful()) {
                resetPasswordSuccess.setValue(true);
                resetPasswordSuccess.setValue(null);
            } else {
                String errorMsg = task.getException() != null ? task.getException().getMessage() : "Error desconocido";
                resetPasswordError.setValue(errorMsg);
                resetPasswordError.setValue(null);
            }
        });
    }

    private String validate(String email, String password) {
        if (email == null || email.trim().isEmpty()) return "El correo es obligatorio.";
        if (password == null || password.isEmpty()) return "La contraseña es obligatoria.";
        return null;
    }

}