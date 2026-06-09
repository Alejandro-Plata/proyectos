package es.iesagora.cinexplora.model.request;

import com.google.gson.annotations.SerializedName;

public class CrewMember {

    private int id;
    private String name;
    private String job;
    private String department;

    @SerializedName("profile_path")
    private String profilePath;

    @SerializedName("known_for_department")
    private String knownForDepartment;

    public CrewMember() {}

    public int getId() { return id; }
    public String getName() { return name; }
    public String getJob() { return job; }
    public String getDepartment() { return department; }
    public String getProfilePath() { return profilePath; }
    public String getKnownForDepartment() { return knownForDepartment; }

    public void setId(int id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setJob(String job) { this.job = job; }
    public void setDepartment(String department) { this.department = department; }
    public void setProfilePath(String profilePath) { this.profilePath = profilePath; }
    public void setKnownForDepartment(String knownForDepartment) { this.knownForDepartment = knownForDepartment; }
}
