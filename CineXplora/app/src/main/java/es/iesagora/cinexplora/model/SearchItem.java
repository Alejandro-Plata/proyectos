package es.iesagora.cinexplora.model;

import es.iesagora.cinexplora.model.request.Movie;
import es.iesagora.cinexplora.model.request.Serie;

public class SearchItem {
    private Movie movie;
    private Serie serie;
    private MediaType type;

    public SearchItem(Movie movie) {
        this.movie = movie;
        this.type = MediaType.MOVIE;
    }

    public SearchItem(Serie serie) {
        this.serie = serie;
        this.type = MediaType.SERIE;
    }

    public Movie getMovie() {
        return movie;
    }

    public Serie getSerie() {
        return serie;
    }

    public String getType() {
        return type.name().toLowerCase();
    }
}