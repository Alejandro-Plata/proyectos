package es.iesagora.cinexplora.view.details;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;
import androidx.navigation.Navigation;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.bumptech.glide.Glide;
import com.bumptech.glide.load.resource.bitmap.CircleCrop;
import com.bumptech.glide.request.RequestOptions;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import es.iesagora.cinexplora.R;
import es.iesagora.cinexplora.controller.viewmodel.FavoriteActorsViewmodel;
import es.iesagora.cinexplora.controller.viewmodel.PersonViewmodel;
import es.iesagora.cinexplora.databinding.FragmentPersonDetailBinding;
import es.iesagora.cinexplora.model.FavoriteActor;
import es.iesagora.cinexplora.model.request.PersonCredit;
import es.iesagora.cinexplora.model.request.PersonDetail;
import es.iesagora.cinexplora.recyclerview.adapter.FilmographyAdapter;

public class PersonDetailFragment extends Fragment {

    private FragmentPersonDetailBinding binding;
    private PersonViewmodel personViewmodel;
    private FavoriteActorsViewmodel favoritesViewmodel;
    private FilmographyAdapter filmographyAdapter;
    private int personId;
    private PersonDetail currentPerson;
    private boolean isFavorite = false;

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        binding = FragmentPersonDetailBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        if (getArguments() != null) {
            personId = getArguments().getInt("PERSON_ID");
        } else {
            Navigation.findNavController(view).popBackStack();
            return;
        }

        personViewmodel = new ViewModelProvider(this).get(PersonViewmodel.class);
        favoritesViewmodel = new ViewModelProvider(requireActivity()).get(FavoriteActorsViewmodel.class);

        filmographyAdapter = new FilmographyAdapter(requireContext());
        binding.recyclerFilmography.setAdapter(filmographyAdapter);
        binding.recyclerFilmography.setLayoutManager(new LinearLayoutManager(getContext()));

        filmographyAdapter.setOnItemClickListener(credit -> {
            Bundle bundle = new Bundle();
            if ("movie".equals(credit.getMediaType())) {
                bundle.putInt("MOVIE_ID", credit.getId());
                Navigation.findNavController(requireView())
                        .navigate(R.id.moviesDetailFragment, bundle);
            } else {
                bundle.putInt("SERIE_ID", credit.getId());
                Navigation.findNavController(requireView())
                        .navigate(R.id.seriesDetailFragment, bundle);
            }
        });

        observarPersonDetail();
        observarCombinedCredits();
        observarFavorito();

