package es.iesagora.cinexplora.view.tracking;

import static android.app.Activity.RESULT_OK;

import com.google.android.material.dialog.MaterialAlertDialogBuilder;
import android.app.DatePickerDialog;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.text.TextUtils;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;
import java.util.Calendar;

import es.iesagora.cinexplora.R;
import es.iesagora.cinexplora.databinding.FragmentAddTrackingBinding;
import es.iesagora.cinexplora.model.TrackingMedia;
import es.iesagora.cinexplora.model.request.Movie;
import es.iesagora.cinexplora.model.states.Resource;
import es.iesagora.cinexplora.model.request.Serie;
import es.iesagora.cinexplora.recyclerview.adapter.SearchAdapter;
import es.iesagora.cinexplora.controller.viewmodel.SearchViewmodel;
import es.iesagora.cinexplora.controller.viewmodel.TrackingViewmodel;

public class AddTrackingFragment extends Fragment {

    private FragmentAddTrackingBinding binding;
    private TrackingViewmodel trackingViewModel;
    private SearchViewmodel searchViewmodel;
    private SearchAdapter adapter;
    private String type = "movie";
    private int selectedTmdbId = 0;
    private String selectedPosterPath = null;
    private ActivityResultLauncher<Intent> imagePickerLauncher;
    private Uri selectedImageUri;

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        binding = FragmentAddTrackingBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        trackingViewModel = new ViewModelProvider(requireActivity()).get(TrackingViewmodel.class);
        searchViewmodel = new ViewModelProvider(requireActivity()).get(SearchViewmodel.class);

        setUpAdapter();

        trackingViewModel.isTracked.observe(getViewLifecycleOwner(), exists -> {
            if (exists != null) {
                if (exists) {
                    new MaterialAlertDialogBuilder(requireContext())
                            .setMessage(getString(R.string.msg_already_tracked))
                            .setPositiveButton(getString(R.string.dialog_accept), null)
                            .show();
                } else {
                    saveTracking();
                }
                trackingViewModel.isTracked.setValue(null);
            }
        });

        imagePickerLauncher = registerForActivityResult(
                new ActivityResultContracts.StartActivityForResult(),
                result -> {
                    if (result.getResultCode() == RESULT_OK  && result.getData() != null) {
                        selectedImageUri = result.getData().getData();
                        binding.imgMemory.setImageURI(selectedImageUri);
                        binding.layoutAddImagePlaceholder.setVisibility(View.GONE);
                    }
                }
        );

        // Listener para abrir la galería
        binding.cardImageContainer.setOnClickListener(v -> {
            Intent intent = new Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
            imagePickerLauncher.launch(intent);
        });

        binding.btnSaveTracking.setOnClickListener(v -> checkingAndSave());
        binding.btnSearchTitle.setOnClickListener(v -> searchMedia());
        binding.etDate.setOnClickListener(v -> showDatePicker());

        searchViewmodel.listaPeliculasBuscadas.observe(getViewLifecycleOwner(), resource -> {
            if (resource.status == Resource.Status.SUCCESS && resource.data != null) {
                adapter.setSearchList(resource.data);
                if (adapter.getItemCount() > 0) binding.rvSearchResults.setVisibility(View.VISIBLE);
            }
        });

        searchViewmodel.listaSeriesBuscadas.observe(getViewLifecycleOwner(), resource -> {
            if (resource.status == Resource.Status.SUCCESS && resource.data != null) {
                adapter.setSearchList(resource.data);
                if (adapter.getItemCount() > 0) binding.rvSearchResults.setVisibility(View.VISIBLE);
            }
        });

