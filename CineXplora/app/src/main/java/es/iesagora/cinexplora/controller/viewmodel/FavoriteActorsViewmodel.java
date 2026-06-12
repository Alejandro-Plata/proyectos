package es.iesagora.cinexplora.controller.viewmodel;

import android.app.Application;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.MutableLiveData;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.ListenerRegistration;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

import es.iesagora.cinexplora.controller.repository.FavoriteActorsRepository;
import es.iesagora.cinexplora.controller.repository.MediaRepository;
import es.iesagora.cinexplora.model.FavoriteActor;
import es.iesagora.cinexplora.model.states.Resource;

public class FavoriteActorsViewmodel extends AndroidViewModel {

    private final FavoriteActorsRepository repository;
    private final MediaRepository mediaRepository;
    private String userId;
    private ListenerRegistration favoritesListener;
    private final Map<Integer, String> birthdayCache = new HashMap<>();

    public MutableLiveData<Resource<List<FavoriteActor>>> favoriteActors = new MutableLiveData<>();
    public MutableLiveData<Boolean> isFavorite = new MutableLiveData<>(false);
    public MutableLiveData<Set<Integer>> todayBirthdays = new MutableLiveData<>(new HashSet<>());

    public FavoriteActorsViewmodel(@NonNull Application application) {
        super(application);
        repository = new FavoriteActorsRepository();
        mediaRepository = new MediaRepository();

        FirebaseUser user = FirebaseAuth.getInstance().getCurrentUser();
        if (user != null) {
            userId = user.getUid();
            favoritesListener = repository.getFavoriteActors(userId,
                    result -> favoriteActors.postValue(result));
        }
    }

    public MutableLiveData<Resource<List<FavoriteActor>>> getFavoriteActors() {
        return favoriteActors;
    }

    public MutableLiveData<Set<Integer>> getTodayBirthdays() {
        return todayBirthdays;
    }

    public void addFavorite(FavoriteActor actor) {
        if (userId != null) {
            repository.addFavorite(userId, actor);
            isFavorite.postValue(true);
        }
    }

    public void removeFavorite(int personId) {
        if (userId != null) {
            repository.removeFavorite(userId, personId);
            isFavorite.postValue(false);
        }
    }

    public void checkIfFavorite(int personId) {
        if (userId != null) {
            repository.checkIfFavorite(userId, personId,
                    result -> isFavorite.postValue(result));
        }
    }

    public void checkBirthdaysForActors(List<FavoriteActor> actors) {
        String today = new SimpleDateFormat("MM-dd", Locale.US).format(new Date());
        Set<Integer> birthdays = new HashSet<>();

        for (FavoriteActor actor : actors) {
            int id = actor.getPersonId();
            if (birthdayCache.containsKey(id)) {
                String bday = birthdayCache.get(id);
                if (bday != null && bday.length() >= 5 && bday.substring(5).equals(today)) {
                    birthdays.add(id);
                }
            } else {
                mediaRepository.getPersonDetail(id, result -> {
                    if (result.status == Resource.Status.SUCCESS && result.data != null) {
                        String bday = result.data.getBirthday();
                        birthdayCache.put(id, bday);
                        if (bday != null && bday.length() >= 5
                                && bday.substring(5).equals(today)) {
                            Set<Integer> current = todayBirthdays.getValue();
                            Set<Integer> updated = current != null
                                    ? new HashSet<>(current) : new HashSet<>();
                            updated.add(id);
                            todayBirthdays.postValue(updated);
                        }
                    }
                });
            }
        }

        if (!birthdays.isEmpty()) {
            todayBirthdays.postValue(birthdays);
        }
    }

    @Override
    protected void onCleared() {
        super.onCleared();
        if (favoritesListener != null) favoritesListener.remove();
    }
}
