package es.iesagora.cinexplora.network;

import es.iesagora.cinexplora.model.SearchItem;
import es.iesagora.cinexplora.model.request.MovieDetail;
import es.iesagora.cinexplora.model.request.PersonDetail;
import es.iesagora.cinexplora.model.response.CombinedCreditsResponse;
import es.iesagora.cinexplora.model.response.CreditsResponse;
import es.iesagora.cinexplora.model.response.MoviesResponse;
import es.iesagora.cinexplora.model.request.SerieDetail;
import es.iesagora.cinexplora.model.response.SeriesResponse;
import es.iesagora.cinexplora.model.request.Video;
import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Path;
import retrofit2.http.Query;

public interface TMDBService {

    // Buscar peliculas populares
    @GET("movie/popular")
    Call<MoviesResponse> getPopularMovies(
            @Query("page") int page,
            @Query("language") String language
    );

    // Buscar series populares
    @GET("tv/popular")
    Call<SeriesResponse> getPopularSeries(
            @Query("page") int page,
            @Query("language") String language
    );

    // Buscar detalle pelicula
    @GET("movie/{movie_id}")
    Call<MovieDetail> getMoviesDetail(
            @Path("movie_id") int movieId,
            @Query("language") String language
    );

    // Buscar detalle serie
    @GET("tv/{series_id}")
    Call<SerieDetail> getSeriesDetail(
            @Path("series_id") int serieId,
            @Query("language") String language
    );

    // Buscar url video serie
    @GET("tv/{series_id}/videos")
    Call<Video> getSeriesTrailer (
            @Path("series_id") int serieId,
            @Query("language") String language
    );

    // Buscar url video pelicula
    @GET("movie/{movie_id}/videos")
    Call<Video> getMoviesTrailer (
            @Path("movie_id") int movieId,
            @Query("language") String language
    );

    // Buscar pelicula por nombre
    @GET("search/movie")
    Call<MoviesResponse> getMoviesBySearch(
            @Query("language") String language,
            @Query("query") String query
    );

    // Buscar serie por nombre
    @GET("search/tv")
    Call<SeriesResponse> getSeriesBySearch(
            @Query("language") String language,
            @Query("query") String query
    );

    // Obtener reparto y equipo tecnico de una pelicula
    @GET("movie/{movie_id}/credits")
    Call<CreditsResponse> getMovieCredits(
            @Path("movie_id") int movieId,
            @Query("language") String language
    );

    // Obtener reparto y equipo tecnico de una serie
    @GET("tv/{series_id}/credits")
    Call<CreditsResponse> getSeriesCredits(
            @Path("series_id") int serieId,
            @Query("language") String language
    );

    // Obtener detalles de una persona (director, actor, escritor)
    @GET("person/{person_id}")
    Call<PersonDetail> getPersonDetail(
            @Path("person_id") int personId,
            @Query("language") String language
    );

    // Obtener filmografia combinada de una persona
    @GET("person/{person_id}/combined_credits")
    Call<CombinedCreditsResponse> getPersonCombinedCredits(
            @Path("person_id") int personId,
            @Query("language") String language
    );
}
