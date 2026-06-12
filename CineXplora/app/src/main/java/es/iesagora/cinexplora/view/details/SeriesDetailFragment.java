package es.iesagora.cinexplora.view.details;

import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.net.Uri;
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

import java.util.ArrayList;
import java.util.List;

import es.iesagora.cinexplora.R;
import es.iesagora.cinexplora.controller.viewmodel.CommentsViewmodel;
import es.iesagora.cinexplora.controller.viewmodel.UserViewmodel;
import es.iesagora.cinexplora.databinding.FragmentSeriesDetailBinding;
import es.iesagora.cinexplora.model.request.CastMember;
import es.iesagora.cinexplora.model.request.CrewMember;
import es.iesagora.cinexplora.model.request.Genre;
import es.iesagora.cinexplora.model.request.SerieDetail;
import es.iesagora.cinexplora.model.request.Trailer;
import es.iesagora.cinexplora.controller.viewmodel.SeriesViewmodel;
import es.iesagora.cinexplora.recyclerview.adapter.CastAdapter;
import es.iesagora.cinexplora.recyclerview.adapter.CommentsAdapter;

public class SeriesDetailFragment extends Fragment {

    FragmentSeriesDetailBinding binding;
    private int serieId;
    private SeriesViewmodel viewModel;
    private final String APP_URL_BASE = "vnd.youtube:";
    private final String WEB_URL_BASE = "https://www.youtube.com/watch?v=";
    private String key;
    private String temporadas;
    private CommentsViewmodel commentsViewmodel;
    private CommentsAdapter commentsAdapter;
    private UserViewmodel userViewmodel;
    private String currentUsername = "Usuario";
    private CastAdapter castAdapter;
    private List<CrewMember> crewList;
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        binding = FragmentSeriesDetailBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        if (getArguments() != null) {
            serieId = getArguments().getInt("SERIE_ID");
        } else {
            Navigation.findNavController(view).popBackStack();
            return;
        }

        viewModel = new ViewModelProvider(requireActivity()).get(SeriesViewmodel.class);

        viewModel.urlTrailer.observe(getViewLifecycleOwner(), resource -> {
            if (resource == null) return;

            switch (resource.status) {
                case LOADING:
                    binding.progressBar.setVisibility(View.VISIBLE);
                    break;
                case SUCCESS:
                    if (resource.data != null) {
                        for (Trailer video: resource.data.getResults()) {
                            if(video.getSite().equalsIgnoreCase("YouTube") && video.getType().equalsIgnoreCase("Trailer")) {
                                key = video.getKey();
                            }
                        }

                    } else {
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

        viewModel.serieDetalle.observe(getViewLifecycleOwner(), resource -> {
            if (resource == null) return;

            switch (resource.status) {
                case LOADING:
                    binding.progressBar.setVisibility(View.VISIBLE);
                    break;
                case SUCCESS:
                    if (resource.data != null) {

                        rellenarUI(view, resource.data);

                    } else {
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

        viewModel.loadSerieDetail(serieId);

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

        viewModel.seriesCredits.observe(getViewLifecycleOwner(), resource -> {
            if (resource == null) return;

            switch (resource.status) {
                case SUCCESS:
                    if (resource.data != null) {

                        List<CastMember> cast = resource.data.getCast();
                        if (cast != null && !cast.isEmpty()) {
                            binding.layoutCastSection.setVisibility(View.VISIBLE);
                            castAdapter.setCastList(cast);
                        } else {
                            binding.layoutCastSection.setVisibility(View.GONE);
                        }

                        crewList = resource.data.getCrew();
                        if (crewList != null && !crewList.isEmpty()) {
                            showTecnicalTeam(crewList, true);
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

        commentsViewmodel.loadComments(String.valueOf(serieId));
    }
    private void rellenarUI(View view, SerieDetail serie) {

        binding.progressBar.setVisibility(View.GONE);

        temporadas = serie.getNumberOfSeasons() > 1 ? serie.getNumberOfSeasons()  + " temporadas" : serie.getNumberOfSeasons() + " temporada";

        binding.txtDetailSeason.setText(temporadas);

        String imgBaseUrl = "https://image.tmdb.org/t/p/w780" + serie.getImgPoster();

        binding.txtDetailTitle.setText(serie.getName());

        Glide.with(view.getContext())
                .load(imgBaseUrl)
                .placeholder(R.drawable.gradient_overlay)
                .into(binding.imgDetailPoster);

        if (serie.getRating() > 0) {
            String puntuacion = String.format("%.1f", serie.getRating());
            binding.txtRating.setText(puntuacion);
        } else {
            binding.txtRating.setText("-");
        }

        if (serie.getGenres() != null && !serie.getGenres().isEmpty()) {
            binding.chipGeneros.removeAllViews();

            for (Genre genero : serie.getGenres()) {
                Chip chip = new Chip(getContext());
                chip.setText(genero.getName());

                chip.setChipBackgroundColorResource(R.color.dark_accent_glow);
                chip.setChipStrokeWidth(1f);
                chip.setChipStrokeColorResource(R.color.white);

                binding.chipGeneros.addView(chip);
            }
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

        binding.txtDetailDescription.setText(serie.getDescription());

        binding.txtDetailSeasons.setText(String.valueOf(serie.getNumberOfSeasons()));

        binding.txtDetailEpisodes.setText(String.valueOf(serie.getNumberOfEpisodes()));

        binding.txtDetailStatus.setText(serie.getStatus());
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
                commentsViewmodel.addComment(String.valueOf(serieId), texto, currentUsername);
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
            if ("Writer".equalsIgnoreCase(member.getJob()) || "Screenplay".equalsIgnoreCase(member.getJob())) {
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

        // Mostrar guionistas
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