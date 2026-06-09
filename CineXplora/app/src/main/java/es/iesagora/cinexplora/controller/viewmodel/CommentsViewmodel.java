package es.iesagora.cinexplora.controller.viewmodel;

import android.app.Application;
import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.MutableLiveData;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.ListenerRegistration;

import java.util.List;

import es.iesagora.cinexplora.controller.repository.CommentsRepository;
import es.iesagora.cinexplora.model.Comment;
import es.iesagora.cinexplora.model.states.Resource;

public class CommentsViewmodel extends AndroidViewModel {

    private final CommentsRepository repository;
    private String uid;
    private ListenerRegistration commentsListener;

    // El ViewModel es dueño del MutableLiveData — patrón MoviesViewmodel
    public MutableLiveData<Resource<List<Comment>>> comments = new MutableLiveData<>();

    public CommentsViewmodel(@NonNull Application application) {
        super(application);
        repository = new CommentsRepository();

        FirebaseUser user = FirebaseAuth.getInstance().getCurrentUser();
        if (user != null) uid = user.getUid();
    }

    // Llamado desde el Fragment en onViewCreated, igual que loadMovieDetail(movieId)
    // Repositorio recibe callback; ViewModel llama postValue — patrón MoviesViewmodel
    public void loadComments(String tmdbId) {
        if (commentsListener != null) return; // evita suscripciones duplicadas
        commentsListener = repository.getComments(tmdbId,
                result -> comments.postValue(result));
    }

    // authorName proporcionado por el Fragment desde UserViewmodel
    public void addComment(String tmdbId, String text, String authorName) {
        if (uid == null || text.isEmpty()) return;

        Comment comment = new Comment(
                null,
                uid,
                (authorName != null && !authorName.isEmpty()) ? authorName : "Usuario",
                text,
                System.currentTimeMillis()
        );

        repository.addComment(tmdbId, comment);
    }

    @Override
    protected void onCleared() {
        super.onCleared();
        if (commentsListener != null) {
            commentsListener.remove();
        }
    }
}