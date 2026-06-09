package es.iesagora.cinexplora.model;

public class UserProfile {

    private String name;
    private String email;
    private String photoUrl;
    private long createdAt;

    public UserProfile() {}

    public UserProfile(String name, String email, String photoUrl, long createdAt) {
        this.name = name;
        this.email = email;
        this.photoUrl = photoUrl;
        this.createdAt = createdAt;
    }

    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getPhotoUrl() { return photoUrl; }
    public long getCreatedAt() { return createdAt; }

    public void setName(String name) { this.name = name; }
    public void setEmail(String email) { this.email = email; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }
    public void setCreatedAt(long createdAt) { this.createdAt = createdAt; }
}