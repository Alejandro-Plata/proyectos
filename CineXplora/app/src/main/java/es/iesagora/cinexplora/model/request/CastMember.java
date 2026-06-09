package es.iesagora.cinexplora.model.request;

import com.google.gson.annotations.SerializedName;

public class CastMember {

    private int id;
    private String name;
    private String character;

    @SerializedName("profile_path")
    private String profilePath;

    @SerializedName("known_for_department")
    private String knownForDepartment;

    private int order;

    public CastMember() {}

    public int getId() { return id; }
    public String getName() { return name; }
    public String getCharacter() { return character; }
    public String getProfilePath() { return profilePath; }
    public String getKnownForDepartment() { return knownForDepartment; }
    public int getOrder() { return order; }

    public void setId(int id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setCharacter(String character) { this.character = character; }
    public void setProfilePath(String profilePath) { this.profilePath = profilePath; }
    public void setKnownForDepartment(String knownForDepartment) { this.knownForDepartment = knownForDepartment; }
    public void setOrder(int order) { this.order = order; }
}
