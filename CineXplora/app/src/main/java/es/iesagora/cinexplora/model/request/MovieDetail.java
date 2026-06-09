package es.iesagora.cinexplora.model.request;

import com.google.gson.annotations.SerializedName;

public class MovieDetail extends MediaDetail {

    private String title;
    @SerializedName("release_date")
    private String releaseDate;
    private double budget;
    private int runtime;

    public String getTitle() {
        return title;
    }

    public String getReleaseDate() {
        return releaseDate;
    }

    public double getBudget() {
        return budget;
    }

    public int getRuntime() {
        return runtime;
    }
}
