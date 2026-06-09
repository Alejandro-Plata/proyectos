package es.iesagora.cinexplora.model.states;

public class Resource<T> {

    public enum Status { SUCCESS, ERROR, LOADING }

    public final T data;
    public final String message;
    public final Status status;

    // Constructor privado: solo se puede crear mediante los métodos estáticos
    private Resource(Status status, T data, String message) {
        this.status = status;
        this.data = data;
        this.message = message;
    }

    // Fábrica estática para estado de ÉXITO
    public static <T> Resource<T> success(T data) {
        return new Resource<>(Status.SUCCESS, data, null);
    }

    // Fábrica estática para ERROR, normalmente con un mensaje
    public static <T> Resource<T> error(String msg) {
        return new Resource<>(Status.ERROR, null, msg);
    }

    // Fábrica estática para el estado de CARGA
    public static <T> Resource<T> loading() {
        return new Resource<>(Status.LOADING, null, null);
    }
}
