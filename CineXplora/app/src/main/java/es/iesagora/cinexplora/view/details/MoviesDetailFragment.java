package es.iesagora.cinexplora.view.details;

import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;
import androidx.navigation.Navigation;
import androidx.recyclerview.widget.LinearLayoutManager;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.google.android.material.dialog.MaterialAlertDialogBuilder;

import com.bumptech.glide.Glide;
import com.google.android.material.chip.Chip;

import java.text.NumberFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import es.iesagora.cinexplora.R;
import es.iesagora.cinexplora.controller.viewmodel.CommentsViewmodel;
import es.iesagora.cinexplora.controller.viewmodel.UserViewmodel;
import es.iesagora.cinexplora.databinding.FragmentMoviesDetailBinding;
import es.iesagora.cinexplora.model.request.CastMember;
import es.iesagora.cinexplora.model.request.CrewMember;
import es.iesagora.cinexplora.model.request.Genre;
import es.iesagora.cinexplora.model.request.MovieDetail;
import es.iesagora.cinexplora.model.request.Trailer;
import es.iesagora.cinexplora.controller.viewmodel.MoviesViewmodel;
import es.iesagora.cinexplora.recyclerview.adapter.CastAdapter;
import es.iesagora.cinexplora.recyclerview.adapter.CommentsAdapter;

public class MoviesDetailFragment extends Fragment {

    FragmentMoviesDetailBinding binding;
    private int movieId;
    private MoviesViewmodel viewModel;
    private final String APP_URL_BASE = "vnd.youtube:";
    private final String WEB_URL_BASE = "https://www.youtube.com/watch?v=";
    private String key;
    private String duracion;
    private double budgetEuros;
    private String releaseDateFormatted;
    private CommentsViewmodel commentsViewmodel;
    private CommentsAdapter commentsAdapter;
    private UserViewmodel userViewmodel;
    private String currentUsername = "Usuario";
    private CastAdapter castAdapter;
    private List<CrewMember> crewList;

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        binding = FragmentMoviesDetailBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        if (getArguments() != null) {
            movieId = getArguments().getInt("MOVIE_ID");
        } else {
            Navigation.findNavController(view).popBackStack();
            return;
        }

        viewModel = new ViewModelProvider(requireActivity()).get(MoviesViewmodel.class);

        viewModel.urlTrailer.observe(getViewLifecycleOwner(), resource -> {
            if (resource == null) return;

            switch (resource.status) {
                case LOADING:
                    binding.progressBar.setVisibility(View.VISIBLE);
                    break;
                case SUCCESS:
                    if (resource.data != null) {

                        // Nos aseguramos de que obtenemos la key de un trailer
                        for (Trailer video: resource.data.getResults()) {

                            if (video.getSite().equalsIgnoreCase("YouTube") && video.getType().equalsIgnoreCase("Trailer")) {
                                key = video.getKey();
                            }

                        }

                    } else {
                        // Si no hay datos, volvemos a la pantalla anterior
                        Navigation.findNavController(view).popBackStack();
                    }
                    break;
                case ERROR:
                    binding.progressBar.setVisibility(View.GONE);
                    new MaterialAlertDialogBuilder(requireContext())
                            .setMessage(resource.message)
                            .setPositiveButton(getString(R.string.dialog_accept), null)
                            .show();
                    break;
            }
        });

        viewModel.peliculaDetalle.observe(getViewLifecycleOwner(), resource -> {
            if (resource == null) return;

            switch (resource.status) {
                case LOADING:
                    binding.progressBar.setVisibility(View.VISIBLE);
                    break;
                case SUCCESS:
                    if (resource.data != null) {

                        rellenarUI(view, resource.data);

                    } else {
                        // Si no hay datos, volvemos a la pantalla anterior
                        Navigation.findNavController(view).popBackStack();
                    }
                    break;
                case ERROR:
                    binding.progressBar.setVisibility(View.GONE);
                    new MaterialAlertDialogBuilder(requireContext())
                            .setMessage(resource.message)
                            .setPositiveButton(getString(R.string.dialog_accept), null)
                            .show();
                    break;
            }
        });

        viewModel.loadMovieDetail(movieId);

        // Casting

        castAdapter = new CastAdapter(requireContext());

        binding.recyclerCast.setAdapter(castAdapter);
        binding.recyclerCast.setLayoutManager(
                new LinearLayoutManager(getContext(), LinearLayoutManager.HORIZONTAL, false));

        castAdapter.setOnCastClickListener(new CastAdapter.OnCastClickListener() {
            @Override
            public void onCastClick(CastMember member) {
                Bundle bundle = new Bundle();
                bundle.putInt("PERSON_ID", member.getId());
                Navigation.findNavController(requireView())
                        .navigate(R.id.personDetailFragment, bundle);
            }

            @Override
            public void onSeeMoreClick() {}
        });

