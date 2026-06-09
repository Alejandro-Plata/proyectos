package es.iesagora.cinexplora.model;

public class FavoriteActor {

    private int personId;
    private String name;
    private String profilePath;
    private String knownForDepartment;
    private long addedAt;

    public FavoriteActor() {}

    public FavoriteActor(int personId, String name, String profilePath,
                         String knownForDepartment, long addedAt) {
        this.personId = personId;
        this.name = name;
        this.profilePath = profilePath;
        this.knownForDepartment = knownForDepartment;
        this.addedAt = addedAt;
    }

    public int getPersonId() { return personId; }
    public String getName() { return name; }
    public String getProfilePath() { return profilePath; }
    public String getKnownForDepartment() { return knownForDepartment; }
    public long getAddedAt() { return addedAt; }

    public void setPersonId(int personId) { this.personId = personId; }
    public void setName(String name) { this.name = name; }
    public void setProfilePath(String profilePath) { this.profilePath = profilePath; }
    public void setKnownForDepartment(String knownForDepartment) { this.knownForDepartment = knownForDepartment; }
    public void setAddedAt(long addedAt) { this.addedAt = addedAt; }
}
