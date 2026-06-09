package es.iesagora.cinexplora.controller.viewmodel;

import android.app.Application;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.MutableLiveData;

import es.iesagora.cinexplora.controller.repository.MediaRepository;
import es.iesagora.cinexplora.controller.repository.SharedPreferencesRepository;
import es.iesagora.cinexplora.model.request.PersonDetail;
import es.iesagora.cinexplora.model.response.CombinedCreditsResponse;
import es.iesagora.cinexplora.model.states.Resource;

public class PersonViewmodel extends AndroidViewModel {

    private final MediaRepository repository;
    private final SharedPreferencesRepository sharedPreferences;

    public MutableLiveData<Resource<PersonDetail>> personDetail = new MutableLiveData<>();
    public MutableLiveData<Resource<CombinedCreditsResponse>> combinedCredits = new MutableLiveData<>();

    public PersonViewmodel(@NonNull Application application) {
        super(application);
        repository = new MediaRepository();
        sharedPreferences = new SharedPreferencesRepository(application);
    }

    public void loadPersonDetail(int personId) {
        repository.setLanguage(sharedPreferences.getLanguage());

        repository.getPersonDetailWithFallback(personId, result -> {
            personDetail.postValue(result);
        });
    }

    public void loadCombinedCredits(int personId) {
        repository.setLanguage(sharedPreferences.getLanguage());

        repository.getPersonCombinedCredits(personId, result -> {
            combinedCredits.postValue(result);
        });
    }
}
