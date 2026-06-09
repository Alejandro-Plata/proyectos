package es.iesagora.cinexplora.model.request;

import com.google.gson.annotations.SerializedName;

public class Serie extends Media {

    private String name;
    @SerializedName("number_of_seasons")
    private Integer numeroTemporadas;

    public String getNombre() { return name; }
    public Integer getNumeroTemporadas() { return numeroTemporadas; }

}