        chargeFromAlert();
    }
    private void searchMedia() {
        String type = binding.toggleGroupType.getCheckedButtonId() == R.id.btnTypeSeries ? "serie" : "movie";
        String query = binding.etTitle.getText().toString().trim();

        if (TextUtils.isEmpty(query)) {
            binding.tilTitle.setError(getString(R.string.error_write_title));
            return;
        }

        binding.tilTitle.setError(null);
        adapter.clear();
        searchViewmodel.search(type, query);
    }

    private void chargeFromAlert() {
        if (getArguments() != null) {
            String preTitle = getArguments().getString("arg_title");
            String preType = getArguments().getString("arg_type");
            int preId = getArguments().getInt("arg_tmdb_id");
            String prePoster = getArguments().getString("arg_poster_path");

            if (preTitle != null) {
                binding.etTitle.setText(preTitle);
                if ("serie".equals(preType)) {
                    binding.toggleGroupType.check(R.id.btnTypeSeries);
                } else {
                    binding.toggleGroupType.check(R.id.btnTypeMovie);
                }

                // 3. Guardar variables internas para el guardado posterior
                this.selectedTmdbId = preId;
                this.selectedPosterPath = prePoster;
                this.type = preType;

            }
        }
    }

    private void setUpAdapter() {
        adapter = new SearchAdapter(requireContext());

        adapter.setOnItemClickListener(item -> {
            if (item.getType().equalsIgnoreCase("serie")) {
                if (item.getSerie() != null) {
                    Serie serie = item.getSerie();
                    binding.etTitle.setText(serie.getNombre());
                    selectedPosterPath = serie.getImgPoster();
                    selectedTmdbId = serie.getId();
                    binding.toggleGroupType.check(R.id.btnTypeSeries);
                    type = "serie";
                }
            } else {
                if (item.getMovie() != null) {
                    Movie movie = item.getMovie();
                    binding.etTitle.setText(movie.getTitle());
                    selectedPosterPath = movie.getImgPoster();
                    selectedTmdbId = movie.getId();
                    binding.toggleGroupType.check(R.id.btnTypeMovie);
                    type = "movie";
                }
            }
            binding.rvSearchResults.setVisibility(View.GONE);
        });

        binding.rvSearchResults.setLayoutManager(new LinearLayoutManager(requireContext()));
        binding.rvSearchResults.setAdapter(adapter);
    }

    private void checkingAndSave() {
        String titulo = binding.etTitle.getText().toString().trim();
        String fecha = binding.etDate.getText().toString().trim();

        if (TextUtils.isEmpty(titulo)) {
            binding.tilTitle.setError(getString(R.string.error_title_required));
            return;
        }
        if (TextUtils.isEmpty(fecha)) {
            binding.tilDate.setError(getString(R.string.error_date_required));
            return;
        }

        String tipo = binding.toggleGroupType.getCheckedButtonId() == R.id.btnTypeSeries ? "serie" : "movie";
        trackingViewModel.checkIfExists(titulo, tipo);
    }

    private void saveTracking() {
        String titulo = binding.etTitle.getText().toString().trim();
        type = binding.toggleGroupType.getCheckedButtonId() == R.id.btnTypeSeries ? "serie" : "movie";
        String fecha = binding.etDate.getText().toString().trim();
        String comentario = binding.etComments.getText().toString().trim();
        float rating = binding.ratingBar.getRating();
        TrackingMedia nuevoSeguimiento = new TrackingMedia();
        nuevoSeguimiento.setTitle(titulo);
        nuevoSeguimiento.setType(type);
        nuevoSeguimiento.setTmdbId(selectedTmdbId);
        nuevoSeguimiento.setPosterPath(selectedPosterPath);
        nuevoSeguimiento.setDateWatched(fecha);
        nuevoSeguimiento.setRating(rating);
        nuevoSeguimiento.setUserComment(comentario);
        nuevoSeguimiento.setCreatedAt(System.currentTimeMillis());
        if (selectedImageUri != null) {
            trackingViewModel.uploadImage(selectedImageUri)
                    .observe(getViewLifecycleOwner(), uploadRes -> {
                        switch (uploadRes.status) {
                            case LOADING:
                                binding.btnSaveTracking.setEnabled(false);
                                break;
                            case SUCCESS:
                                nuevoSeguimiento.setPhotoUrl(uploadRes.data);
                                saveTrackingSupabase(nuevoSeguimiento);
                                break;
                            case ERROR:
                                binding.btnSaveTracking.setEnabled(true);
                                new MaterialAlertDialogBuilder(requireContext())
                                        .setMessage(getString(R.string.error_upload_image, uploadRes.message))
                                        .setPositiveButton(getString(R.string.dialog_accept), null)
                                        .show();
                                break;
                        }
                    });
        } else {
            saveTrackingSupabase(nuevoSeguimiento);
        }
    }

    private void saveTrackingSupabase(TrackingMedia media) {
        trackingViewModel.addTracking(media);
        new MaterialAlertDialogBuilder(requireContext())
                .setTitle(getString(R.string.dialog_tracking_saved_title))
                .setMessage(getString(R.string.dialog_tracking_saved_message))
                .setPositiveButton(getString(R.string.dialog_accept), null)
                .show();
        binding.etTitle.setText("");
        adapter.clear();
        getParentFragmentManager().popBackStack();
    }

    public void showDatePicker() {
        final Calendar c = Calendar.getInstance();
        int anio = c.get(Calendar.YEAR);
        int mes = c.get(Calendar.MONTH);
        int dia = c.get(Calendar.DAY_OF_MONTH);

        DatePickerDialog calendario = new DatePickerDialog(requireContext(),
                (view, year, monthOfYear, dayOfMonth) -> {
                    String selectedDate = dayOfMonth + "/" + (monthOfYear + 1) + "/" + year;
                    binding.etDate.setText(selectedDate);
                }, anio, mes, dia);

        calendario.getDatePicker().setMaxDate(System.currentTimeMillis()); // Evita poder elegir días posteriores a la fecha actual
        calendario.show();
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}