package es.iesagora.cinexplora.controller.viewmodel;

import android.app.Application;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.MutableLiveData;

import java.util.List;

import es.iesagora.cinexplora.controller.repository.MediaRepository;
import es.iesagora.cinexplora.controller.repository.SharedPreferencesRepository;
import es.iesagora.cinexplora.model.request.Genre;
import es.iesagora.cinexplora.model.request.Serie;
import es.iesagora.cinexplora.model.request.SerieDetail;
import es.iesagora.cinexplora.model.request.Video;
import es.iesagora.cinexplora.model.response.CreditsResponse;
import es.iesagora.cinexplora.model.states.Resource;

public class SeriesViewmodel extends AndroidViewModel {

    private final MediaRepository repository;
    private final SharedPreferencesRepository sharedPreferences;
    private int paginaActual = 1;
    private Integer currentGenreId = null;
    private String currentSortBy = "popularity.desc";

    public MutableLiveData<Resource<List<Serie>>> listaSeries = new MutableLiveData<>();
    public MutableLiveData<Resource<SerieDetail>> serieDetalle = new MutableLiveData<>();
    public MutableLiveData<Resource<Video>> urlTrailer = new MutableLiveData<>();
    public MutableLiveData<Resource<CreditsResponse>> seriesCredits = new MutableLiveData<>();
    public MutableLiveData<Resource<List<Genre>>> listaGeneros = new MutableLiveData<>();

    public SeriesViewmodel(@NonNull Application application) {
        super(application);
        repository = new MediaRepository();
        sharedPreferences = new SharedPreferencesRepository(application);
    }

    public void loadSeries() {
        paginaActual = 1;
        currentGenreId = null;
        currentSortBy = "popularity.desc";
        repository.setLanguage(sharedPreferences.getLanguage());
        repository.getSeries(paginaActual, result -> listaSeries.postValue(result));
    }

    public void loadMoreSeries() {
        paginaActual++;
        repository.setLanguage(sharedPreferences.getLanguage());
        if (currentGenreId != null || !"popularity.desc".equals(currentSortBy)) {
            String genreParam = currentGenreId != null ? String.valueOf(currentGenreId) : null;
            repository.discoverSeries(paginaActual, genreParam, currentSortBy,
                    result -> listaSeries.postValue(result));
        } else {
            repository.getSeries(paginaActual, result -> listaSeries.postValue(result));
        }
    }

    public void loadSeriesWithFilter(Integer genreId, String sortBy) {
        paginaActual = 1;
        currentGenreId = genreId;
        currentSortBy = sortBy != null ? sortBy : "popularity.desc";
        repository.setLanguage(sharedPreferences.getLanguage());

        if (currentGenreId == null && "popularity.desc".equals(currentSortBy)) {
            repository.getSeries(paginaActual, result -> listaSeries.postValue(result));
        } else {
            String genreParam = currentGenreId != null ? String.valueOf(currentGenreId) : null;
            repository.discoverSeries(paginaActual, genreParam, currentSortBy,
                    result -> listaSeries.postValue(result));
        }
    }

    public void loadTvGenres() {
        repository.setLanguage(sharedPreferences.getLanguage());
        repository.getTvGenres(result -> listaGeneros.postValue(result));
    }

    public void loadSerieDetail(int idSerie) {
        repository.setLanguage(sharedPreferences.getLanguage());
        repository.getSerieDetail(idSerie, result -> serieDetalle.postValue(result));
        repository.getVideoSerie(idSerie, result -> urlTrailer.postValue(result));
        repository.getSeriesCredits(idSerie, result -> seriesCredits.postValue(result));
    }

    public Integer getCurrentGenreId() { return currentGenreId; }
    public String getCurrentSortBy() { return currentSortBy; }
}
