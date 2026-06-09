package es.iesagora.cinexplora.model;

public class PendingMedia {

    private int tmdbId;
    private String type;
    private String title;
    private String posterPath;
    private long createdAt;

    public PendingMedia() {}

    public PendingMedia(int tmdbId, String type, String title, String posterPath, long createdAt) {
        this.tmdbId = tmdbId;
        this.type = type;
        this.title = title;
        this.posterPath = posterPath;
        this.createdAt = createdAt;
    }

    public int getTmdbId()       { return tmdbId; }
    public String getType()      { return type; }
    public String getTitle()     { return title; }
    public String getPosterPath(){ return posterPath; }
    public long getCreatedAt()   { return createdAt; }

    public void setTmdbId(int tmdbId)           { this.tmdbId = tmdbId; }
    public void setType(String type)            { this.type = type; }
    public void setTitle(String title)          { this.title = title; }
    public void setPosterPath(String posterPath){ this.posterPath = posterPath; }
    public void setCreatedAt(long createdAt)    { this.createdAt = createdAt; }
}