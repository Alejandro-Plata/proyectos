package es.iesagora.cinexplora;

import android.content.Context;
import android.content.Intent;
import android.content.res.Configuration;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import es.iesagora.cinexplora.controller.repository.SharedPreferencesRepository;
import es.iesagora.cinexplora.model.Language;

import androidx.annotation.NonNull;
import com.google.android.material.dialog.MaterialAlertDialogBuilder;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.app.AppCompatDelegate;
import androidx.lifecycle.ViewModelProvider;
import androidx.navigation.NavController;
import androidx.navigation.fragment.NavHostFragment;
import androidx.navigation.ui.AppBarConfiguration;
import androidx.navigation.ui.NavigationUI;

import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.auth.UserInfo;
import es.iesagora.cinexplora.controller.viewmodel.UserViewmodel;
import es.iesagora.cinexplora.controller.viewmodel.AlertViewmodel;
import es.iesagora.cinexplora.controller.viewmodel.AuthViewmodel;
import es.iesagora.cinexplora.controller.viewmodel.SharedPreferencesViewmodel;
import es.iesagora.cinexplora.databinding.ActivityMainBinding;
import es.iesagora.cinexplora.model.PendingMedia;

public class MainActivity extends AppCompatActivity {

    ActivityMainBinding binding;
    NavController navController;
    AppBarConfiguration appBarConfiguration;
    SharedPreferencesViewmodel spViewmodel;
    AlertViewmodel alertViewmodel;
    private UserViewmodel userViewmodel;

    private boolean checkDone = false;

    private GoogleSignInClient googleClient;
    private FirebaseUser user;
    private AuthViewmodel authvm;

    @Override
    protected void attachBaseContext(Context newBase) {
        SharedPreferencesRepository repo = new SharedPreferencesRepository(newBase);
        java.util.Locale locale = repo.getLocale();
        java.util.Locale.setDefault(locale);
        Configuration config = new Configuration();
        config.setLocale(locale);
        super.attachBaseContext(newBase.createConfigurationContext(config));
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView((binding = ActivityMainBinding.inflate(getLayoutInflater())).getRoot());

        authvm = new ViewModelProvider(this).get(AuthViewmodel.class);
        user = authvm.getCurrentUser();

        if (user == null) {
            goToLogin();
            return;
        }

        configurateGoogleSignIn();

        spViewmodel = new ViewModelProvider(this).get(SharedPreferencesViewmodel.class);
        spViewmodel.loadTheme();
        spViewmodel.getTheme().observe(this, isDark -> {
            if (isDark != null) {
                AppCompatDelegate.setDefaultNightMode(
                        isDark ? AppCompatDelegate.MODE_NIGHT_YES : AppCompatDelegate.MODE_NIGHT_NO);
            }
        });
        spViewmodel.loadLanguage();
        spViewmodel.applyLanguage(this);

        alertViewmodel = new ViewModelProvider(this).get(AlertViewmodel.class);
        userViewmodel = new ViewModelProvider(this).get(UserViewmodel.class);

        userViewmodel.loadUsername();

        String username = userViewmodel.getUsername().getValue();

        alertViewmodel.getPendingItems().observe(this, items -> {
            if (checkDone)
                return;
            checkDone = true;
            alertViewmodel.processPendingItems(items, username != null ? username : "");
        });

        alertViewmodel.getState().observe(this, state -> {
            if (state == 1) {
                showSetupNameDialog();
                alertViewmodel.setState(0);
            } else if (state == 2) {
                PendingMedia randomItem = alertViewmodel.getSelectedMediaItem().getValue();
                if (randomItem != null) {
                    showWelcomeBackDialog(username != null ? username : "", randomItem);
                    alertViewmodel.setState(0);
                }
            }
        });

        NavHostFragment navHostFragment = (NavHostFragment) getSupportFragmentManager()
                .findFragmentById(R.id.nav_host_fragment);

        if (navHostFragment != null) {
            navController = navHostFragment.getNavController();
            setSupportActionBar(binding.toolbar);

            appBarConfiguration = new AppBarConfiguration.Builder(
                    R.id.watchlistFragment,
                    R.id.exploreFragment,
                    R.id.followUpFragment,
                    R.id.favoriteActorsFragment).build();

            NavigationUI.setupActionBarWithNavController(this, navController, appBarConfiguration);
            NavigationUI.setupWithNavController(binding.bottomNavigation, navController);

            navController.addOnDestinationChangedListener((controller, destination, arguments) -> {
                if (destination.getId() == R.id.addTrackingFragment        ||
                        destination.getId() == R.id.moviesDetailFragment   ||
                        destination.getId() == R.id.seriesDetailFragment   ||
                        destination.getId() == R.id.personDetailFragment   ||
                        destination.getId() == R.id.detailTrackingFragment ||
                        destination.getId() == R.id.settingsFragment) {
                    binding.bottomNavigation.setVisibility(View.GONE);
                } else {
                    binding.bottomNavigation.setVisibility(View.VISIBLE);
                }
            });
        }

    }



    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.options_menu, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(@NonNull MenuItem item) {
        int id = item.getItemId();

        if (id == R.id.action_settings) {
            navController.navigate(R.id.settingsFragment);
            return true;
        } else if (id == R.id.action_logout) {
            showLogoutDialog();
            return true;
        }

        return NavigationUI.onNavDestinationSelected(item, navController)
                || super.onOptionsItemSelected(item);
    }

