package es.iesagora.cinexplora.model;

public class TrackingMedia {
    private String id;
    private int tmdbId;
    private String title;
    private String type;
    private String posterPath;
    private float rating;
    private String dateWatched;
    private String userComment;
    private String photoUrl;
    private long createdAt;
    public TrackingMedia() {}
    public TrackingMedia(int tmdbId, String title, String type, String posterPath,
                         float rating, String dateWatched, String userComment,
                         String photoUrl, long createdAt) {
        this.tmdbId = tmdbId;
        this.title = title;
        this.type = type;
        this.posterPath = posterPath;
        this.rating = rating;
        this.dateWatched = dateWatched;
        this.userComment = userComment;
        this.photoUrl = photoUrl;
        this.createdAt = createdAt;
    }
    public String getId() { return id; }
    public int getTmdbId() { return tmdbId; }
    public String getTitle() { return title; }
    public String getType() { return type; }
    public String getPosterPath() { return posterPath; }
    public float getRating() { return rating; }
    public String getDateWatched() { return dateWatched; }
    public String getUserComment() { return userComment; }
    public String getPhotoUrl() { return photoUrl; }
    public long getCreatedAt() { return createdAt; }
    public void setId(String id) { this.id = id; }
    public void setTmdbId(int tmdbId) { this.tmdbId = tmdbId; }
    public void setTitle(String title) { this.title = title; }
    public void setType(String type) { this.type = type; }
    public void setPosterPath(String posterPath) { this.posterPath = posterPath; }
    public void setRating(float rating) { this.rating = rating; }
    public void setDateWatched(String dateWatched) { this.dateWatched = dateWatched; }
    public void setUserComment(String userComment) { this.userComment = userComment; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }
    public void setCreatedAt(long createdAt) { this.createdAt = createdAt; }
}

