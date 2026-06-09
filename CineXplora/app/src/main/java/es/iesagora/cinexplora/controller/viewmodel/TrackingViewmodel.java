package es.iesagora.cinexplora.controller.viewmodel;

import android.app.Application;
import android.net.Uri;
import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.ListenerRegistration;
import java.io.File;
import java.io.IOException;
import java.util.List;
import es.iesagora.cinexplora.model.TrackingMedia;
import es.iesagora.cinexplora.model.states.Resource;
import es.iesagora.cinexplora.utils.ImageUtils;
import es.iesagora.cinexplora.controller.repository.TrackingRepository;
import es.iesagora.cinexplora.utils.TrackingFilter;

public class TrackingViewmodel extends AndroidViewModel {
    private final TrackingRepository repository;
    private String userId;
    private ListenerRegistration trackingListener;
    private ListenerRegistration filteredListener;
    public MutableLiveData<Resource<List<TrackingMedia>>> watchedList = new MutableLiveData<>();
    public MutableLiveData<Boolean> isTracked = new MutableLiveData<> ();
    public MutableLiveData<Resource<TrackingMedia>> trackingItem = new MutableLiveData<>();
    public TrackingViewmodel(@NonNull Application application) {
        super(application);
        repository = new TrackingRepository();
        FirebaseUser user = FirebaseAuth.getInstance().getCurrentUser();
        if (user != null) {
            userId = user.getUid();
            trackingListener = repository.getTracking(userId, result -> watchedList.postValue(result));
        }
    }
    public MutableLiveData<Resource<List<TrackingMedia>>> getWatchedList() {
        return watchedList;
    }
    public void loadTrackingItem(String title, String type) {
        if (userId != null) {
            repository.getTrackingItem(userId, title, type,
                    result -> trackingItem.postValue(result));
        }
    }
    public void addTracking(TrackingMedia media) {
        if (userId != null) {
            repository.addTracking(userId, media);
        }
    }
    public LiveData<Resource<String>> uploadImage(Uri imageUri) {
        try {
            File file = ImageUtils.getFileFromUri(getApplication(), imageUri);
            return repository.uploadImage(file, userId);
        } catch (IOException e) {
            MutableLiveData<Resource<String>> errorRes = new MutableLiveData<>();
            errorRes.setValue(Resource.error("Error al procesar el archivo"));
            return errorRes;
        }
    }


    public void applyFilter(TrackingFilter filter) {
        if (userId == null) return;

        if (filteredListener != null) {
            filteredListener.remove();
            filteredListener = null;
        }

        if (!filter.hasActiveFilters() && "createdAt".equals(filter.getSortField()) && !filter.isSortAscending()) {
            if (trackingListener == null) {
                trackingListener = repository.getTracking(userId, result -> watchedList.postValue(result));
            }
        } else {
            if (trackingListener != null) {
                trackingListener.remove();
                trackingListener = null;
            }
            filteredListener = repository.getFilteredTracking(userId, filter, result -> watchedList.postValue(result));
        }
    }
    public void deleteTracking(TrackingMedia media) {
        if (userId != null & media.getId() != null) {
            repository.deleteTracking(userId, media.getId());
        }
    }
    public void checkIfExists(String title, String type) {
        if (userId != null) {
            repository.checkIfExists(userId, title, type, result -> {
                isTracked.postValue(result);
            });
        }
    }
    @Override
    protected void onCleared() {
        super.onCleared();
        if (trackingListener != null) trackingListener.remove();
        if (filteredListener != null) filteredListener.remove();

    }
}


