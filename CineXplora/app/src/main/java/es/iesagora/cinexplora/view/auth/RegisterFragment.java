package es.iesagora.cinexplora.view.auth;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;
import androidx.navigation.NavController;
import androidx.navigation.Navigation;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.appcompat.app.AlertDialog;

import com.bumptech.glide.Glide;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.tasks.Task;

import es.iesagora.cinexplora.MainActivity;
import es.iesagora.cinexplora.R;
import es.iesagora.cinexplora.controller.viewmodel.AuthViewmodel;
import es.iesagora.cinexplora.controller.viewmodel.UserViewmodel;
import es.iesagora.cinexplora.databinding.FragmentRegisterBinding;


public class RegisterFragment extends Fragment {

    private FragmentRegisterBinding binding;
    private AuthViewmodel viewModel;
    private UserViewmodel userViewmodel;
    private NavController navController;

    private Uri selectedPhotoUri;

    // Variables para Google Sign-In
    private GoogleSignInClient googleClient;
    private ActivityResultLauncher<Intent> googleLauncher;
    private ActivityResultLauncher<Intent> profileImageLauncher;

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        binding = FragmentRegisterBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        navController = Navigation.findNavController(view);
        viewModel = new ViewModelProvider(this).get(AuthViewmodel.class);
        userViewmodel = new ViewModelProvider(this).get(UserViewmodel.class);

        // 1. Configurar observadores
        observeAuthState();

        // 2. Configurar listeners
        initializeListeners();

        // 3. Configurar Google Sign-In
        configureGoogleSignIn();
        initializeLauncherGoogleSignIn();

