package es.iesagora.cinexplora.model.response;

import java.util.List;

import es.iesagora.cinexplora.model.request.PersonCredit;

public class CombinedCreditsResponse {

    private int id;
    private List<PersonCredit> cast;
    private List<PersonCredit> crew;

    public int getId() { return id; }
    public List<PersonCredit> getCast() { return cast; }
    public List<PersonCredit> getCrew() { return crew; }

    public void setId(int id) { this.id = id; }
    public void setCast(List<PersonCredit> cast) { this.cast = cast; }
    public void setCrew(List<PersonCredit> crew) { this.crew = crew; }
}