package es.iesagora.cinexplora.controller.viewmodel;

import android.app.Application;
import android.net.Uri;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;

import java.io.File;
import java.io.IOException;

import es.iesagora.cinexplora.controller.repository.UserRepository;
import es.iesagora.cinexplora.model.states.Resource;
import es.iesagora.cinexplora.utils.ImageUtils;

public class UserViewmodel extends AndroidViewModel {

    private final UserRepository repository;
    private String id;
    private final MutableLiveData<String> photoUrl = new MutableLiveData<>();

    private final MutableLiveData<String> username = new MutableLiveData<>();

    public UserViewmodel(@NonNull Application application) {
        super(application);
        repository = new UserRepository();

        FirebaseUser user = FirebaseAuth.getInstance().getCurrentUser();
        if (user != null) id = user.getUid();
    }

    public MutableLiveData<String> getUsername() {
        return username;
    }

    public MutableLiveData<String> getPhotoUrl() {
        return photoUrl;
    }

    public void loadUsername() {
        if (id == null) return;
        repository.getName(id, name -> username.postValue(name));
    }

    public void usernameChanged(String newName) {
        if (id == null) return;
        username.setValue(newName);
        repository.updateName(id, newName, new UserRepository.UserCallback() {
            @Override public void onSuccess() { }
            @Override public void onError(String message) { }
        });
    }

    public void loadPhotoUrl() {
        if (id == null) return;
        String diceBearUrl = "https://api.dicebear.com/9.x/identicon/png?seed=" + id;
        photoUrl.postValue(diceBearUrl);
        repository.getPhotoUrl(id, url -> {
            if (url != null && !url.isEmpty()) {
                photoUrl.postValue(url);
            } else {
                repository.setDefaultPhotoUrl(id, diceBearUrl);
            }
        });
    }

    public LiveData<Resource<String>> uploadProfilePhoto(Uri imageUri) {
        try {
            File file = ImageUtils.getFileFromUri(getApplication(), imageUri);
            return repository.uploadProfilePhoto(file, id);
        } catch (IOException e) {
            MutableLiveData<Resource<String>> errorRes = new MutableLiveData<>();
            errorRes.setValue(Resource.error("Error al procesar el archivo"));
            return errorRes;
        }
    }

    public void refreshUserId() {
        FirebaseUser user = FirebaseAuth.getInstance().getCurrentUser();
        if (user != null) id = user.getUid();
    }
}
