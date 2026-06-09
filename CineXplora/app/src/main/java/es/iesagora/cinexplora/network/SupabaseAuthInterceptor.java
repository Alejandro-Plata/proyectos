package es.iesagora.cinexplora.network;

import java.io.IOException;
import okhttp3.Interceptor;
import okhttp3.Request;
import okhttp3.Response;

public class SupabaseAuthInterceptor implements Interceptor {
    private final String apiKey;
    public SupabaseAuthInterceptor(String apiKey) {
        this.apiKey = apiKey;
    }
    @Override
    public Response intercept(Chain chain) throws IOException {
        Request original = chain.request();
        Request request = original.newBuilder()
                .header("Authorization", "Bearer " + apiKey)
                .header("apikey", apiKey)
                .method(original.method(), original.body())
                .build();
        return chain.proceed(request);
    }
}

