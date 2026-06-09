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

import androidx.appcompat.app.AlertDialog;

import es.iesagora.cinexplora.R;
import es.iesagora.cinexplora.controller.viewmodel.SharedPreferencesViewmodel;
import es.iesagora.cinexplora.databinding.FragmentMoviesBinding;
import es.iesagora.cinexplora.model.request.Movie;
import es.iesagora.cinexplora.model.states.Resource;
import es.iesagora.cinexplora.model.PendingMedia;
import es.iesagora.cinexplora.recyclerview.adapter.MoviesAdapter;
import es.iesagora.cinexplora.controller.viewmodel.MoviesViewmodel;
import es.iesagora.cinexplora.controller.viewmodel.WatchlistViewmodel;

public class MoviesFragment extends Fragment {

    private FragmentMoviesBinding binding;
    private MoviesViewmodel viewModel;
    private MoviesAdapter adapter;
    private static final String ARG_TYPE = "screen_type";
    private String screenType;
    private WatchlistViewmodel watchlistViewmodel;
    private SharedPreferencesViewmodel spViewmodel;

    // Método estático para crear el fragmento con argumentos
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

    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        viewModel = new ViewModelProvider(this).get(MoviesViewmodel.class);
        spViewmodel = new ViewModelProvider(requireActivity()).get(SharedPreferencesViewmodel.class);
        watchlistViewmodel = new ViewModelProvider(requireActivity()).get(WatchlistViewmodel.class);

        spViewmodel.loadConnectionType();
        setupRecyclerView();
        observeMovieList();
        pagination();


        spViewmodel.getConnectionType().observe(getViewLifecycleOwner(), isWifiOnly -> {

            if (isWifiOnly && !isWifiConnected()) {
                showWifiPlaceholder();
            } else {
                if (viewModel.listaPeliculas.getValue() == null) {
                    viewModel.loadMovies();
                }
            }
        });


    }

    public void setupRecyclerView() {
        adapter = new MoviesAdapter(requireContext());
        binding.rvMovies.setAdapter(adapter);
        binding.rvMovies.setLayoutManager(new LinearLayoutManager(getContext())); // 1 sola pelicula por fila

        adapter.setOnMovieAddListener(movie -> {
            saveMovie(movie);
        });
    }
    private void saveMovie(Movie pelicula) {
        PendingMedia media = new PendingMedia(
                pelicula.getId(),
                "movie",
                pelicula.getTitle(),
                pelicula.getImgPoster(),
                System.currentTimeMillis()
        );

        if (watchlistViewmodel.exists(media.getTmdbId())) {
            new AlertDialog.Builder(requireContext())
                    .setMessage(getString(R.string.msg_already_in_list))
                    .setPositiveButton(getString(R.string.dialog_accept), null)
                    .show();
        } else {
            watchlistViewmodel.addItem(media);
            new AlertDialog.Builder(requireContext())
                    .setMessage(getString(R.string.msg_added_to_watchlist, pelicula.getTitle()))
                    .setPositiveButton(getString(R.string.dialog_accept), null)
                    .show();
        }
    }


    public void observeMovieList() {

        viewModel.listaPeliculas.observe(getViewLifecycleOwner(), resource -> {

            if (resource == null) return;

            switch (resource.status) {
                case LOADING:
                    if (!binding.swipeRefresh.isRefreshing()) {
                        binding.progressBar.setVisibility(View.VISIBLE);
                    }
                    binding.layoutError.layoutError.setVisibility(View.GONE);
                    break;

                case SUCCESS:
                    binding.progressBar.setVisibility(View.GONE);
                    binding.layoutError.layoutError.setVisibility(View.GONE);
                    binding.rvMovies.setVisibility(View.VISIBLE);

                    if (resource.data != null) {

                        if (binding.swipeRefresh.isRefreshing() || adapter.getItemCount() == 0) {
                            adapter.setMovieList(resource.data);
                        } else {
                            adapter.addMovieList(resource.data);
                        }
                    }

                    binding.swipeRefresh.setRefreshing(false); // Detenemos animación swipe

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
            viewModel.loadMovies();
        });

        binding.rvMovies.addOnScrollListener(new RecyclerView.OnScrollListener() {
            @Override
            public void onScrolled(@NonNull RecyclerView recyclerView, int dx, int dy) {
                super.onScrolled(recyclerView, dx, dy);

                LinearLayoutManager layoutManager = (LinearLayoutManager) recyclerView.getLayoutManager();
                if (layoutManager != null) {
                    int visibleItemCount = layoutManager.getChildCount();
                    int totalItemCount = layoutManager.getItemCount();
                    int firstVisibleItemPosition = layoutManager.findFirstVisibleItemPosition();

                    if (viewModel.listaPeliculas.getValue() != null &&
                            viewModel.listaPeliculas.getValue().status != Resource.Status.LOADING) {

                        if ((visibleItemCount + firstVisibleItemPosition) >= totalItemCount
                                && firstVisibleItemPosition >= 0) {
                            viewModel.loadMoreMovies();
                        }
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
        ConnectivityManager connManager = (ConnectivityManager) requireContext().getSystemService(Context.CONNECTIVITY_SERVICE);

        if (connManager == null) return false;

        Network network = connManager.getActiveNetwork();
        if (network == null) return false;

        NetworkCapabilities capabilities = connManager.getNetworkCapabilities(network);

        return capabilities != null && capabilities.hasTransport(NetworkCapabilities.TRANSPORT_WIFI);
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