        personViewmodel.loadPersonDetail(personId);
        personViewmodel.loadCombinedCredits(personId);
        favoritesViewmodel.checkIfFavorite(personId);
    }

    private void observarPersonDetail() {
        personViewmodel.personDetail.observe(getViewLifecycleOwner(), resource -> {
            if (resource == null) return;

            switch (resource.status) {
                case LOADING:
                    binding.progressBar.setVisibility(View.VISIBLE);
                    break;
                case SUCCESS:
                    binding.progressBar.setVisibility(View.GONE);
                    if (resource.data != null) {
                        currentPerson = resource.data;
                        rellenarUI(resource.data);
                    }
                    break;
                case ERROR:
                    binding.progressBar.setVisibility(View.GONE);
                    new AlertDialog.Builder(requireContext())
                            .setMessage(resource.message)
                            .setPositiveButton(getString(R.string.dialog_accept), null)
                            .show();
                    break;
            }
        });
    }

    private void rellenarUI(PersonDetail person) {

        if (person.getProfilePath() != null && !person.getProfilePath().isEmpty()) {
            String imgUrl = "https://image.tmdb.org/t/p/w500" + person.getProfilePath();
            Glide.with(this)
                    .load(imgUrl)
                    .apply(new RequestOptions().transform(new CircleCrop()))
                    .placeholder(R.drawable.ic_default_avatar)
                    .into(binding.imgPersonPhoto);
        }

        binding.txtPersonName.setText(person.getName());

        if (person.getKnownForDepartment() != null) {
            binding.txtPersonDepartment.setText(person.getKnownForDepartment());
        }

        // Boton de fav solo visible para actores
        if ("Acting".equalsIgnoreCase(person.getKnownForDepartment())) {
            binding.btnFavoriteActor.setVisibility(View.VISIBLE);
            configurarBotonFavorito();
        } else {
            binding.btnFavoriteActor.setVisibility(View.GONE);
        }

        if (person.getBirthday() != null && !person.getBirthday().isEmpty()) {
            binding.layoutBirthday.setVisibility(View.VISIBLE);
            binding.txtBirthday.setText(person.getBirthday());
        }

        if (person.getPlaceOfBirth() != null && !person.getPlaceOfBirth().isEmpty()) {
            binding.layoutBirthPlace.setVisibility(View.VISIBLE);
            binding.txtBirthPlace.setText(person.getPlaceOfBirth());
        }

        if (person.getDeathday() != null && !person.getDeathday().isEmpty()) {
            binding.layoutDeathday.setVisibility(View.VISIBLE);
            binding.txtDeathday.setText(person.getDeathday());
        }

        if (person.getBiography() != null && !person.getBiography().isEmpty()) {
            binding.txtBiographyLabel.setVisibility(View.VISIBLE);
            binding.txtBiography.setVisibility(View.VISIBLE);
            binding.txtBiography.setText(person.getBiography());
        }
    }

    private void configurarBotonFavorito() {
        binding.btnFavoriteActor.setOnClickListener(v -> {
            if (isFavorite) {
                new AlertDialog.Builder(requireContext())
                        .setTitle(getString(R.string.dialog_remove_favorite_title))
                        .setMessage(getString(R.string.dialog_remove_favorite_message,
                                currentPerson.getName()))
                        .setPositiveButton(getString(R.string.dialog_delete_confirm),
                                (dialog, which) -> {
                                    favoritesViewmodel.removeFavorite(personId);
                                })
                        .setNegativeButton(getString(R.string.dialog_cancel), null)
                        .show();
            } else {
                FavoriteActor actor = new FavoriteActor(
                        currentPerson.getId(),
                        currentPerson.getName(),
                        currentPerson.getProfilePath(),
                        currentPerson.getKnownForDepartment(),
                        System.currentTimeMillis()
                );
                favoritesViewmodel.addFavorite(actor);
            }
        });
    }

    private void observarFavorito() {
        favoritesViewmodel.isFavorite.observe(getViewLifecycleOwner(), fav -> {
            isFavorite = fav;
            actualizarEstadoBotonFavorito();
        });
    }

    private void actualizarEstadoBotonFavorito() {
        if (isFavorite) {
            binding.btnFavoriteActor.setText(getString(R.string.btn_remove_favorite_actor));
            binding.btnFavoriteActor.setIconResource(R.drawable.ic_favorite);
        } else {
            binding.btnFavoriteActor.setText(getString(R.string.btn_add_favorite_actor));
            binding.btnFavoriteActor.setIconResource(R.drawable.ic_favorite_border);
        }
    }

    private void observarCombinedCredits() {
        personViewmodel.combinedCredits.observe(getViewLifecycleOwner(), resource -> {
            if (resource == null) return;

            switch (resource.status) {
                case SUCCESS:
                    if (resource.data != null) {
                        List<PersonCredit> allCredits = new ArrayList<>();

                        if (resource.data.getCast() != null) {
                            allCredits.addAll(resource.data.getCast());
                        }
                        if (resource.data.getCrew() != null) {
                            allCredits.addAll(resource.data.getCrew());
                        }

                        // Ordenar por popularidad descendente
                        Collections.sort(allCredits,
                                (a, b) -> Double.compare(b.getPopularity(), a.getPopularity()));

                        if (!allCredits.isEmpty()) {
                            binding.dividerFilmography.setVisibility(View.VISIBLE);
                            binding.txtFilmographyLabel.setVisibility(View.VISIBLE);
                            binding.recyclerFilmography.setVisibility(View.VISIBLE);
                            filmographyAdapter.setFilmographyList(allCredits);
                        }
                    }
                    break;
                case ERROR:
                    binding.recyclerFilmography.setVisibility(View.GONE);
                    break;
            }
        });
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}