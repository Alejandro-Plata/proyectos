package es.iesagora.cinexplora.model.response;

import com.google.gson.annotations.SerializedName;
import java.util.List;

import es.iesagora.cinexplora.model.request.Serie;

public class SeriesResponse {

    private List<Serie> results;
    private int page;
    @SerializedName("total_pages")
    private int totalPages;

    public List<Serie> getResults() { return results; }

    public int getPage() { return page; }

    public int getTotalPages() {
        return totalPages;
    }
}
