package es.iesagora.cinexplora.controller.repository;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.SetOptions;
import java.util.Collections;

import android.util.Log;
import java.io.File;
import java.io.IOException;

import es.iesagora.cinexplora.model.UserProfile;
import es.iesagora.cinexplora.model.states.Resource;
import es.iesagora.cinexplora.network.SupabaseClient;
import es.iesagora.cinexplora.network.SupabaseStorageApi;
import okhttp3.MediaType;
import okhttp3.RequestBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class UserRepository {

    private final FirebaseFirestore db;
    private final SupabaseStorageApi storageApi;
    private static final String BUCKET_NAME = "profile-photos";

    public interface UserCallback {
        void onSuccess();
        void onError(String message);
    }

    public interface GetUsernameCallback {
        void onResult(String username);
    }

    public UserRepository() {
        FirebaseAuth.getInstance();
        db = FirebaseFirestore.getInstance();
        storageApi = SupabaseClient.getClient().create(SupabaseStorageApi.class);
    }

    public void saveProfile(String id, UserProfile profile, UserCallback callback) {
        db.collection("users").document(id)
                .set(profile)
                .addOnSuccessListener(aVoid -> callback.onSuccess())
                .addOnFailureListener(e -> callback.onError(e.getMessage()));
    }

    public void updateName(String id, String newName, UserCallback callback) {
        db.collection("users").document(id)
                .update("name", newName)
                .addOnSuccessListener(aVoid -> callback.onSuccess())
                .addOnFailureListener(e -> callback.onError(e.getMessage()));
    }

    public void getName(String id, GetUsernameCallback callback) {
        db.collection("users").document(id)
                .get()
                .addOnSuccessListener(doc -> {
                    if (doc.exists()) {
                        String name = doc.getString("name");
                        callback.onResult(name != null ? name : "");
                    } else {
                        callback.onResult("");
                    }
                })
                .addOnFailureListener(e -> callback.onResult(""));
    }

    public void updatePhotoUrl(String id, String photoUrl, UserCallback callback) {
        db.collection("users").document(id)
                .update("photoUrl", photoUrl)
                .addOnSuccessListener(aVoid -> callback.onSuccess())
                .addOnFailureListener(e -> callback.onError(e.getMessage()));
    }

    public void setDefaultPhotoUrl(String id, String url) {
        db.collection("users").document(id)
                .set(Collections.singletonMap("photoUrl", url), SetOptions.merge());
    }

    public void getPhotoUrl(String id, GetUsernameCallback callback) {
        db.collection("users").document(id)
                .get()
                .addOnSuccessListener(doc -> {
                    if (doc.exists()) {
                        String url = doc.getString("photoUrl");
                        callback.onResult(url != null ? url : "");
                    } else {
                        callback.onResult("");
                    }
                })
                .addOnFailureListener(e -> callback.onResult(""));
    }

    public LiveData<Resource<String>> uploadProfilePhoto(File imageFile, String userId) {
        MutableLiveData<Resource<String>> result = new MutableLiveData<>();
        result.setValue(Resource.loading());

        String fileName = userId + "/" + imageFile.getName();

        RequestBody requestFile = RequestBody.create(MediaType.parse("image/jpeg"), imageFile);

        Call<Void> call = storageApi.uploadImage(BUCKET_NAME, fileName, requestFile);

        call.enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                if (response.isSuccessful()) {
                    String fileUrl = response.raw().request().url().toString();
                    db.collection("users").document(userId)
                            .update("photoUrl", fileUrl);
                    result.postValue(Resource.success(fileUrl));
                } else {
                    String errorBody = "";
                    try { if (response.errorBody() != null) errorBody = response.errorBody().string(); } catch (IOException ignored) {}
                    Log.e("SupabaseUpload", "HTTP " + response.code() + " | URL: " + response.raw().request().url() + " | Body: " + errorBody);
                    result.postValue(Resource.error("Error al subir foto: " + response.code()));
                }
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                result.postValue(Resource.error(t.getMessage()));
            }
        });

        return result;
    }
}
