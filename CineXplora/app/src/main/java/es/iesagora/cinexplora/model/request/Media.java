package es.iesagora.cinexplora.model.request;

import com.google.gson.annotations.SerializedName;

public class Media {

    private int id;


    private String overview;
    @SerializedName("vote_average")
    private double rating;
    @SerializedName("backdrop_path")
    private String imgPoster;

    public int getId() { return id; }
    public String getDescripcion() { return overview; }
    public double getRating() { return rating; }
    public String getImgPoster() { return imgPoster; }
}
