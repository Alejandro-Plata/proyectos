package es.iesagora.cinexplora.controller.repository;

import com.google.firebase.firestore.CollectionReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.ListenerRegistration;
import com.google.firebase.firestore.Query;

import java.util.ArrayList;
import java.util.List;

import es.iesagora.cinexplora.model.Comment;
import es.iesagora.cinexplora.model.states.Resource;

public class CommentsRepository {

    private final FirebaseFirestore db;

    public interface CommentsCallback {
        void onResult(Resource<List<Comment>> result);
    }

    public CommentsRepository() {
        db = FirebaseFirestore.getInstance();
    }

    public ListenerRegistration getComments(String tmdbId, CommentsCallback callback) {
        callback.onResult(Resource.loading());

        CollectionReference ref = db.collection("multimedia")
                .document(tmdbId)
                .collection("comments");

        return ref.orderBy("createdAt", Query.Direction.ASCENDING)
                .addSnapshotListener((snapshot, e) -> {
                    if (e != null) {
                        callback.onResult(Resource.error("Error al cargar comentarios"));
                        return;
                    }
                    if (snapshot != null) {
                        List<Comment> lista = new ArrayList<>();
                        for (DocumentSnapshot doc : snapshot) {
                            Comment comment = doc.toObject(Comment.class);
                            if (comment != null) lista.add(comment);
                        }
                        callback.onResult(Resource.success(lista));
                    }
                });
    }

    public void addComment(String tmdbId, Comment comment) {
        CollectionReference ref = db.collection("multimedia")
                .document(tmdbId)
                .collection("comments");

        String idGenerado = ref.document().getId();
        comment.setId(idGenerado);

        ref.document(idGenerado).set(comment);
    }
}