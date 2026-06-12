package es.iesagora.cinexplora.view.auth;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;

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

import com.google.android.material.dialog.MaterialAlertDialogBuilder;

import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.tasks.Task;

import es.iesagora.cinexplora.MainActivity;
import es.iesagora.cinexplora.R;
import es.iesagora.cinexplora.controller.viewmodel.AuthViewmodel;
import es.iesagora.cinexplora.databinding.FragmentLoginBinding;

public class LoginFragment extends Fragment {
    private FragmentLoginBinding binding;
    private AuthViewmodel viewModel;
    private NavController navController;
    private GoogleSignInClient googleClient;
    private ActivityResultLauncher<Intent> googleLauncher;




    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        binding = FragmentLoginBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        navController = Navigation.findNavController(view);
        viewModel = new ViewModelProvider(this).get(AuthViewmodel.class);

        if (viewModel.getCurrentUser() != null) {
            goToMain();
            return;
        }

        observeAuthState();
        initializeListeners();
        configureGoogleSignIn();
        initializeLauncherGoogleSignIn();
    }

    private void configureGoogleSignIn() {
        GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestEmail()
                .requestIdToken(getString(R.string.default_web_client_id))
                .build();

        googleClient = GoogleSignIn.getClient(requireActivity(), gso);
    }


    // Inicializa el launcher que recibirá el resultado del selector de Google
    private void initializeLauncherGoogleSignIn() {
        googleLauncher = registerForActivityResult(
                new ActivityResultContracts.StartActivityForResult(),
                result -> {
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
                new MaterialAlertDialogBuilder(requireActivity())
                        .setMessage(getString(R.string.msg_google_account_error))
                        .setPositiveButton(getString(R.string.dialog_accept), null)
                        .show();
                return;
            }

            viewModel.loginWithGoogle(account.getIdToken());

        } catch (ApiException e) {
            new MaterialAlertDialogBuilder(requireActivity())
                    .setMessage(getString(R.string.msg_google_error_code, String.valueOf(e.getStatusCode()), e.getMessage()))
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

            // Gestión de éxito
            if (state.user != null) {
                goToMain();
            }
        });
    }

    private void initializeListeners() {
        binding.btnLogin.setOnClickListener(v -> {
            String email = binding.etEmail.getText().toString().trim();
            String pass = binding.etPassword.getText().toString().trim();

            if (validateForm(email, pass)) {
                viewModel.login(email, pass);
            }
        });

        binding.tvRegisterLink.setOnClickListener(v -> {
            navController.navigate(R.id.action_loginFragment_to_registerFragment);
        });

        binding.googleSignInButton.setOnClickListener(v -> {
            googleClient.revokeAccess().addOnCompleteListener(task -> {
                Intent signInIntent = googleClient.getSignInIntent();
                googleLauncher.launch(signInIntent);
            });
        });

        binding.tvForgotPassword.setOnClickListener(v -> {
            navController.navigate(R.id.action_loginFragment_to_forgotPasswordFragment);
        });
    }

    // Método auxiliar para controlar tu layoutLoading (Overlay)
    private void showLoading(boolean isLoading) {
        if (isLoading) {
            binding.layoutLoading.setVisibility(View.VISIBLE);
            binding.btnLogin.setEnabled(false);
            binding.googleSignInButton.setEnabled(false);
            binding.tvRegisterLink.setEnabled(false);
            hideError();
        } else {
            binding.layoutLoading.setVisibility(View.GONE);
            binding.btnLogin.setEnabled(true);
            binding.googleSignInButton.setEnabled(true);
            binding.tvRegisterLink.setEnabled(true);
        }
    }

    private void showError(String mensaje) {
        binding.tvError.setText(mensaje);
        binding.tvError.setVisibility(View.VISIBLE);
    }

    private void hideError() {
        binding.tvError.setVisibility(View.GONE);
    }

    private boolean validateForm(String email, String pass) {
        if (email.isEmpty()) {
            binding.tilEmail.setError(getString(R.string.error_email_required));
            return false;
        } else {
            binding.tilEmail.setError(null);
        }

        if (pass.isEmpty()) {
            binding.tilPassword.setError(getString(R.string.error_password_required));
            return false;
        } else {
            binding.tilPassword.setError(null);
        }
        return true;
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