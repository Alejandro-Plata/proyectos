package es.iesagora.cinexplora.controller.viewmodel;

import android.app.Application;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.MutableLiveData;

import java.util.List;

import es.iesagora.cinexplora.controller.repository.SharedPreferencesRepository;
import es.iesagora.cinexplora.model.response.CreditsResponse;
import es.iesagora.cinexplora.model.states.Resource;
import es.iesagora.cinexplora.model.request.Serie;
import es.iesagora.cinexplora.model.request.SerieDetail;
import es.iesagora.cinexplora.model.request.Video;
import es.iesagora.cinexplora.controller.repository.MediaRepository;

public class SeriesViewmodel extends AndroidViewModel {

    private final MediaRepository repository;
    private final SharedPreferencesRepository sharedPreferences;
    int paginaActual = 1;
    public MutableLiveData<Resource<List<Serie>>> listaSeries = new MutableLiveData<>();
    public MutableLiveData<Resource<SerieDetail>> serieDetalle = new MutableLiveData<>();
    public MutableLiveData<Resource<Video>> urlTrailer = new MutableLiveData<>();
    public MutableLiveData<Resource<CreditsResponse>> seriesCredits = new MutableLiveData<>();

    public SeriesViewmodel(@NonNull Application application) {
        super(application);
        repository = new MediaRepository();
        sharedPreferences = new SharedPreferencesRepository(application);
    }

    public void loadSeries() {
        paginaActual = 1;

        repository.setLanguage(sharedPreferences.getLanguage());

        repository.getSeries(paginaActual, result -> {
            listaSeries.postValue(result);
        });
    }

    public void loadMoreSeries() {
        paginaActual++;

        repository.setLanguage(sharedPreferences.getLanguage());

        repository.getSeries(paginaActual, result -> {
            listaSeries.postValue(result);
        });
    }

    public void loadSerieDetail(int idSerie) {

        repository.setLanguage(sharedPreferences.getLanguage());

        repository.getSerieDetail(idSerie, result -> {
            serieDetalle.postValue(result);
        });

        // Llamamos también al endpoint del vídeo para obtener la url
        repository.getVideoSerie(idSerie, result -> {
            urlTrailer.postValue(result);
        });

        repository.getSeriesCredits(idSerie, result -> {
            seriesCredits.postValue(result);
        });

    }

}
