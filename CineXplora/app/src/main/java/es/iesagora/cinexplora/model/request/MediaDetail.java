package es.iesagora.cinexplora.model.request;

import com.google.gson.annotations.SerializedName;

import java.util.List;

public class MediaDetail {

    private List<Genre> genres;
    private String overview;
    @SerializedName("vote_average")
    private double rating;
    @SerializedName("backdrop_path")
    private String imgPoster;

    public List<Genre> getGenres() {
        return genres;
    }

    public String getDescription() {
        return overview;
    }

    public double getRating() {
        return rating;
    }

    public String getImgPoster() {
        return imgPoster;
    }
}
