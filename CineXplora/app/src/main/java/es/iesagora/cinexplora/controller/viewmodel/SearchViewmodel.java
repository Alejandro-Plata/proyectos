package es.iesagora.cinexplora.controller.viewmodel;

import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import java.util.ArrayList;
import java.util.List;

import es.iesagora.cinexplora.model.SearchItem;
import es.iesagora.cinexplora.model.request.Movie;
import es.iesagora.cinexplora.model.states.Resource;
import es.iesagora.cinexplora.model.request.Serie;
import es.iesagora.cinexplora.controller.repository.MediaRepository;

public class SearchViewmodel extends ViewModel {

    private final MediaRepository repository;

    public MutableLiveData<Resource<List<SearchItem>>> listaPeliculasBuscadas = new MutableLiveData<>();
    public MutableLiveData<Resource<List<SearchItem>>> listaSeriesBuscadas = new MutableLiveData<>();

    public SearchViewmodel() {
        repository = new MediaRepository();
    }

    public void search(String type, String query) {

        // Todo esto es para unificar ambos, ya que por ejemplo la API devuelve title en el caso de movies y name en el caso de series
        if(type.equalsIgnoreCase("serie")) {
            repository.getSeriesBySearch(query, result -> {
                if (result.status == Resource.Status.SUCCESS && result.data != null) {
                    // Las convertimos en un item de búsqueda
                    List<SearchItem> items = new ArrayList<>();
                    for (Serie s : result.data) {
                        items.add(new SearchItem(s));
                    }
                    listaSeriesBuscadas.postValue(Resource.success(items));
                }
            });
        } else {

            repository.getMoviesBySearch(query, result -> {
                if (result.status == Resource.Status.SUCCESS && result.data != null) {
                    // Las convertimos en un item de búsqueda
                    List<SearchItem> items = new ArrayList<>();
                    for (Movie m : result.data) {
                        items.add(new SearchItem(m));
                    }
                    listaPeliculasBuscadas.postValue(Resource.success(items));
                }
            });

        }

    }


}