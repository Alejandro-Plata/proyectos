package es.iesagora.cinexplora.controller.repository;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import com.google.firebase.firestore.CollectionReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.ListenerRegistration;
import com.google.firebase.firestore.Query;
import android.util.Log;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import es.iesagora.cinexplora.model.TrackingMedia;
import es.iesagora.cinexplora.model.states.Resource;
import es.iesagora.cinexplora.network.SupabaseClient;
import es.iesagora.cinexplora.network.SupabaseStorageApi;
import es.iesagora.cinexplora.utils.TrackingFilter;
import okhttp3.MediaType;
import okhttp3.RequestBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
public class TrackingRepository {
    private final FirebaseFirestore db;
    private final SupabaseStorageApi storageApi;
    private static final String BUCKET_NAME = "tracking-photos";
    public interface TrackingCallback {
        void onResult(Resource<List<TrackingMedia>> result);
    }
    public interface TrackingItemCallback {
        void onResult(Resource<TrackingMedia> result);
    }
    public interface CheckExistsCallback {
        void onResult(boolean exists);
    }

    public TrackingRepository() {
        db = FirebaseFirestore.getInstance();
        storageApi = SupabaseClient.getClient().create(SupabaseStorageApi.class);
    }
    private CollectionReference getTrackingRef(String userId) {
        return db.collection("users")
                .document(userId)
                .collection("tracking");
    }
    public LiveData<Resource<String>> uploadImage(File imageFile, String userId) {
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
                    result.postValue(Resource.success(fileUrl));
                } else {
                    String errorBody = "";
                    try { if (response.errorBody() != null) errorBody = response.errorBody().string(); } catch (IOException ignored) {}
                    Log.e("SupabaseUpload", "HTTP " + response.code() + " | URL: " + response.raw().request().url() + " | Body: " + errorBody);
                    result.postValue(Resource.error("Error al subir a Supabase: " + response.code()));
                }
            }
            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                result.postValue(Resource.error(t.getMessage()));
            }
        });
        return result;
    }
    public ListenerRegistration getTracking(String userId, TrackingCallback callback) {
        callback.onResult(Resource.loading());
        return getTrackingRef(userId)
                .orderBy("createdAt", Query.Direction.DESCENDING)
                .addSnapshotListener((snapshot, e) -> {
                    if (e != null) {
                        callback.onResult(Resource.error("Error al cargar seguimientos"));
                        return;
                    }
                    if (snapshot != null) {
                        List<TrackingMedia> lista = new ArrayList<>();
                        for (DocumentSnapshot doc : snapshot) {
                            TrackingMedia item = doc.toObject(TrackingMedia.class);
                            if (item != null) {
                                item.setId(doc.getId());
                                lista.add(item);
                            }
                        }
                        callback.onResult(Resource.success(lista));
                    }
                });
    }
    public void getTrackingItem(String userId, String title, String type,
                                TrackingItemCallback callback) {
        getTrackingRef(userId)
                .whereEqualTo("title", title)
                .whereEqualTo("type", type)
                .limit(1)
                .get()
                .addOnSuccessListener(snapshot -> {
                    if (!snapshot.isEmpty()) {
                        DocumentSnapshot doc = snapshot.getDocuments().get(0);
                        TrackingMedia item = doc.toObject(TrackingMedia.class);
                        if (item != null) {
                            item.setId(doc.getId());
                            callback.onResult(Resource.success(item));
                        } else {
                            callback.onResult(Resource.error("Error al leer el seguimiento"));
                        }
                    } else {
                        callback.onResult(Resource.error("Seguimiento no encontrado"));
                    }
                })
                .addOnFailureListener(e ->
                        callback.onResult(Resource.error("Error: " + e.getMessage())));
    }
    public void addTracking(String userId, TrackingMedia item) {
        String docId = getTrackingRef(userId).document().getId();
        item.setId(docId);
        getTrackingRef(userId).document(docId).set(item);
    }
    public void deleteTracking(String userId, String documentId) {
        getTrackingRef(userId).document(documentId).delete();
    }
    public void checkIfExists(String userId, String title, String type,
                              CheckExistsCallback callback) {
        getTrackingRef(userId)
                .whereEqualTo("title", title)
                .whereEqualTo("type", type)
                .limit(1)
                .get()
                .addOnSuccessListener(snapshot -> callback.onResult(!snapshot.isEmpty()))
                .addOnFailureListener(e -> callback.onResult(false));
    }

    public ListenerRegistration getFilteredTracking(String userId, TrackingFilter filter,
                                                    TrackingCallback callback) {
        callback.onResult(Resource.loading());
        Query query = getTrackingRef(userId);

        if (filter.getRatingMin() != null) {
            query = query.whereGreaterThanOrEqualTo("rating", filter.getRatingMin());
        }
        if (filter.getRatingMax() != null) {
            query = query.whereLessThanOrEqualTo("rating", filter.getRatingMax());
        }

        String sortField = filter.getSortField() != null ? filter.getSortField() : "createdAt";
        Query.Direction direction = filter.isSortAscending() ? Query.Direction.ASCENDING : Query.Direction.DESCENDING;
        query = query.orderBy(sortField, direction);
        return query.addSnapshotListener((snapshot, e) -> {

            if (e != null) {
                Log.e("TrackingRepo", "Firestore error", e);
                callback.onResult(Resource.error("Error al cargar seguimientos"));
                return;
            }

            if (snapshot != null) {
                List<TrackingMedia> lista = new ArrayList<>();
                for (DocumentSnapshot doc : snapshot) {
                    TrackingMedia item = doc.toObject(TrackingMedia.class);
                    if (item != null) {
                        item.setId(doc.getId());

                        if (filter.getSearchQuery() != null && !filter.getSearchQuery().isEmpty()) {
                            String searchLower = filter.getSearchQuery().toLowerCase();
                            if (!item.getTitle().toLowerCase().contains(searchLower)) {
                                continue;
                            }
                        }

                        if (filter.getDateFrom() != null && !filter.getDateFrom().isEmpty()) {
                            // Comprobamos que la fecha inicial sea menor que la final
                            if (compareDates(item.getDateWatched(), filter.getDateFrom()) < 0) {
                                continue;
                            }
                        }
                        if (filter.getDateTo() != null && !filter.getDateTo().isEmpty()) {
                            // Comprobamos que la fecha final sea mayor que la inicial
                            if (compareDates(item.getDateWatched(), filter.getDateTo()) > 0) {
                                continue;
                            }
                        }
                        lista.add(item);
                    }
                }
                callback.onResult(Resource.success(lista));
            }
        });
    }
    private int compareDates(String date1, String date2) {
        try {
            java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("d/M/yyyy");
            java.util.Date d1 = sdf.parse(date1);
            java.util.Date d2 = sdf.parse(date2);
            return d1.compareTo(d2);
        } catch (Exception e) {
            return 0;
        }
    }

}
