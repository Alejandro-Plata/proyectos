package es.iesagora.cinexplora.model.response;

import com.google.gson.annotations.SerializedName;

import java.util.List;

import es.iesagora.cinexplora.model.request.Movie;

public class MoviesResponse {
    private List<Movie> results;
    @SerializedName("total_pages")
    private int totalPages;

    public List<Movie> getResults() {
        return results;
    }

    public int getTotalPages() { return totalPages; }
}