        // 4. Configurar lanzador de imagen de perfil
        initializeProfileImageLauncher();
    }

    // --- LÓGICA DE IMAGEN DE PERFIL ---

    private void initializeProfileImageLauncher() {
        profileImageLauncher = registerForActivityResult(
                new ActivityResultContracts.StartActivityForResult(),
                result -> {
                    if (result.getResultCode() == Activity.RESULT_OK
                            && result.getData() != null) {
                        Uri imageUri = result.getData().getData();
                        if (imageUri != null) {
                            selectedPhotoUri = imageUri;
                            Glide.with(this)
                                    .load(imageUri)
                                    .placeholder(R.drawable.ic_default_avatar)
                                    .into(binding.imgProfileRegister);
                        }
                    }
                }
        );
    }

    // --- LÓGICA DE GOOGLE SIGN-IN ---

    private void configureGoogleSignIn() {
        GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestEmail()
                .requestIdToken(getString(R.string.default_web_client_id))
                .build();

        googleClient = GoogleSignIn.getClient(requireActivity(), gso);
    }

    private void initializeLauncherGoogleSignIn() {
        googleLauncher = registerForActivityResult(
                new ActivityResultContracts.StartActivityForResult(),
                result -> {
                    if (result.getResultCode() != Activity.RESULT_OK || result.getData() == null) {
                        new AlertDialog.Builder(requireActivity())
                                .setMessage(getString(R.string.msg_google_cancelled))
                                .setPositiveButton(getString(R.string.dialog_accept), null)
                                .show();
                        return;
                    }

                    Task<GoogleSignInAccount> task =
                            GoogleSignIn.getSignedInAccountFromIntent(result.getData());

                    gestionarResultadoSignIn(task);
                }
        );
    }

    private void gestionarResultadoSignIn(Task<GoogleSignInAccount> task) {
        try {
            GoogleSignInAccount account = task.getResult(ApiException.class);

            if (account == null || account.getIdToken() == null) {
                new AlertDialog.Builder(requireActivity())
                        .setMessage(getString(R.string.msg_google_account_error))
                        .setPositiveButton(getString(R.string.dialog_accept), null)
                        .show();
                return;
            }

            viewModel.loginWithGoogle(account.getIdToken());

        } catch (ApiException e) {
            new AlertDialog.Builder(requireActivity())
                    .setMessage(getString(R.string.msg_google_error, e.getMessage()))
                    .setPositiveButton(getString(R.string.dialog_accept), null)
                    .show();
        }
    }

    private void observeAuthState() {
        viewModel.getAuthState().observe(getViewLifecycleOwner(), state -> {
            if (state == null) return;

            showLoading(state.loading);

            if (state.error != null) {
                showError(state.error);
            } else {
                hideError();
            }

            if (state.user != null) {
                if (selectedPhotoUri != null) {
                    uploadPhotoAndNavigate();
                } else {
                    goToMain();
                }
            }
        });
    }

    private void uploadPhotoAndNavigate() {
        userViewmodel.refreshUserId();
        userViewmodel.uploadProfilePhoto(selectedPhotoUri)
                .observe(getViewLifecycleOwner(), uploadRes -> {
                    switch (uploadRes.status) {
                        case LOADING:
                            break;
                        case SUCCESS:
                        case ERROR:
                            goToMain();
                            break;
                    }
                });
    }

    private void initializeListeners() {
        binding.btnAddPhoto.setOnClickListener(v -> {
            Intent intent = new Intent(Intent.ACTION_PICK,
                    MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
            profileImageLauncher.launch(intent);
        });

        binding.btnRegister.setOnClickListener(v -> {
            String name = binding.etName.getText().toString().trim();
            String email = binding.etEmailReg.getText().toString().trim();
            String pass = binding.etPassReg.getText().toString().trim();
            String confirmPass = binding.etConfirmPass.getText().toString().trim();

            if (validateForm(name, email, pass, confirmPass)) {
                viewModel.register(email, pass, name);
            }
        });

        binding.tvLoginLink.setOnClickListener(v -> {
            navController.popBackStack();
        });

        binding.googleSignInButton.setOnClickListener(v -> {
            Intent signInIntent = googleClient.getSignInIntent();
            googleLauncher.launch(signInIntent);
        });
    }

    private boolean validateForm(String name, String email, String pass, String confirmPass) {
        boolean esValido = true;

        if (name.isEmpty()) {
            binding.tilName.setError(getString(R.string.error_name_required));
            esValido = false;
        } else {
            binding.tilName.setError(null);
        }

        String emailPattern = "^[^@]+@[^@]+\\.[a-zA-Z]{2,}$";

        if (email.isEmpty()) {
            binding.tilEmailReg.setError(getString(R.string.error_email_required));
            esValido = false;
        } else if (!email.matches(emailPattern)) {
            binding.tilEmailReg.setError(getString(R.string.error_email_invalid));
            esValido = false;
        } else {
            binding.tilEmailReg.setError(null);
        }

        String passwordPattern = "^(?=.*[a-zA-Z])(?=.*\\d).{8,}$";

        if (pass.isEmpty()) {
            binding.tilPassReg.setError(getString(R.string.error_password_required));
            esValido = false;
        } else if (!pass.matches(passwordPattern)) {
            binding.tilPassReg.setError(getString(R.string.error_password_weak));
            esValido = false;
        } else {
            binding.tilPassReg.setError(null);
        }

        if (confirmPass.isEmpty()) {
            binding.tilConfirmPass.setError(getString(R.string.error_confirm_password));
            esValido = false;
        } else if (!pass.equals(confirmPass)) {
            binding.tilConfirmPass.setError(getString(R.string.error_passwords_mismatch));
            esValido = false;
        } else {
            binding.tilConfirmPass.setError(null);
        }

        return esValido;
    }

    private void showLoading(boolean cargando) {
        if (cargando) {
            binding.layoutLoadingReg.setVisibility(View.VISIBLE);
            binding.btnRegister.setEnabled(false);
            binding.tvLoginLink.setEnabled(false);
            binding.googleSignInButton.setEnabled(false);
            hideError();
        } else {
            binding.layoutLoadingReg.setVisibility(View.GONE);
            binding.btnRegister.setEnabled(true);
            binding.tvLoginLink.setEnabled(true);
            binding.googleSignInButton.setEnabled(true);
        }
    }

    private void showError(String mensaje) {
        binding.tvErrorReg.setText(mensaje);
        binding.tvErrorReg.setVisibility(View.VISIBLE);
    }

    private void hideError() {
        binding.tvErrorReg.setVisibility(View.GONE);
    }

    private void goToMain() {
        Intent intent = new Intent(requireContext(), MainActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        startActivity(intent);
        requireActivity().finish();
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}
