package es.iesagora.cinexplora.network;

import okhttp3.RequestBody;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.DELETE;
import retrofit2.http.POST;
import retrofit2.http.Path;

public interface SupabaseStorageApi {
    @POST("storage/v1/object/{bucket}/{fileName}")
    Call<Void> uploadImage(
            @Path("bucket") String bucket,
            @Path(value = "fileName", encoded = true) String fileName,
            @Body RequestBody file
    );

    @DELETE("storage/v1/object/{bucket}/{fileName}")
    Call<Void> deleteImage(
            @Path("bucket") String bucket,
            @Path(value = "fileName", encoded = true) String fileName
    );
}
