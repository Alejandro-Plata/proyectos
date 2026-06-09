package es.iesagora.cinexplora.model.request;

import com.google.gson.annotations.SerializedName;

public class PersonDetail {

    private int id;
    private String name;
    private String biography;
    private String birthday;
    private String deathday;

    @SerializedName("place_of_birth")
    private String placeOfBirth;

    @SerializedName("profile_path")
    private String profilePath;

    @SerializedName("known_for_department")
    private String knownForDepartment;

    private double popularity;

    public PersonDetail() {}

    public int getId() { return id; }
    public String getName() { return name; }
    public String getBiography() { return biography; }
    public String getBirthday() { return birthday; }
    public String getDeathday() { return deathday; }
    public String getPlaceOfBirth() { return placeOfBirth; }
    public String getProfilePath() { return profilePath; }
    public String getKnownForDepartment() { return knownForDepartment; }
    public double getPopularity() { return popularity; }

    public void setId(int id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setBiography(String biography) { this.biography = biography; }
    public void setBirthday(String birthday) { this.birthday = birthday; }
    public void setDeathday(String deathday) { this.deathday = deathday; }
    public void setPlaceOfBirth(String placeOfBirth) { this.placeOfBirth = placeOfBirth; }
    public void setProfilePath(String profilePath) { this.profilePath = profilePath; }
    public void setKnownForDepartment(String knownForDepartment) { this.knownForDepartment = knownForDepartment; }
    public void setPopularity(double popularity) { this.popularity = popularity; }
}