package es.iesagora.cinexplora.network;

import java.io.IOException;

import okhttp3.Interceptor;
import okhttp3.Request;
import okhttp3.Response;

public class TokenInterceptor implements Interceptor {

    final String token = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZDQ0OTExMjZhN2E2ZDg3NjdkOTljNWU2NjhhMTU2OSIsIm5iZiI6MTc2ODA0NTU4MC4wNTYsInN1YiI6IjY5NjIzYzBjZWNmNTYwY2U0MTFkODdiNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.GVws9w45ewuXY73QcRFuCItDsrfEvtD7cnEtJlpfB2k";

    @Override
    public Response intercept(Chain chain) throws IOException {

        Request newRequest = chain.request().newBuilder()
                .header("Authorization","Bearer "+ token)
                .build();

        return chain.proceed(newRequest);
    }
}