        viewModel.movieCredits.observe(getViewLifecycleOwner(), resource -> {
            if (resource == null) return;

            switch (resource.status) {
                case SUCCESS:
                    if (resource.data != null) {
                        // Reparto
                        List<CastMember> cast = resource.data.getCast();
                        if (cast != null && !cast.isEmpty()) {
                            binding.layoutCastSection.setVisibility(View.VISIBLE);
                            castAdapter.setCastList(cast);
                        } else {
                            binding.layoutCastSection.setVisibility(View.GONE);
                        }

                        // Equipo tecnico
                        crewList = resource.data.getCrew();
                        if (crewList != null && !crewList.isEmpty()) {
                            showTecnicalTeam(crewList, false);
                        } else {
                            binding.layoutCrewSection.setVisibility(View.GONE);
                        }
                    }
                    break;
                case ERROR:
                    binding.layoutCastSection.setVisibility(View.GONE);
                    binding.layoutCrewSection.setVisibility(View.GONE);
                    break;
            }
        });

        commentsViewmodel = new ViewModelProvider(this).get(CommentsViewmodel.class);
        userViewmodel     = new ViewModelProvider(requireActivity()).get(UserViewmodel.class);

        commentsAdapter = new CommentsAdapter(requireContext());
        binding.recyclerComments.setAdapter(commentsAdapter);

        userViewmodel.loadUsername();
        userViewmodel.getUsername().observe(getViewLifecycleOwner(), name -> {
            if (name != null && !name.isEmpty()) currentUsername = name;
        });

        observarComentarios();
        inicializarBtnPublicar();

