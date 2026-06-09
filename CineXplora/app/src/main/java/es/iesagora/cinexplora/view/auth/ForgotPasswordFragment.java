package es.iesagora.cinexplora.view.auth;

import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;
import androidx.navigation.NavController;
import androidx.navigation.Navigation;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import es.iesagora.cinexplora.controller.viewmodel.AuthViewmodel;
import es.iesagora.cinexplora.databinding.FragmentForgotPasswordBinding;

public class ForgotPasswordFragment extends Fragment {
    private FragmentForgotPasswordBinding binding;
    private AuthViewmodel viewModel;
    private NavController navController;

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        binding = FragmentForgotPasswordBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        navController = Navigation.findNavController(view);
        viewModel = new ViewModelProvider(this).get(AuthViewmodel.class);

        setupListeners();
        observeViewModel();
    }

    private void setupListeners() {
        binding.btnSendReset.setOnClickListener(v -> {
            String email = binding.etEmailReset.getText().toString().trim();
            if (email.isEmpty()) {
                binding.tilEmailReset.setError("Introduce tu correo");
            } else {
                binding.tilEmailReset.setError(null);
                viewModel.resetPassword(email);
            }
        });

        binding.btnBack.setOnClickListener(v -> navController.popBackStack());
    }

    private void observeViewModel() {
        viewModel.getIsLoading().observe(getViewLifecycleOwner(), isLoading -> {
            if (isLoading != null) {
                binding.layoutLoadingReset.setVisibility(isLoading ? View.VISIBLE : View.GONE);
                binding.btnSendReset.setEnabled(!isLoading);
            }
        });

        viewModel.getResetPasswordSuccess().observe(getViewLifecycleOwner(), success -> {
            if (success != null && success) {
                showSuccesfulDialog();
            }
        });

        viewModel.getResetPasswordError().observe(getViewLifecycleOwner(), errorMsg -> {
            if (errorMsg != null) {
                binding.tvErrorReset.setText(errorMsg);
                binding.tvErrorReset.setVisibility(View.VISIBLE);
            } else {
                binding.tvErrorReset.setVisibility(View.GONE);
            }
        });
    }

    private void showSuccesfulDialog() {
        new AlertDialog.Builder(requireContext())
                .setTitle("Correo enviado")
                .setMessage("Revisa tu bandeja de entrada. Hemos enviado un enlace para restablecer tu contraseña.")
                .setPositiveButton("Volver al Login", (dialog, which) -> {
                    navController.popBackStack(); // Volvemos al login automáticamente
                })
                .setCancelable(false)
                .show();
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}