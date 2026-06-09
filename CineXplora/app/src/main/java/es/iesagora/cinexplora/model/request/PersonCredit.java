package es.iesagora.cinexplora.model.request;

import com.google.gson.annotations.SerializedName;

public class PersonCredit {

    private int id;
    private String title;
    private String name;
    private String character;
    private String job;

    @SerializedName("media_type")
    private String mediaType;

    @SerializedName("poster_path")
    private String posterPath;

    @SerializedName("release_date")
    private String releaseDate;

    @SerializedName("first_air_date")
    private String firstAirDate;

    private double popularity;

    @SerializedName("vote_average")
    private double voteAverage;

    public PersonCredit() {}

    public int getId() { return id; }
    public String getTitle() { return title; }
    public String getName() { return name; }
    public String getCharacter() { return character; }
    public String getJob() { return job; }
    public String getMediaType() { return mediaType; }
    public String getPosterPath() { return posterPath; }
    public String getReleaseDate() { return releaseDate; }
    public String getFirstAirDate() { return firstAirDate; }
    public double getPopularity() { return popularity; }
    public double getVoteAverage() { return voteAverage; }

    public void setId(int id) { this.id = id; }
    public void setTitle(String title) { this.title = title; }
    public void setName(String name) { this.name = name; }
    public void setCharacter(String character) { this.character = character; }
    public void setJob(String job) { this.job = job; }
    public void setMediaType(String mediaType) { this.mediaType = mediaType; }
    public void setPosterPath(String posterPath) { this.posterPath = posterPath; }
    public void setReleaseDate(String releaseDate) { this.releaseDate = releaseDate; }
    public void setFirstAirDate(String firstAirDate) { this.firstAirDate = firstAirDate; }
    public void setPopularity(double popularity) { this.popularity = popularity; }
    public void setVoteAverage(double voteAverage) { this.voteAverage = voteAverage; }

    // Title para películas, name para series
    public String getDisplayTitle() {
        return title != null && !title.isEmpty() ? title : name;
    }

    // Año de estreno
    public String getYear() {
        String date = releaseDate != null && !releaseDate.isEmpty() ? releaseDate : firstAirDate;
        if (date != null && date.length() >= 4) {
            return date.substring(0, 4);
        }
        return "";
    }

    public String getDisplayRole() {

        if (character != null && !character.isEmpty()) {
            return character;
        }

        if (job != null && !job.isEmpty()) {
            return job;
        }
        return "";
    }
}