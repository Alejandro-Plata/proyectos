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
import es.iesagora.cinexplora.controller.viewmodel.SeriesViewmodel;
import es.iesagora.cinexplora.controller.viewmodel.SharedPreferencesViewmodel;
import es.iesagora.cinexplora.controller.viewmodel.WatchlistViewmodel;
import es.iesagora.cinexplora.databinding.FragmentSeriesBinding;
import es.iesagora.cinexplora.model.PendingMedia;
import es.iesagora.cinexplora.model.request.Genre;
import es.iesagora.cinexplora.model.request.Serie;
import es.iesagora.cinexplora.model.states.Resource;
import es.iesagora.cinexplora.recyclerview.adapter.SeriesAdapter;

public class SeriesFragment extends Fragment {

    private FragmentSeriesBinding binding;
    private SeriesViewmodel viewModel;
    private SeriesAdapter adapter;
    private static final String ARG_TYPE = "screen_type";
    private String screenType;
    private WatchlistViewmodel watchlistViewmodel;
    private SharedPreferencesViewmodel spViewmodel;

    private Integer selectedGenreId = null;
    private String selectedSortBy = "popularity.desc";
    private List<Genre> loadedGenres = null;

    public static SeriesFragment newInstance(String type) {
        SeriesFragment fragment = new SeriesFragment();
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
        binding = FragmentSeriesBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        viewModel = new ViewModelProvider(this).get(SeriesViewmodel.class);
        spViewmodel = new ViewModelProvider(requireActivity()).get(SharedPreferencesViewmodel.class);
        watchlistViewmodel = new ViewModelProvider(requireActivity()).get(WatchlistViewmodel.class);

        spViewmodel.loadConnectionType();
        setupRecyclerView();
        setupButtons();
        observeSerieList();
        observeGenres();
        pagination();

        spViewmodel.getConnectionType().observe(getViewLifecycleOwner(), isWifiOnly -> {
            if (isWifiOnly && !isWifiConnected()) {
                showWifiPlaceholder();
            } else {
                if (viewModel.listaSeries.getValue() == null) {
                    viewModel.loadSeries();
                    viewModel.loadTvGenres();
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

        popup.setOnMenuItemClickListener(item -> {
            switch (item.getItemId()) {
                case 0: selectedSortBy = "popularity.desc";
                    binding.btnSort.setText(getString(R.string.filter_popular)); break;
                case 1: selectedSortBy = "vote_average.desc";
                    binding.btnSort.setText(getString(R.string.filter_top_rated)); break;
                case 2: selectedSortBy = "first_air_date.desc";
                    binding.btnSort.setText(getString(R.string.filter_newest)); break;
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
        adapter.setSerieList(java.util.Collections.emptyList());
        viewModel.loadSeriesWithFilter(selectedGenreId, selectedSortBy);
    }

    private void observeGenres() {
        viewModel.listaGeneros.observe(getViewLifecycleOwner(), resource -> {
            if (resource == null || resource.status != Resource.Status.SUCCESS
                    || resource.data == null) return;
            loadedGenres = resource.data;
        });
    }

    public void setupRecyclerView() {
        adapter = new SeriesAdapter(requireContext());
        binding.rvSeries.setAdapter(adapter);
        binding.rvSeries.setLayoutManager(new LinearLayoutManager(getContext()));
        adapter.setOnSerieAddListener(serie -> saveSerie(serie));
    }

    private void saveSerie(Serie serie) {
        PendingMedia media = new PendingMedia(
                serie.getId(), "serie", serie.getNombre(),
                serie.getImgPoster(), System.currentTimeMillis());

        if (watchlistViewmodel.exists(media.getTmdbId())) {
            new MaterialAlertDialogBuilder(requireContext())
                    .setMessage(getString(R.string.msg_already_in_list))
                    .setPositiveButton(getString(R.string.dialog_accept), null).show();
        } else {
            watchlistViewmodel.addItem(media);
            new MaterialAlertDialogBuilder(requireContext())
                    .setMessage(getString(R.string.msg_added_to_watchlist, serie.getNombre()))
                    .setPositiveButton(getString(R.string.dialog_accept), null).show();
        }
    }

    public void observeSerieList() {
        viewModel.listaSeries.observe(getViewLifecycleOwner(), resource -> {
            if (resource == null) return;
            switch (resource.status) {
                case LOADING:
                    if (!binding.swipeRefresh.isRefreshing() && adapter.getItemCount() == 0)
                        binding.progressBar.setVisibility(View.VISIBLE);
                    binding.layoutError.layoutError.setVisibility(View.GONE);
                    break;
                case SUCCESS:
                    binding.progressBar.setVisibility(View.GONE);
                    binding.layoutError.layoutError.setVisibility(View.GONE);
                    binding.rvSeries.setVisibility(View.VISIBLE);
                    if (resource.data != null) {
                        if (binding.swipeRefresh.isRefreshing() || adapter.getItemCount() == 0)
                            adapter.setSerieList(resource.data);
                        else
                            adapter.addSerieList(resource.data);
                    }
                    binding.swipeRefresh.setRefreshing(false);
                    break;
                case ERROR:
                    binding.progressBar.setVisibility(View.GONE);
                    binding.swipeRefresh.setRefreshing(false);
                    if (adapter.getItemCount() == 0) {
                        binding.rvSeries.setVisibility(View.GONE);
                        binding.layoutError.layoutError.setVisibility(View.VISIBLE);
                        binding.layoutError.tvErrorMessage.setText(resource.message);
                    } else {
                        new MaterialAlertDialogBuilder(requireContext())
                                .setMessage(getString(R.string.msg_load_more_error))
                                .setPositiveButton(getString(R.string.dialog_accept), null).show();
                    }
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
            viewModel.loadSeries();
        });

        binding.rvSeries.addOnScrollListener(new RecyclerView.OnScrollListener() {
            @Override
            public void onScrolled(@NonNull RecyclerView recyclerView, int dx, int dy) {
                LinearLayoutManager lm = (LinearLayoutManager) recyclerView.getLayoutManager();
                if (lm != null && viewModel.listaSeries.getValue() != null &&
                        viewModel.listaSeries.getValue().status != Resource.Status.LOADING) {
                    if ((lm.getChildCount() + lm.findFirstVisibleItemPosition()) >= lm.getItemCount()
                            && lm.findFirstVisibleItemPosition() >= 0) {
                        viewModel.loadMoreSeries();
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
        binding.rvSeries.setVisibility(View.GONE);
        binding.swipeRefresh.setRefreshing(false);
        binding.layoutError.layoutError.setVisibility(View.VISIBLE);
        binding.layoutError.tvErrorMessage.setText(getString(R.string.msg_wifi_only_mode));
        binding.layoutError.ivErrorIcon.setImageResource(R.drawable.ic_wifi_off);
    }
}
