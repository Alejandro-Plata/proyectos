package es.iesagora.cinexplora.controller.viewmodel;

import android.app.Application;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.MutableLiveData;

import java.util.List;

import es.iesagora.cinexplora.controller.repository.MediaRepository;
import es.iesagora.cinexplora.controller.repository.SharedPreferencesRepository;
import es.iesagora.cinexplora.model.request.Genre;
import es.iesagora.cinexplora.model.request.Movie;
import es.iesagora.cinexplora.model.request.MovieDetail;
import es.iesagora.cinexplora.model.response.CreditsResponse;
import es.iesagora.cinexplora.model.states.Resource;
import es.iesagora.cinexplora.model.request.Video;

public class MoviesViewmodel extends AndroidViewModel {

    private final MediaRepository repository;
    private final SharedPreferencesRepository sharedPreferences;
    private int paginaActual = 1;
    private Integer currentGenreId = null;
    private String currentSortBy = "popularity.desc";

    public MutableLiveData<Resource<List<Movie>>> listaPeliculas = new MutableLiveData<>();
    public MutableLiveData<Resource<MovieDetail>> peliculaDetalle = new MutableLiveData<>();
    public MutableLiveData<Resource<Video>> urlTrailer = new MutableLiveData<>();
    public MutableLiveData<Resource<CreditsResponse>> movieCredits = new MutableLiveData<>();
    public MutableLiveData<Resource<List<Genre>>> listaGeneros = new MutableLiveData<>();

    public MoviesViewmodel(@NonNull Application application) {
        super(application);
        repository = new MediaRepository();
        sharedPreferences = new SharedPreferencesRepository(application);
    }

    public void loadMovies() {
        paginaActual = 1;
        currentGenreId = null;
        currentSortBy = "popularity.desc";
        repository.setLanguage(sharedPreferences.getLanguage());
        repository.getMovies(paginaActual, result -> listaPeliculas.postValue(result));
    }

    public void loadMoreMovies() {
        paginaActual++;
        repository.setLanguage(sharedPreferences.getLanguage());
        if (currentGenreId != null || !"popularity.desc".equals(currentSortBy)) {
            String genreParam = currentGenreId != null ? String.valueOf(currentGenreId) : null;
            repository.discoverMovies(paginaActual, genreParam, currentSortBy,
                    result -> listaPeliculas.postValue(result));
        } else {
            repository.getMovies(paginaActual, result -> listaPeliculas.postValue(result));
        }
    }

    public void loadMoviesWithFilter(Integer genreId, String sortBy) {
        paginaActual = 1;
        currentGenreId = genreId;
        currentSortBy = sortBy != null ? sortBy : "popularity.desc";
        repository.setLanguage(sharedPreferences.getLanguage());

        if (currentGenreId == null && "popularity.desc".equals(currentSortBy)) {
            repository.getMovies(paginaActual, result -> listaPeliculas.postValue(result));
        } else {
            String genreParam = currentGenreId != null ? String.valueOf(currentGenreId) : null;
            repository.discoverMovies(paginaActual, genreParam, currentSortBy,
                    result -> listaPeliculas.postValue(result));
        }
    }

    public void loadMovieGenres() {
        repository.setLanguage(sharedPreferences.getLanguage());
        repository.getMovieGenres(result -> listaGeneros.postValue(result));
    }

    public void loadMovieDetail(int idMovie) {
        repository.setLanguage(sharedPreferences.getLanguage());
        repository.getMovieDetail(idMovie, result -> peliculaDetalle.postValue(result));
        repository.getVideoMovie(idMovie, result -> urlTrailer.postValue(result));
        repository.getMovieCredits(idMovie, result -> movieCredits.postValue(result));
    }

    public Integer getCurrentGenreId() { return currentGenreId; }
    public String getCurrentSortBy() { return currentSortBy; }
}
