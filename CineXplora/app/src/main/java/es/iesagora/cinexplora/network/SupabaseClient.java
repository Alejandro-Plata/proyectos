package es.iesagora.cinexplora.network;

import okhttp3.OkHttpClient;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class SupabaseClient {
    private static Retrofit retrofit = null;

    private static final String BASE_URL = "https://gkhuzuslepzlrattheal.supabase.co/";
    private static final String API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdraHV6dXNsZXB6bHJhdHRoZWFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2ODcyMTIsImV4cCI6MjA5NjI2MzIxMn0.VY9Ej--RigecvrU4A2L4AzGD25Bvx4A3ifaczO6GcEc";
    public static Retrofit getClient() {
        if (retrofit == null) {
            OkHttpClient client = new OkHttpClient.Builder()
                    .addInterceptor(new SupabaseAuthInterceptor(API_KEY))
                    .build();
            retrofit = new Retrofit.Builder()
                    .baseUrl(BASE_URL)
                    .client(client)
                    .addConverterFactory(GsonConverterFactory.create())
                    .build();
        }
        return retrofit;
    }
}