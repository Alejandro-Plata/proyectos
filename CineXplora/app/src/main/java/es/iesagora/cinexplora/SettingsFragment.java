package es.iesagora.cinexplora;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatDelegate;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;

import com.bumptech.glide.Glide;

import es.iesagora.cinexplora.controller.viewmodel.AuthViewmodel;
import es.iesagora.cinexplora.controller.viewmodel.SharedPreferencesViewmodel;
import es.iesagora.cinexplora.controller.viewmodel.UserViewmodel;
import es.iesagora.cinexplora.databinding.FragmentSettingsBinding;
import es.iesagora.cinexplora.model.Language;

public class SettingsFragment extends Fragment {

    FragmentSettingsBinding binding;
    SharedPreferencesViewmodel viewmodel;
    AuthViewmodel authViewmodel;
    private UserViewmodel userViewmodel;
    private ActivityResultLauncher<Intent> photoLauncher;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        binding = FragmentSettingsBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        viewmodel = new ViewModelProvider(this).get(SharedPreferencesViewmodel.class);
        authViewmodel = new ViewModelProvider(this).get(AuthViewmodel.class);
        userViewmodel = new ViewModelProvider(this).get(UserViewmodel.class);

        viewmodel.loadTheme();
        viewmodel.loadLanguage();
        userViewmodel.loadUsername();
        userViewmodel.loadPhotoUrl();
        viewmodel.loadConnectionType();

        setupPhotoLauncher();
        setupListeners();
        setupSpinner();
        setupObservers();
    }

    private void setupPhotoLauncher() {
        photoLauncher = registerForActivityResult(
                new ActivityResultContracts.StartActivityForResult(),
                result -> {
                    if (result.getResultCode() == Activity.RESULT_OK
                            && result.getData() != null) {
                        Uri imageUri = result.getData().getData();
                        if (imageUri != null) {
                            userViewmodel.uploadProfilePhoto(imageUri)
                                    .observe(getViewLifecycleOwner(), uploadRes -> {
                                        switch (uploadRes.status) {
                                            case LOADING:
                                                binding.btnChangePhoto.setEnabled(false);
                                                break;
                                            case SUCCESS:
                                                binding.btnChangePhoto.setEnabled(true);
                                                Glide.with(this)
                                                        .load(uploadRes.data)
                                                        .placeholder(R.drawable.ic_default_avatar)
                                                        .into(binding.imgProfileSettings);
                                                break;
                                            case ERROR:
                                                binding.btnChangePhoto.setEnabled(true);
                                                new AlertDialog.Builder(requireContext())
                                                        .setMessage(uploadRes.message)
                                                        .setPositiveButton(getString(R.string.dialog_accept), null)
                                                        .show();
                                                break;
                                        }
                                    });
                        }
                    }
                });
    }

    private void setupSpinner() {
        ArrayAdapter<CharSequence> adapter = ArrayAdapter.createFromResource(
                requireContext(),
                R.array.languages_array,
                R.layout.spinner_item
        );

        adapter.setDropDownViewResource(R.layout.spinner_item);
        binding.spinnerLanguage.setAdapter(adapter);

        viewmodel.getLanguage().observe(getViewLifecycleOwner(), language -> {
            if (language != null) {
                binding.spinnerLanguage.setSelection(language.ordinal());
            }
        });
    }

    private void showLogoutDialog() {
        new AlertDialog.Builder(requireContext())
                .setTitle(getString(R.string.dialog_logout_title))
                .setMessage(getString(R.string.dialog_logout_message))
                .setPositiveButton(getString(R.string.dialog_logout_confirm), (dialog, which) -> {
                    authViewmodel.logout();

                    Intent intent = new Intent(requireContext(), AuthActivity.class);
                    intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                    startActivity(intent);
                    requireActivity().finish();
                })
                .setNegativeButton(getString(R.string.dialog_cancel), null)
                .show();
    }

    private void setupListeners() {
        binding.btnChangePhoto.setOnClickListener(v -> {
            Intent intent = new Intent(Intent.ACTION_PICK,
                    MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
            photoLauncher.launch(intent);
        });

        binding.btnSave.setOnClickListener(v -> {
            boolean isDarkSelected = binding.toggleTheme.getCheckedButtonId() == R.id.btnDark;

            viewmodel.themeChanged(isDarkSelected);

            if (isDarkSelected) {
                AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_YES);
            } else {
                AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO);
            }

            int position = binding.spinnerLanguage.getSelectedItemPosition();
            Language[] languages = Language.values();
            if (position >= 0 && position < languages.length) {
                viewmodel.languageChanged(languages[position]);
            }

            String username = binding.etUsername.getText().toString().trim();
            userViewmodel.usernameChanged(username);

            boolean onlyWifiActivated = binding.switchWifi.isChecked();
            viewmodel.connectionTypeChanged(onlyWifiActivated);

            viewmodel.applyLanguage(requireContext());

            new AlertDialog.Builder(requireContext())
                    .setTitle(getString(R.string.msg_settings_saved))
                    .setPositiveButton(getString(R.string.dialog_accept), (dialog, which) -> {
                        requireActivity().recreate();
                    })
                    .show();
        });

        binding.btnReset.setOnClickListener(v -> {
            binding.etUsername.setText("");
            userViewmodel.usernameChanged("");
            binding.switchWifi.setChecked(false);
            binding.toggleTheme.check(R.id.btnLight);
            binding.spinnerLanguage.setSelection(0);
            viewmodel.resetDefaults();
            viewmodel.applyLanguage(requireContext());
            AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO);

            new AlertDialog.Builder(requireContext())
                    .setTitle(getString(R.string.msg_settings_reset))
                    .setPositiveButton(getString(R.string.dialog_accept), (dialog, which) -> {
                        requireActivity().recreate();
                    })
                    .show();
        });

        binding.btnLogout.setOnClickListener(v -> {
            showLogoutDialog();
        });
    }

    private void setupObservers() {
        viewmodel.getTheme().observe(getViewLifecycleOwner(), isDark -> {
            if (isDark != null && isDark) {
                binding.toggleTheme.check(R.id.btnDark);
            } else {
                binding.toggleTheme.check(R.id.btnLight);
            }
        });

        viewmodel.getConnectionType().observe(getViewLifecycleOwner(), isWifiOnly -> {
            if (isWifiOnly != null) {
                binding.switchWifi.setChecked(isWifiOnly);
            }
        });

        userViewmodel.getUsername().observe(getViewLifecycleOwner(), name -> {
            if (name != null) binding.etUsername.setText(name);
        });

        userViewmodel.getPhotoUrl().observe(getViewLifecycleOwner(), url -> {
            Glide.with(this)
                    .load(url)
                    .placeholder(R.drawable.ic_default_avatar)
                    .error(R.drawable.ic_default_avatar)
                    .into(binding.imgProfileSettings);
        });
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}
