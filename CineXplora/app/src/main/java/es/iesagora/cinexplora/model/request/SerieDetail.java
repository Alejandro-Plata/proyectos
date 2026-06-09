package es.iesagora.cinexplora.model.request;

import com.google.gson.annotations.SerializedName;

public class SerieDetail extends MediaDetail {
    @SerializedName("number_of_episodes")
    private int numberOfEpisodes;
    @SerializedName("number_of_seasons")
    private int numberOfSeasons;
    private String name;
    private String status;

    public int getNumberOfEpisodes() {
        return numberOfEpisodes;
    }

    public int getNumberOfSeasons() {
        return numberOfSeasons;
    }

    public String getName() {
        return name;
    }

    public String getStatus() {
        return status;
    }
}
