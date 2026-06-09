package es.iesagora.cinexplora.controller.viewmodel;

import android.app.Application;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.MutableLiveData;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.ListenerRegistration;

import java.util.List;

import es.iesagora.cinexplora.controller.repository.FavoriteActorsRepository;
import es.iesagora.cinexplora.model.FavoriteActor;
import es.iesagora.cinexplora.model.states.Resource;

public class FavoriteActorsViewmodel extends AndroidViewModel {

    private final FavoriteActorsRepository repository;
    private String userId;
    private ListenerRegistration favoritesListener;

    public MutableLiveData<Resource<List<FavoriteActor>>> favoriteActors = new MutableLiveData<>();
    public MutableLiveData<Boolean> isFavorite = new MutableLiveData<>(false);

    public FavoriteActorsViewmodel(@NonNull Application application) {
        super(application);
        repository = new FavoriteActorsRepository();

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

    @Override
    protected void onCleared() {
        super.onCleared();
        if (favoritesListener != null) favoritesListener.remove();
    }
}
