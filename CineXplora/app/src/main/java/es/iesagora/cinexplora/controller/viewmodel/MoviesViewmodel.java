package es.iesagora.cinexplora.controller.viewmodel;

import android.app.Application;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.MutableLiveData;

import java.util.List;

import es.iesagora.cinexplora.controller.repository.SharedPreferencesRepository;
import es.iesagora.cinexplora.model.request.Movie;
import es.iesagora.cinexplora.model.request.MovieDetail;
import es.iesagora.cinexplora.model.response.CreditsResponse;
import es.iesagora.cinexplora.model.states.Resource;
import es.iesagora.cinexplora.model.request.Video;
import es.iesagora.cinexplora.controller.repository.MediaRepository;

public class MoviesViewmodel extends AndroidViewModel {

    private final MediaRepository repository;
    private final SharedPreferencesRepository sharedPreferences;
    private int paginaActual = 1;
    public MutableLiveData<Resource<List<Movie>>> listaPeliculas = new MutableLiveData<>();
    public MutableLiveData<Resource<MovieDetail>> peliculaDetalle = new MutableLiveData<>();
    public MutableLiveData<Resource<Video>> urlTrailer = new MutableLiveData<>();
    public MutableLiveData<Resource<CreditsResponse>> movieCredits = new MutableLiveData<>();
    public MoviesViewmodel(@NonNull Application application) {
        super(application);
        repository = new MediaRepository();
        sharedPreferences = new SharedPreferencesRepository(application);
    }

    public void loadMovies() {
        paginaActual = 1; // Reset

        repository.setLanguage(sharedPreferences.getLanguage());

        repository.getMovies(paginaActual, result -> {
            listaPeliculas.postValue(result);
        });
    }

    public void loadMoreMovies() {

        paginaActual++;

        repository.setLanguage(sharedPreferences.getLanguage());

        repository.getMovies(paginaActual, result -> {
            listaPeliculas.postValue(result);
        });
    }

    public void loadMovieDetail(int idMovie) {

        repository.setLanguage(sharedPreferences.getLanguage());

        repository.getMovieDetail(idMovie, result -> {
            peliculaDetalle.postValue(result);
        });

        // Llamamos también al endpoint del vídeo para obtener la url
        repository.getVideoMovie(idMovie, result -> {
            urlTrailer.postValue(result);
        });

        repository.getMovieCredits(idMovie, result -> {
            movieCredits.postValue(result);
        });
    }

}
