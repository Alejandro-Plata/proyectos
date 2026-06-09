package es.iesagora.cinexplora.controller.repository;

import java.util.List;

import es.iesagora.cinexplora.model.Language;
import es.iesagora.cinexplora.model.request.Movie;
import es.iesagora.cinexplora.model.request.MovieDetail;
import es.iesagora.cinexplora.model.request.PersonDetail;
import es.iesagora.cinexplora.model.response.CombinedCreditsResponse;
import es.iesagora.cinexplora.model.response.CreditsResponse;
import es.iesagora.cinexplora.model.response.MoviesResponse;
import es.iesagora.cinexplora.model.states.Resource;
import es.iesagora.cinexplora.model.request.Serie;
import es.iesagora.cinexplora.model.request.SerieDetail;
import es.iesagora.cinexplora.model.response.SeriesResponse;
import es.iesagora.cinexplora.model.request.Video;
import es.iesagora.cinexplora.network.RetrofitClient;
import es.iesagora.cinexplora.network.TMDBService;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class MediaRepository {

    private final TMDBService api;
    private Language currentLanguage = Language.SPANISH;

    public MediaRepository() {
        api = RetrofitClient.getTMDBApi();
    }

    // Callbacks

    public interface SeriesCallback {
        void onResult(Resource<List<Serie>> result);
    }

    public interface MoviesCallback {
        void onResult(Resource<List<Movie>> result);
    }

    public interface VideosCallback {
        void onResult(Resource<Video> result);
    }

    public interface MovieDetailCallback {
        void onResult(Resource<MovieDetail> result);
    }

    public interface SerieDetailCallback {
        void onResult(Resource<SerieDetail> result);
    }

    public interface SearchMoviesCallback {
        void onResult(Resource<List<Movie>> result);
    }

    public interface SearchSeriesCallback {
        void onResult(Resource<List<Serie>> result);
    }

    public interface CreditsCallback {
        void onResult(Resource<CreditsResponse> result);
    }

    public interface PersonDetailCallback {
        void onResult(Resource<PersonDetail> result);
    }

    public interface CombinedCreditsCallback {
        void onResult(Resource<CombinedCreditsResponse> result);
    }

    public void setLanguage(Language language) {
        this.currentLanguage = language;
    }

    private String getLanguageCode() {
        return currentLanguage == Language.ENGLISH ? "en" : "es";
    }


    public void getSeries(int page, SeriesCallback callback) {

        callback.onResult(Resource.loading());

        api.getPopularSeries(page, getLanguageCode()).enqueue(new Callback<SeriesResponse>() {
            @Override
            public void onResponse(Call<SeriesResponse> call, Response<SeriesResponse> response) {
                if (response.isSuccessful() && response.body() != null) {

                    List<Serie> listaSeries = response.body().getResults();
                    callback.onResult(Resource.success(listaSeries));

                } else {
                    callback.onResult(Resource.error("No se pudo cargar la lista de series"));
                }

            }

            @Override
            public void onFailure(Call<SeriesResponse> call, Throwable t) {
                callback.onResult(Resource.error("Error de red: " + t.getMessage()));
            }
        });

    }

    public void getMovies(int page, MoviesCallback callback) {

        callback.onResult(Resource.loading());

        api.getPopularMovies(page, getLanguageCode()).enqueue(new Callback<MoviesResponse>() {
            @Override
            public void onResponse(Call<MoviesResponse> call, Response<MoviesResponse> response) {
                if (response.isSuccessful() && response.body() != null) {

                    List<Movie> listaPeliculas = response.body().getResults();
                    callback.onResult(Resource.success(listaPeliculas));

                } else {
                    callback.onResult(Resource.error("No se pudo cargar la lista de series"));
                }

            }

            @Override
            public void onFailure(Call<MoviesResponse> call, Throwable t) {
                callback.onResult(Resource.error("Error de red: " + t.getMessage()));
            }
        });

    }

    public void getMoviesBySearch(String query, SearchMoviesCallback callback) {
        callback.onResult(Resource.loading());
        api.getMoviesBySearch(getLanguageCode(), query).enqueue(new Callback<MoviesResponse>() {
            @Override
            public void onResponse(Call<MoviesResponse> call, Response<MoviesResponse> response) {
                if (response.isSuccessful() && response.body() != null) {
                    callback.onResult(Resource.success(response.body().getResults()));
                } else {
                    callback.onResult(Resource.error("No se pudo cargar la lista"));
                }
            }
            @Override
            public void onFailure(Call<MoviesResponse> call, Throwable t) {
                callback.onResult(Resource.error("Error de red: " + t.getMessage()));
            }
        });
    }

    public void getSeriesBySearch(String query, SearchSeriesCallback callback) {
        callback.onResult(Resource.loading());
        api.getSeriesBySearch(getLanguageCode(), query).enqueue(new Callback<SeriesResponse>() {
            @Override
            public void onResponse(Call<SeriesResponse> call, Response<SeriesResponse> response) {
                if (response.isSuccessful() && response.body() != null) {
                    callback.onResult(Resource.success(response.body().getResults()));
                } else {
                    callback.onResult(Resource.error("No se pudo cargar la lista"));
                }
            }
            @Override
            public void onFailure(Call<SeriesResponse> call, Throwable t) {
                callback.onResult(Resource.error("Error de red: " + t.getMessage()));
            }
        });
    }

    public void getSerieDetail(int idSerie, SerieDetailCallback callback) {

        callback.onResult(Resource.loading());

        api.getSeriesDetail(idSerie, getLanguageCode()).enqueue(new Callback<SerieDetail>() {
            @Override
            public void onResponse(Call<SerieDetail> call, Response<SerieDetail> response) {
                if (response.isSuccessful() && response.body() != null) {
                    SerieDetail body = response.body();

                    callback.onResult(Resource.success(body));
                } else {
                    callback.onResult(Resource.error("No se pudo cargar la lista de series"));
                }

            }

            @Override
            public void onFailure(Call<SerieDetail> call, Throwable t) {
                callback.onResult(Resource.error("Error de red: " + t.getMessage()));
            }
        });
    }

    public void getMovieDetail(int idMovie, MovieDetailCallback callback) {

        callback.onResult(Resource.loading());

        api.getMoviesDetail(idMovie, getLanguageCode()).enqueue(new Callback<MovieDetail>() {
            @Override
            public void onResponse(Call<MovieDetail> call, Response<MovieDetail> response) {
                if (response.isSuccessful() && response.body() != null) {
                    MovieDetail body = response.body();

                    callback.onResult(Resource.success(body));
                } else {
                    callback.onResult(Resource.error("No se pudo cargar la lista de series"));
                }

            }

            @Override
            public void onFailure(Call<MovieDetail> call, Throwable t) {
                callback.onResult(Resource.error("Error de red: " + t.getMessage()));
            }
        });
    }

    public void getVideoMovie(int idMovie, VideosCallback callback) {

        callback.onResult(Resource.loading());

        api.getMoviesTrailer(idMovie, getLanguageCode()).enqueue(new Callback<Video>() {
            @Override
            public void onResponse(Call<Video> call, Response<Video> response) {
                if (response.isSuccessful() && response.body() != null) {
                    Video body = response.body();

                    callback.onResult(Resource.success(body));
                } else {
                    callback.onResult(Resource.error("No se pudo cargar la lista de series"));
                }

            }

            @Override
            public void onFailure(Call<Video> call, Throwable t) {
                callback.onResult(Resource.error("Error de red: " + t.getMessage()));
            }
        });
    }

    public void getVideoSerie(int idSerie, VideosCallback callback) {

        callback.onResult(Resource.loading());

        api.getSeriesTrailer(idSerie, getLanguageCode()).enqueue(new Callback<Video>() {
            @Override
            public void onResponse(Call<Video> call, Response<Video> response) {
                if (response.isSuccessful() && response.body() != null) {
                    Video body = response.body();

                    callback.onResult(Resource.success(body));
                } else {
                    callback.onResult(Resource.error("No se pudo cargar la lista de series"));
                }

            }

            @Override
            public void onFailure(Call<Video> call, Throwable t) {
                callback.onResult(Resource.error("Error de red: " + t.getMessage()));
            }
        });
    }

    public void getMovieCredits(int idMovie, CreditsCallback callback) {
        callback.onResult(Resource.loading());

        api.getMovieCredits(idMovie, getLanguageCode()).enqueue(new Callback<CreditsResponse>() {
            @Override
            public void onResponse(Call<CreditsResponse> call, Response<CreditsResponse> response) {
                if (response.isSuccessful() && response.body() != null) {
                    callback.onResult(Resource.success(response.body()));
                } else {
                    callback.onResult(Resource.error("No se pudo cargar el reparto"));
                }
            }

            @Override
            public void onFailure(Call<CreditsResponse> call, Throwable t) {
                callback.onResult(Resource.error("Error de red: " + t.getMessage()));
            }
        });
    }

    public void getSeriesCredits(int idSerie, CreditsCallback callback) {
        callback.onResult(Resource.loading());

        api.getSeriesCredits(idSerie, getLanguageCode()).enqueue(new Callback<CreditsResponse>() {
            @Override
            public void onResponse(Call<CreditsResponse> call, Response<CreditsResponse> response) {
                if (response.isSuccessful() && response.body() != null) {
                    callback.onResult(Resource.success(response.body()));
                } else {
                    callback.onResult(Resource.error("No se pudo cargar el reparto"));
                }
            }

            @Override
            public void onFailure(Call<CreditsResponse> call, Throwable t) {
                callback.onResult(Resource.error("Error de red: " + t.getMessage()));
            }
        });
    }

    public void getPersonDetail(int personId, PersonDetailCallback callback) {
        callback.onResult(Resource.loading());

        api.getPersonDetail(personId, getLanguageCode()).enqueue(new Callback<PersonDetail>() {
            @Override
            public void onResponse(Call<PersonDetail> call, Response<PersonDetail> response) {
                if (response.isSuccessful() && response.body() != null) {
                    callback.onResult(Resource.success(response.body()));
                } else {
                    callback.onResult(Resource.error("No se pudo cargar los datos de la persona"));
                }
            }

            @Override
            public void onFailure(Call<PersonDetail> call, Throwable t) {
                callback.onResult(Resource.error("Error de red: " + t.getMessage()));
            }
        });
    }

    public void getPersonCombinedCredits(int personId, CombinedCreditsCallback callback) {
        callback.onResult(Resource.loading());

        api.getPersonCombinedCredits(personId, getLanguageCode())
                .enqueue(new Callback<CombinedCreditsResponse>() {
                    @Override
                    public void onResponse(Call<CombinedCreditsResponse> call,
                                           Response<CombinedCreditsResponse> response) {
                        if (response.isSuccessful() && response.body() != null) {
                            callback.onResult(Resource.success(response.body()));
                        } else {
                            callback.onResult(Resource.error(
                                    "No se pudo cargar la filmografia"));
                        }
                    }

                    @Override
                    public void onFailure(Call<CombinedCreditsResponse> call, Throwable t) {
                        callback.onResult(Resource.error("Error de red: " + t.getMessage()));
                    }
                });
    }

    // Si la biografia no está disponible en el idioma seleccionado, se muestra en inglés
    public void getPersonDetailWithFallback(int personId, PersonDetailCallback callback) {
        callback.onResult(Resource.loading());

        api.getPersonDetail(personId, getLanguageCode()).enqueue(new Callback<PersonDetail>() {
            @Override
            public void onResponse(Call<PersonDetail> call, Response<PersonDetail> response) {
                if (response.isSuccessful() && response.body() != null) {
                    PersonDetail person = response.body();

                    if (person.getBiography() == null || person.getBiography().isEmpty()) {
                        if (!"en".equals(getLanguageCode())) {
                            api.getPersonDetail(personId, "en").enqueue(new Callback<PersonDetail>() {
                                @Override
                                public void onResponse(Call<PersonDetail> call2, Response<PersonDetail> resp2) {
                                    if (resp2.isSuccessful() && resp2.body() != null) {
                                        callback.onResult(Resource.success(resp2.body()));
                                    } else {
                                        callback.onResult(Resource.success(person));
                                    }
                                }

                                @Override
                                public void onFailure(Call<PersonDetail> call2, Throwable t2) {
                                    callback.onResult(Resource.success(person));
                                }
                            });
                            return;
                        }
                    }

                    callback.onResult(Resource.success(person));
                } else {
                    callback.onResult(Resource.error("No se pudo cargar los datos de la persona"));
                }
            }

            @Override
            public void onFailure(Call<PersonDetail> call, Throwable t) {
                callback.onResult(Resource.error("Error de red: " + t.getMessage()));
            }
        });
    }

}
