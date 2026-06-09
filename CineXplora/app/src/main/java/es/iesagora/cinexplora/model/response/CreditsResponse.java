package es.iesagora.cinexplora.model.response;

import java.util.List;

import es.iesagora.cinexplora.model.request.CastMember;
import es.iesagora.cinexplora.model.request.CrewMember;

public class CreditsResponse {

    private int id;
    private List<CastMember> cast;
    private List<CrewMember> crew;

    public int getId() { return id; }
    public List<CastMember> getCast() { return cast; }
    public List<CrewMember> getCrew() { return crew; }

    public void setId(int id) { this.id = id; }
    public void setCast(List<CastMember> cast) { this.cast = cast; }
    public void setCrew(List<CrewMember> crew) { this.crew = crew; }
}
