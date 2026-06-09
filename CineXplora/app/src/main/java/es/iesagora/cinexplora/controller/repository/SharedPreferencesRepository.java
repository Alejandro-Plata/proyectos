package es.iesagora.cinexplora.controller.repository;

import android.content.Context;
import android.content.SharedPreferences;

import es.iesagora.cinexplora.model.Language;

public class SharedPreferencesRepository {

    private static final String PREFS_NAME = "prefs";
    private static final String KEY_PRIMER_INGRESO = "first_income";
    private static final String KEY_THEME = "user_theme";
    private static final String KEY_CONNECTION_TYPE = "user_connection_type";
    private static final String KEY_LANGUAGE = "user_language";

    private final SharedPreferences sharedPreferences;

    public SharedPreferencesRepository(Context context) {
        sharedPreferences = context.getApplicationContext()
                .getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
    }

    public boolean isPrimerIngreso() {
        return sharedPreferences.getBoolean(KEY_PRIMER_INGRESO, true); // Por defecto true
    }

    public void setPrimerIngreso(boolean value) {
        sharedPreferences.edit()
                .putBoolean(KEY_PRIMER_INGRESO, value) // Abre editor y guarda
                .apply(); // Confirma cambios
    }

    public boolean isDark() {
        return sharedPreferences.getBoolean(KEY_THEME, false);
    }

    public void setIsDark(boolean value) {
        sharedPreferences.edit()
                .putBoolean(KEY_THEME, value)
                .apply();
    }

    public Language getLanguage() {
        String langName = sharedPreferences.getString(KEY_LANGUAGE, Language.SPANISH.name());
        try {
            return Language.valueOf(langName);
        } catch (IllegalArgumentException e) {
            return Language.SPANISH; // fallback para valores antiguos (GERMAN, CATALAN, FRENCH)
        }
    }

    public void setLanguage(Language language) {
        sharedPreferences.edit()
                .putString(KEY_LANGUAGE, language.name()) // Guarda el nombre del Enum
                .apply();
    }

    public boolean isOnlyWifi() {
        return sharedPreferences.getBoolean(KEY_CONNECTION_TYPE, false);
    }

    public void setConnectionType(boolean value) {
        sharedPreferences.edit()
                .putBoolean(KEY_CONNECTION_TYPE, value)
                .apply();
    }

    public void applyLanguage(Context context) {
        java.util.Locale locale = getLocale();
        java.util.Locale.setDefault(locale);
        android.content.res.Configuration config = context.getResources().getConfiguration();
        config.setLocale(locale);
        context.getResources().updateConfiguration(config, context.getResources().getDisplayMetrics());
    }

    public java.util.Locale getLocale() {
        Language lang = getLanguage();
        return new java.util.Locale(lang == Language.ENGLISH ? "en" : "es");
    }
}