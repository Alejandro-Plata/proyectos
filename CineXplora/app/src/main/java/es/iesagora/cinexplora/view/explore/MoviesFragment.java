package es.iesagora.cinexplora.view.explore;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkCapabilities;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.google.android.material.dialog.MaterialAlertDialogBuilder;

import java.util.List;

import es.iesagora.cinexplora.R;
import es.iesagora.cinexplora.controller.viewmodel.MoviesViewmodel;
import es.iesagora.cinexplora.controller.viewmodel.SharedPreferencesViewmodel;
import es.iesagora.cinexplora.controller.viewmodel.WatchlistViewmodel;
import es.iesagora.cinexplora.databinding.FragmentMoviesBinding;
import es.iesagora.cinexplora.model.PendingMedia;
import es.iesagora.cinexplora.model.request.Genre;
import es.iesagora.cinexplora.model.request.Movie;
import es.iesagora.cinexplora.model.states.Resource;
import es.iesagora.cinexplora.recyclerview.adapter.MoviesAdapter;

public class MoviesFragment extends Fragment {

    private FragmentMoviesBinding binding;
    private MoviesViewmodel viewModel;
    private MoviesAdapter adapter;
    private static final String ARG_TYPE = "screen_type";
    private String screenType;
    private WatchlistViewmodel watchlistViewmodel;
    private SharedPreferencesViewmodel spViewmodel;

    private Integer selectedGenreId = null;
    private String selectedSortBy = "popularity.desc";
    private List<Genre> loadedGenres = null;

    public static MoviesFragment newInstance(String type) {
        MoviesFragment fragment = new MoviesFragment();
        Bundle args = new Bundle();
        args.putString(ARG_TYPE, type);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            screenType = getArguments().getString(ARG_TYPE);
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        binding = FragmentMoviesBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        viewModel = new ViewModelProvider(this).get(MoviesViewmodel.class);
        spViewmodel = new ViewModelProvider(requireActivity()).get(SharedPreferencesViewmodel.class);
        watchlistViewmodel = new ViewModelProvider(requireActivity()).get(WatchlistViewmodel.class);

        spViewmodel.loadConnectionType();
        setupRecyclerView();
        setupButtons();
        observeMovieList();
        observeGenres();
        pagination();

        spViewmodel.getConnectionType().observe(getViewLifecycleOwner(), isWifiOnly -> {
            if (isWifiOnly && !isWifiConnected()) {
                showWifiPlaceholder();
            } else {
                if (viewModel.listaPeliculas.getValue() == null) {
                    viewModel.loadMovies();
                    viewModel.loadMovieGenres();
                }
            }
        });
    }

    private void setupButtons() {
        binding.btnSort.setOnClickListener(v -> showSortMenu(v));
        binding.btnGenre.setOnClickListener(v -> showGenreSheet());
    }

    private void showSortMenu(View anchor) {
        android.widget.PopupMenu popup = new android.widget.PopupMenu(requireContext(), anchor);
        popup.getMenu().add(0, 0, 0, getString(R.string.filter_popular));
        popup.getMenu().add(0, 1, 1, getString(R.string.filter_top_rated));
        popup.getMenu().add(0, 2, 2, getString(R.string.filter_newest));
        popup.getMenu().add(0, 3, 3, getString(R.string.filter_revenue));

        popup.setOnMenuItemClickListener(item -> {
            switch (item.getItemId()) {
                case 0: selectedSortBy = "popularity.desc";
                    binding.btnSort.setText(getString(R.string.filter_popular)); break;
                case 1: selectedSortBy = "vote_average.desc";
                    binding.btnSort.setText(getString(R.string.filter_top_rated)); break;
                case 2: selectedSortBy = "primary_release_date.desc";
                    binding.btnSort.setText(getString(R.string.filter_newest)); break;
                case 3: selectedSortBy = "revenue.desc";
                    binding.btnSort.setText(getString(R.string.filter_revenue)); break;
                default: return false;
            }
            applyFilters();
            return true;
        });
        popup.show();
    }

    private void showGenreSheet() {
        ExploreGenreBottomSheet sheet = ExploreGenreBottomSheet.newInstance(loadedGenres, selectedGenreId);
        sheet.setOnGenreSelectedListener((genreId, genreName) -> {
            selectedGenreId = genreId;
            binding.btnGenre.setText(genreName);
            applyFilters();
        });
        sheet.show(getChildFragmentManager(), "genre_filter");
    }

    private void applyFilters() {
        adapter.setMovieList(java.util.Collections.emptyList());
        viewModel.loadMoviesWithFilter(selectedGenreId, selectedSortBy);
    }

