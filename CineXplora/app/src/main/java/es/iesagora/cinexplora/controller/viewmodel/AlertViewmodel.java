package es.iesagora.cinexplora.controller.viewmodel;

import android.app.Application;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.ListenerRegistration;

import java.util.List;
import java.util.Random;

import es.iesagora.cinexplora.controller.repository.AuthRepository;
import es.iesagora.cinexplora.controller.repository.PendingRepository;
import es.iesagora.cinexplora.controller.repository.UserRepository;
import es.iesagora.cinexplora.model.PendingMedia;
import es.iesagora.cinexplora.model.states.Resource;

public class AlertViewmodel extends AndroidViewModel {

    UserRepository userRepo;
    PendingRepository pendingRepository;
    AuthRepository authRepository;
    private String userId;
    private ListenerRegistration pendingListener;

    // 0: ni nombre ni elementos, 1: sin nombre, 2: con nombre
    private final MutableLiveData<Integer> state = new MutableLiveData<>();
    private final MutableLiveData<PendingMedia> selectedMediaItem = new MutableLiveData<>();
    private final MutableLiveData<List<PendingMedia>> pendingItems = new MutableLiveData<>();

    public AlertViewmodel(@NonNull Application application) {
        super(application);
        pendingRepository = new PendingRepository();
        authRepository = new AuthRepository();
        userRepo = new UserRepository();

        FirebaseUser user = FirebaseAuth.getInstance().getCurrentUser();
        if (user != null) {
            userId = user.getUid();
            pendingListener = pendingRepository.getPending(userId, result -> {
                if (result.status == Resource.Status.SUCCESS) {
                    pendingItems.postValue(result.data);
                }
            });
        }
    }

    public LiveData<List<PendingMedia>> getPendingItems() {
        return pendingItems;
    }

    public void processPendingItems(List<PendingMedia> items, String username) {
        if (items == null || items.isEmpty()) {
            state.setValue(0);
        } else if (username == null || username.trim().isEmpty()) {
            state.setValue(1);
        } else {
            state.setValue(2);
            Random random = new Random();
            selectedMediaItem.setValue(items.get(random.nextInt(items.size())));
        }
    }

    public LiveData<Integer> getState() { return state; }
    public LiveData<PendingMedia> getSelectedMediaItem() { return selectedMediaItem; }
    public void setState(int value) { state.setValue(value); }

    @Override
    protected void onCleared() {
        super.onCleared();
        if (pendingListener != null) pendingListener.remove();
    }
}