        commentsViewmodel.loadComments(String.valueOf(movieId));

    }
    private void rellenarUI(View view, MovieDetail pelicula) {

        binding.progressBar.setVisibility(View.GONE);

        String imgBaseUrl = "https://image.tmdb.org/t/p/w780" + pelicula.getImgPoster();

        Glide.with(view.getContext())
                .load(imgBaseUrl)
                .placeholder(R.drawable.gradient_overlay)
                .into(binding.imgDetailPoster);

        binding.txtDetailTitle.setText(pelicula.getTitle());

        if (pelicula.getRuntime() > 0) {
            int horas = pelicula.getRuntime() / 60;
            int minutos = pelicula.getRuntime() % 60;
            duracion = horas + "h " + minutos + " min";

            binding.txtDetailDuration.setText(duracion);
        } else {
            binding.txtDetailDuration.setText("-");
        }

        if (pelicula.getRating() > 0) {
            String puntuacion = String.format("%.1f", pelicula.getRating()); // 1 solo decimal
            binding.txtRating.setText(puntuacion);
        } else {
            binding.txtRating.setText("-");
        }

        binding.btnTrailer.setOnClickListener(v -> {

            if(key == null) {
                new MaterialAlertDialogBuilder(requireContext())
                        .setMessage(getString(R.string.msg_no_trailer))
                        .setPositiveButton(getString(R.string.dialog_accept), null)
                        .show();
            } else {
                openYoutube(key);
            }

        });

        if (pelicula.getGenres() != null && !pelicula.getGenres().isEmpty()) {
            binding.chipGeneros.removeAllViews();

            for (Genre genero : pelicula.getGenres()) {
                Chip chip = new Chip(getContext());
                chip.setText(genero.getName());

                chip.setChipBackgroundColorResource(R.color.dark_accent_glow);
                chip.setChipStrokeWidth(1f);
                chip.setChipStrokeColorResource(R.color.white);

                binding.chipGeneros.addView(chip);
            }
        }

        binding.txtDetailDescription.setText(pelicula.getDescription());

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            LocalDate fecha = LocalDate.parse(pelicula.getReleaseDate());
            DateTimeFormatter formato = DateTimeFormatter.ofPattern("d 'de' MMMM, yyyy", new Locale("es", "ES"));

            releaseDateFormatted = fecha.format(formato);
        } else {
            // Fallback para versiones inferiores a la que se usa en desarrollo
            String [] fecha = pelicula.getReleaseDate().split("-");
            String dia = fecha[2];
            String mes = fecha[1];
            String anio = fecha[0];
            releaseDateFormatted = dia + "/" + mes + "/" + anio;
        }

        if (releaseDateFormatted.isEmpty()) releaseDateFormatted = "Desconocida";

        binding.txtDetailReleaseDate.setText(releaseDateFormatted);

        // Presupuesto en euros
        budgetEuros = pelicula.getBudget() * 0.86;

        if (budgetEuros == 0) {
            binding.txtDetailBudget.setText("Desconocido");
        } else {
            NumberFormat formateador = NumberFormat.getCurrencyInstance(new Locale("es", "ES"));
            String budget = formateador.format(budgetEuros);
            binding.txtDetailBudget.setText(budget);
        }

    }

    private void openYoutube (String key) {

        Uri appUri = Uri.parse(APP_URL_BASE + key);
        Uri webUri = Uri.parse(WEB_URL_BASE + key);

        try {
            Intent intentApp = new Intent(Intent.ACTION_VIEW, appUri);

            startActivity(intentApp);
        } catch (ActivityNotFoundException e) {
            Intent intentWeb = new Intent(Intent.ACTION_VIEW, webUri);

            startActivity(intentWeb);
        }

    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }

    private void observarComentarios() {
        commentsViewmodel.comments
                .observe(getViewLifecycleOwner(), resource -> {
                    switch (resource.status) {
                        case LOADING:
                            binding.progressBarComments.setVisibility(View.VISIBLE);
                            binding.recyclerComments.setVisibility(View.GONE);
                            binding.tvCommentsError.setVisibility(View.GONE);
                            break;
                        case SUCCESS:
                            binding.progressBarComments.setVisibility(View.GONE);
                            binding.recyclerComments.setVisibility(View.VISIBLE);
                            binding.tvCommentsError.setVisibility(View.GONE);
                            commentsAdapter.setCommentList(resource.data);
                            break;
                        case ERROR:
                            binding.progressBarComments.setVisibility(View.GONE);
                            binding.recyclerComments.setVisibility(View.GONE);
                            binding.tvCommentsError.setVisibility(View.VISIBLE);
                            binding.tvCommentsError.setText(resource.message);
                            break;
                    }
                });
    }

    private void inicializarBtnPublicar() {
        binding.btnPublishComment.setOnClickListener(v -> {
            String texto = binding.etComment.getText().toString().trim();
            if (!texto.isEmpty()) {
                commentsViewmodel.addComment(String.valueOf(movieId), texto, currentUsername);
                binding.etComment.setText("");
            }
        });
    }

    private void showTecnicalTeam(List<CrewMember> crew, boolean isSeries) {
        List<CrewMember> directors = new ArrayList<>();
        List<CrewMember> writers = new ArrayList<>();

        for (CrewMember member : crew) {
            if ("Director".equalsIgnoreCase(member.getJob())) {
                directors.add(member);
            }
            if ("Writer".equalsIgnoreCase(member.getJob())
                    || "Screenplay".equalsIgnoreCase(member.getJob())) {
                writers.add(member);
            }
        }

        if (directors.isEmpty() && writers.isEmpty()) {
            binding.layoutCrewSection.setVisibility(View.GONE);
            return;
        }

        binding.layoutCrewSection.setVisibility(View.VISIBLE);

        if (!directors.isEmpty()) {
            binding.layoutDirector.setVisibility(View.VISIBLE);
            int maxShow = isSeries ? 3 : directors.size();
            String directorText = buildCrewText(directors, maxShow);
            binding.txtDirectors.setText(directorText);

            binding.txtDirectors.setOnClickListener(v -> {
                if (directors.size() == 1) {
                    navigateToPerson(directors.get(0).getId());
                }
            });
        } else {
            binding.layoutDirector.setVisibility(View.GONE);
        }

        if (!writers.isEmpty()) {
            binding.layoutWriter.setVisibility(View.VISIBLE);
            int maxShow = isSeries ? 3 : writers.size();
            String writerText = buildCrewText(writers, maxShow);
            binding.txtWriters.setText(writerText);

            binding.txtWriters.setOnClickListener(v -> {
                if (writers.size() == 1) {
                    navigateToPerson(writers.get(0).getId());
                }
            });
        } else {
            binding.layoutWriter.setVisibility(View.GONE);
        }

        // Si hay multiples personas, cada nombre es clickable usando ClickableSpan
        if (directors.size() > 1) {
            makeCrewClickable(binding.txtDirectors, directors, isSeries ? 3 : directors.size());
        }
        if (writers.size() > 1) {
            makeCrewClickable(binding.txtWriters, writers, isSeries ? 3 : writers.size());
        }
    }

    private String buildCrewText(List<CrewMember> members, int maxShow) {
        StringBuilder sb = new StringBuilder();
        int show = Math.min(members.size(), maxShow);

        for (int i = 0; i < show; i++) {
            if (i > 0) sb.append(", ");
            sb.append(members.get(i).getName());
        }

        int remaining = members.size() - show;
        if (remaining > 0) {
            sb.append(" y ").append(remaining).append(" mas");
        }

        return sb.toString();
    }

    private void makeCrewClickable(TextView textView, List<CrewMember> members, int maxShow) {
        int show = Math.min(members.size(), maxShow);
        String fullText = textView.getText().toString();
        android.text.SpannableString spannable = new android.text.SpannableString(fullText);

        int start = 0;
        for (int i = 0; i < show; i++) {
            String name = members.get(i).getName();
            int nameStart = fullText.indexOf(name, start);
            if (nameStart >= 0) {
                int nameEnd = nameStart + name.length();
                final int personId = members.get(i).getId();
                spannable.setSpan(new android.text.style.ClickableSpan() {
                    @Override
                    public void onClick(@NonNull View widget) {
                        navigateToPerson(personId);
                    }
                }, nameStart, nameEnd, android.text.Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
                start = nameEnd;
            }
        }

        textView.setText(spannable);
        textView.setMovementMethod(android.text.method.LinkMovementMethod.getInstance());
    }

    private void navigateToPerson(int personId) {
        Bundle bundle = new Bundle();
        bundle.putInt("PERSON_ID", personId);
        Navigation.findNavController(requireView())
                .navigate(R.id.personDetailFragment, bundle);
    }
}