    @Override
    public boolean onSupportNavigateUp() {
        return NavigationUI.navigateUp(navController, appBarConfiguration)
                || super.onSupportNavigateUp();
    }

    private void showSetupNameDialog() {
        new MaterialAlertDialogBuilder(this)
                .setTitle(getString(R.string.dialog_welcome_title))
                .setMessage(getString(R.string.dialog_welcome_message))
                .setPositiveButton(getString(R.string.dialog_go_to_settings), (dialog, which) -> {
                    navController.navigate(R.id.settingsFragment);
                })
                .setNegativeButton(getString(R.string.dialog_later), (dialog, which) -> dialog.dismiss())
                .setCancelable(false)
                .show();
    }

    private void showWelcomeBackDialog(String name, PendingMedia item) {
        String typeStr = item.getType().equals("movie")
                ? getString(R.string.type_movie_lower)
                : getString(R.string.type_serie_lower);
        String mensaje = getString(R.string.dialog_tracking_pending_message,
                name, typeStr, item.getTitle());

        new MaterialAlertDialogBuilder(this)
                .setTitle(getString(R.string.dialog_tracking_pending_title))
                .setMessage(mensaje)
                .setPositiveButton(getString(R.string.dialog_add_tracking), (dialog, which) -> {
                    Bundle bundle = new Bundle();
                    bundle.putString("arg_title", item.getTitle());
                    bundle.putString("arg_type", item.getType());
                    bundle.putInt("arg_tmdb_id", item.getTmdbId());
                    bundle.putString("arg_poster_path", item.getPosterPath());
                    navController.navigate(R.id.addTrackingFragment, bundle);
                })
                .setNegativeButton(getString(R.string.dialog_not_yet), (dialog, which) -> dialog.dismiss())
                .setCancelable(false)
                .show();
    }

    private void configurateGoogleSignIn() {
        GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestEmail()
                .requestIdToken(getString(R.string.default_web_client_id))
                .build();
        googleClient = GoogleSignIn.getClient(this, gso);
    }

    private void goToLogin() {
        Intent intent = new Intent(this, AuthActivity.class);
        intent.addFlags(
                Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        startActivity(intent);
        finish();
    }

    // Método auxiliar para no repetir código de logout
    private void performLogout() {
        authvm.logout();

        if (isGoogleLogin() && googleClient != null) {
            googleClient.signOut();
        }
        goToLogin();
    }

    private boolean isGoogleLogin() {
        if (user == null)
            return false;
        for (UserInfo profile : user.getProviderData()) {
            if ("google.com".equals(profile.getProviderId())) {
                return true;
            }
        }
        return false;
    }

    private void showLogoutDialog() {
        new MaterialAlertDialogBuilder(this)
                .setTitle(getString(R.string.dialog_logout_title))
                .setMessage(getString(R.string.dialog_logout_message))
                .setPositiveButton(getString(R.string.dialog_logout_confirm), (dialog, which) -> {
                    performLogout();
                })
                .setNegativeButton(getString(R.string.dialog_cancel), (dialog, which) -> dialog.dismiss())
                .show();
    }
}