package es.iesagora.cinexplora.controller.repository;

import com.google.firebase.firestore.CollectionReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.ListenerRegistration;
import com.google.firebase.firestore.Query;

import java.util.ArrayList;
import java.util.List;

import es.iesagora.cinexplora.model.PendingMedia;
import es.iesagora.cinexplora.model.states.Resource;

public class PendingRepository {

    private final FirebaseFirestore db;

    public interface PendingCallback {
        void onResult(Resource<List<PendingMedia>> result);
    }

    public PendingRepository() {
        db = FirebaseFirestore.getInstance();
    }

    public ListenerRegistration getPending(String id, PendingCallback callback) {
        callback.onResult(Resource.loading());

        CollectionReference ref = db.collection("users")
                .document(id)
                .collection("pendientes");

        return ref.orderBy("createdAt", Query.Direction.DESCENDING)
                .addSnapshotListener((snapshot, e) -> {
                    if (e != null) {
                        callback.onResult(Resource.error("Error al cargar multimedia pendiente"));
                        return;
                    }
                    if (snapshot != null) {
                        List<PendingMedia> lista = new ArrayList<>();
                        for (DocumentSnapshot doc : snapshot) {
                            PendingMedia item = doc.toObject(PendingMedia.class);
                            if (item != null) lista.add(item);
                        }
                        callback.onResult(Resource.success(lista));
                    }
                });
    }

    public void addPending(String id, PendingMedia item) {
        String docId = String.valueOf(item.getTmdbId());
        db.collection("users").document(id)
                .collection("pendientes").document(docId)
                .set(item);
    }

    public void deletePending(String id, int tmdbId) {
        db.collection("users").document(id)
                .collection("pendientes").document(String.valueOf(tmdbId))
                .delete();
    }

}