package es.iesagora.cinexplora.controller.repository;

import com.google.firebase.firestore.CollectionReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.ListenerRegistration;
import com.google.firebase.firestore.Query;

import java.util.ArrayList;
import java.util.List;

import es.iesagora.cinexplora.model.FavoriteActor;
import es.iesagora.cinexplora.model.states.Resource;

public class FavoriteActorsRepository {

    private final FirebaseFirestore db;

    public interface FavoriteActorsCallback {
        void onResult(Resource<List<FavoriteActor>> result);
    }

    public interface CheckFavoriteCallback {
        void onResult(boolean isFavorite);
    }

    public FavoriteActorsRepository() {
        db = FirebaseFirestore.getInstance();
    }

    private CollectionReference getFavoritesRef(String userId) {
        return db.collection("users")
                .document(userId)
                .collection("favoriteActors");
    }

    public ListenerRegistration getFavoriteActors(String userId,
                                                   FavoriteActorsCallback callback) {
        callback.onResult(Resource.loading());

        return getFavoritesRef(userId)
                .orderBy("addedAt", Query.Direction.DESCENDING)
                .addSnapshotListener((snapshot, e) -> {
                    if (e != null) {
                        callback.onResult(Resource.error(
                                "Error al cargar actores favoritos"));
                        return;
                    }
                    if (snapshot != null) {
                        List<FavoriteActor> lista = new ArrayList<>();
                        for (DocumentSnapshot doc : snapshot) {
                            FavoriteActor actor = doc.toObject(FavoriteActor.class);
                            if (actor != null) lista.add(actor);
                        }
                        callback.onResult(Resource.success(lista));
                    }
                });
    }

    public void addFavorite(String userId, FavoriteActor actor) {
        String docId = String.valueOf(actor.getPersonId());
        getFavoritesRef(userId).document(docId).set(actor);
    }

    public void removeFavorite(String userId, int personId) {
        getFavoritesRef(userId).document(String.valueOf(personId)).delete();
    }

    public void checkIfFavorite(String userId, int personId,
                                 CheckFavoriteCallback callback) {
        getFavoritesRef(userId).document(String.valueOf(personId))
                .get()
                .addOnSuccessListener(doc -> callback.onResult(doc.exists()))
                .addOnFailureListener(e -> callback.onResult(false));
    }
}
