package es.iesagora.cinexplora.utils;

public class TrackingFilter {
    private String searchQuery;
    private String sortField;
    private boolean sortAscending;
    private String dateFrom;
    private String dateTo;
    private Float ratingMin;
    private Float ratingMax;
    public TrackingFilter() {
        this.sortField = "createdAt";
        this.sortAscending = false;
    }
    public String getSearchQuery() {
        return searchQuery;
    }
    public String getSortField() {
        return sortField;
    }
    public boolean isSortAscending() {
        return sortAscending;
    }
    public String getDateFrom() {
        return dateFrom;
    }
    public String getDateTo() {
        return dateTo;
    }
    public Float getRatingMin() {
        return ratingMin;
    }
    public Float getRatingMax() {
        return ratingMax;
    }
    public void setSearchQuery(String searchQuery) {
        this.searchQuery = searchQuery;
    }
    public void setSortField(String sortField) {
        this.sortField = sortField;
    }
    public void setSortAscending(boolean sortAscending) {
        this.sortAscending = sortAscending;
    }
    public void setDateFrom(String dateFrom) {
        this.dateFrom = dateFrom;
    }
    public void setDateTo(String dateTo) {
        this.dateTo = dateTo;
    }
    public void setRatingMin(Float ratingMin) {
        this.ratingMin = ratingMin;
    }
    public void setRatingMax(Float ratingMax) {
        this.ratingMax = ratingMax;
    }
    // Tendrá los filtros activos si algunos de los filtros (como mínimo) es no nulo
    public boolean hasActiveFilters() {
        return (searchQuery != null && !searchQuery.isEmpty()) || dateFrom != null || dateTo != null || ratingMin != null || ratingMax != null;
    }
}