    private void observeGenres() {
        viewModel.listaGeneros.observe(getViewLifecycleOwner(), resource -> {
            if (resource == null || resource.status != Resource.Status.SUCCESS
                    || resource.data == null) return;
            loadedGenres = resource.data;
        });
    }

    public void setupRecyclerView() {
        adapter = new MoviesAdapter(requireContext());
        binding.rvMovies.setAdapter(adapter);
        binding.rvMovies.setLayoutManager(new LinearLayoutManager(getContext()));
        adapter.setOnMovieAddListener(movie -> saveMovie(movie));
    }

    private void saveMovie(Movie pelicula) {
        PendingMedia media = new PendingMedia(
                pelicula.getId(), "movie", pelicula.getTitle(),
                pelicula.getImgPoster(), System.currentTimeMillis());

        if (watchlistViewmodel.exists(media.getTmdbId())) {
            new MaterialAlertDialogBuilder(requireContext())
                    .setMessage(getString(R.string.msg_already_in_list))
                    .setPositiveButton(getString(R.string.dialog_accept), null).show();
        } else {
            watchlistViewmodel.addItem(media);
            new MaterialAlertDialogBuilder(requireContext())
                    .setMessage(getString(R.string.msg_added_to_watchlist, pelicula.getTitle()))
                    .setPositiveButton(getString(R.string.dialog_accept), null).show();
        }
    }

    public void observeMovieList() {
        viewModel.listaPeliculas.observe(getViewLifecycleOwner(), resource -> {
            if (resource == null) return;
            switch (resource.status) {
                case LOADING:
                    if (!binding.swipeRefresh.isRefreshing())
                        binding.progressBar.setVisibility(View.VISIBLE);
                    binding.layoutError.layoutError.setVisibility(View.GONE);
                    break;
                case SUCCESS:
                    binding.progressBar.setVisibility(View.GONE);
                    binding.layoutError.layoutError.setVisibility(View.GONE);
                    binding.rvMovies.setVisibility(View.VISIBLE);
                    if (resource.data != null) {
                        if (binding.swipeRefresh.isRefreshing() || adapter.getItemCount() == 0)
                            adapter.setMovieList(resource.data);
                        else
                            adapter.addMovieList(resource.data);
                    }
                    binding.swipeRefresh.setRefreshing(false);
                    break;
                case ERROR:
                    binding.progressBar.setVisibility(View.GONE);
                    binding.rvMovies.setVisibility(View.GONE);
                    binding.layoutError.layoutError.setVisibility(View.VISIBLE);
                    binding.layoutError.tvErrorMessage.setText(resource.message);
                    break;
            }
        });
    }

    public void pagination() {
        binding.swipeRefresh.setOnRefreshListener(() -> {
            selectedGenreId = null;
            selectedSortBy = "popularity.desc";
            binding.btnSort.setText(getString(R.string.filter_popular));
            binding.btnGenre.setText(getString(R.string.label_all_genres));
            viewModel.loadMovies();
        });

        binding.rvMovies.addOnScrollListener(new RecyclerView.OnScrollListener() {
            @Override
            public void onScrolled(@NonNull RecyclerView recyclerView, int dx, int dy) {
                LinearLayoutManager lm = (LinearLayoutManager) recyclerView.getLayoutManager();
                if (lm != null && viewModel.listaPeliculas.getValue() != null &&
                        viewModel.listaPeliculas.getValue().status != Resource.Status.LOADING) {
                    if ((lm.getChildCount() + lm.findFirstVisibleItemPosition()) >= lm.getItemCount()
                            && lm.findFirstVisibleItemPosition() >= 0) {
                        viewModel.loadMoreMovies();
                    }
                }
            }
        });
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }

    private boolean isWifiConnected() {
        ConnectivityManager cm = (ConnectivityManager)
                requireContext().getSystemService(Context.CONNECTIVITY_SERVICE);
        if (cm == null) return false;
        Network net = cm.getActiveNetwork();
        if (net == null) return false;
        NetworkCapabilities caps = cm.getNetworkCapabilities(net);
        return caps != null && caps.hasTransport(NetworkCapabilities.TRANSPORT_WIFI);
    }

    private void showWifiPlaceholder() {
        binding.progressBar.setVisibility(View.GONE);
        binding.rvMovies.setVisibility(View.GONE);
        binding.swipeRefresh.setRefreshing(false);
        binding.layoutError.layoutError.setVisibility(View.VISIBLE);
        binding.layoutError.tvErrorMessage.setText(getString(R.string.msg_wifi_only_mode));
        binding.layoutError.ivErrorIcon.setImageResource(R.drawable.ic_wifi_off);
    }
}
