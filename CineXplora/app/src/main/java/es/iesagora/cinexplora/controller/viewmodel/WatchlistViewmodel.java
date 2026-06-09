package es.iesagora.cinexplora.controller.viewmodel;

import android.app.Application;
import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.MutableLiveData;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.ListenerRegistration;

import java.util.List;

import es.iesagora.cinexplora.controller.repository.PendingRepository;
import es.iesagora.cinexplora.model.PendingMedia;
import es.iesagora.cinexplora.model.states.Resource;

public class WatchlistViewmodel extends AndroidViewModel {

    private final PendingRepository repository;
    private String userId;
    private ListenerRegistration pendingListener;

    public MutableLiveData<Resource<List<PendingMedia>>> pendingItems = new MutableLiveData<>();

    public WatchlistViewmodel(@NonNull Application application) {
        super(application);
        repository = new PendingRepository();

        FirebaseUser user = FirebaseAuth.getInstance().getCurrentUser();
        if (user != null) {
            userId = user.getUid();
            pendingListener = repository.getPending(userId,
                    result -> pendingItems.postValue(result));
        }
    }

    public MutableLiveData<Resource<List<PendingMedia>>> getAllPending() {
        return pendingItems;
    }

    public void addItem(PendingMedia item) {
        if (userId != null) {
            repository.addPending(userId, item);
        }
    }

    public void deleteItem(PendingMedia item) {
        if (userId != null) {
            repository.deletePending(userId, item.getTmdbId());
        }
    }

    public boolean exists(int tmdbId) {
        Resource<List<PendingMedia>> resource = pendingItems.getValue();
        if (resource == null || resource.data == null) return false;
        for (PendingMedia item : resource.data) {
            if (item.getTmdbId() == tmdbId) return true;
        }
        return false;
    }

    @Override
    protected void onCleared() {
        super.onCleared();
        if (pendingListener != null) pendingListener.remove();
    }
}