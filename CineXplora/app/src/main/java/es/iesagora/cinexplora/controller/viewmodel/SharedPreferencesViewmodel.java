package es.iesagora.cinexplora.controller.viewmodel;

import android.app.Application;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.MutableLiveData;
import es.iesagora.cinexplora.controller.repository.SharedPreferencesRepository;
import es.iesagora.cinexplora.model.Language;

public class SharedPreferencesViewmodel extends AndroidViewModel {

    private MutableLiveData<Boolean> firstIncome = new MutableLiveData<>();
    private MutableLiveData<Boolean> theme = new MutableLiveData<>();
    private MutableLiveData<Boolean> connectionType = new MutableLiveData<>();
    private MutableLiveData<Language> language = new MutableLiveData<>();
    private SharedPreferencesRepository repository;

    public SharedPreferencesViewmodel(@NonNull Application application) {
        super(application);
        this.repository = new SharedPreferencesRepository(application);
    }

    public void checkFirstIncome() {
        firstIncome.postValue(repository.isPrimerIngreso());
    }

    public void updateFirstIncome() {
        repository.setPrimerIngreso(false);
    }

    public MutableLiveData<Boolean> getfirstIncome() {
        return firstIncome;
    }

    public void themeChanged(boolean isDark) {
        repository.setIsDark(isDark);
        theme.setValue(isDark);
    }

    public void languageChanged(Language lang) {
        repository.setLanguage(lang);
        language.setValue(lang);
    }


    public void connectionTypeChanged(boolean isOnlyWifi) {
        repository.setConnectionType(isOnlyWifi);
        connectionType.setValue(isOnlyWifi);
    }


    public MutableLiveData<Boolean> getTheme() {
        return theme;
    }

    public MutableLiveData<Boolean> getConnectionType() {
        return connectionType;
    }

    public MutableLiveData<Language> getLanguage() {
        return language;
    }
    public void resetDefaults() {

        repository.setConnectionType(false);
        repository.setIsDark(false);
        repository.setLanguage(Language.SPANISH);

        connectionType.postValue(false);
        theme.postValue(false);
        language.postValue(Language.SPANISH);

    }

    public void loadTheme() {
        theme.postValue(repository.isDark());
    }

    public void loadLanguage() {
        language.postValue(repository.getLanguage());
    }

    public void loadConnectionType() {
        connectionType.postValue(repository.isOnlyWifi());
    }

    public void applyLanguage(android.content.Context context) {
        repository.applyLanguage(context);
    }
}
