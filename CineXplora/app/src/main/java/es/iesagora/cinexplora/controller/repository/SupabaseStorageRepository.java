package es.iesagora.cinexplora.controller.repository;

import java.io.IOException;
import java.util.UUID;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
public class SupabaseStorageRepository {
    private static final String SUPABASE_URL = "https: TU_PROYECTO.supabase.co";
    private static final String SUPABASE_API_KEY = "TU_ANON_KEY";
    private static final String BUCKET_NAME = "tracking-photos";
    private final OkHttpClient client;
    private final Executor executor;
    public interface UploadCallback {
        void onSuccess(String publicUrl);
        void onError(String message);
    }
    public SupabaseStorageRepository() {
        client = new OkHttpClient();
        executor = Executors.newSingleThreadExecutor();
    }
    public void uploadPhoto(byte[] imageBytes, String userId, UploadCallback callback) {
        executor.execute(() -> {
            String fileName = userId + "/" + UUID.randomUUID().toString() + ".jpg";
            RequestBody body = RequestBody.create(
                    imageBytes,
                    MediaType.parse("image/jpeg")
            );
            Request request = new Request.Builder()
                    .url(SUPABASE_URL + "/storage/v1/object/" + BUCKET_NAME + "/" + fileName)
                    .addHeader("Authorization", "Bearer " + SUPABASE_API_KEY)
                    .addHeader("apikey", SUPABASE_API_KEY)
                    .post(body)
                    .build();
            try (Response response = client.newCall(request).execute()) {
                if (response.isSuccessful()) {
                    String publicUrl = SUPABASE_URL + "/storage/v1/object/public/"
                            + BUCKET_NAME + "/" + fileName;
                    callback.onSuccess(publicUrl);
                } else {
                    callback.onError("Error al subir imagen: " + response.code());
                }
            } catch (IOException e) {
                callback.onError("Error de red al subir imagen: " + e.getMessage());
            }
        });
    }
}

