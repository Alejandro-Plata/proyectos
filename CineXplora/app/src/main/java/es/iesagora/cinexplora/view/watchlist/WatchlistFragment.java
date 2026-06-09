package es.iesagora.cinexplora.view.watchlist;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.appcompat.app.AlertDialog;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;
import androidx.navigation.Navigation;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.ItemTouchHelper;
import androidx.recyclerview.widget.RecyclerView;

import com.google.android.material.snackbar.Snackbar;

import java.util.ArrayList;
import java.util.List;

import es.iesagora.cinexplora.R;
import es.iesagora.cinexplora.databinding.FragmentWatchlistBinding;
import es.iesagora.cinexplora.model.MediaType;
import es.iesagora.cinexplora.model.PendingMedia;
import es.iesagora.cinexplora.recyclerview.adapter.WatchlistAdapter;
import es.iesagora.cinexplora.controller.viewmodel.WatchlistViewmodel;

public class WatchlistFragment extends Fragment {

    private FragmentWatchlistBinding binding;
    private WatchlistViewmodel viewModel;
    private WatchlistAdapter adapter;

    // Esta lista guarda todos los datos de la base de datos para no tener que volver a pedirla al filtrar
    private List<PendingMedia> listaMaestra = new ArrayList<>();

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        binding = FragmentWatchlistBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        viewModel = new ViewModelProvider(this).get(WatchlistViewmodel.class);
        setupRecyclerView();
        setupFilters();
        observeData();
        setupSwipeToDelete();

        binding.btnGoToExplore.setOnClickListener(v -> {
            Navigation.findNavController(v).navigate(R.id.exploreFragment);
        });
    }

    private void setupRecyclerView() {
        adapter = new WatchlistAdapter(requireContext());
        binding.rvWatchlist.setAdapter(adapter);
        binding.rvWatchlist.setLayoutManager(new GridLayoutManager(requireContext(), 3));
    }

    private void observeData() {
        viewModel.getAllPending().observe(getViewLifecycleOwner(), resource -> {

            switch (resource.status) {

                case LOADING:
                    binding.progressBar.setVisibility(View.VISIBLE);
                    binding.rvWatchlist.setVisibility(View.GONE);
                    break;

                case SUCCESS:
                    binding.progressBar.setVisibility(View.GONE);
                    binding.rvWatchlist.setVisibility(View.VISIBLE);
                    if (resource.data != null) {
                        listaMaestra = resource.data;
                        filtrarLista();
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

    private void setupFilters() {
        binding.radioGroupFilters.setOnCheckedChangeListener((group, checkedId) -> {
            filtrarLista();
        });
    }

    private void setupSwipeToDelete() {
        ItemTouchHelper.SimpleCallback callback = new ItemTouchHelper.SimpleCallback(
                0,
                ItemTouchHelper.LEFT | ItemTouchHelper.RIGHT
        ) {
            @Override
            public boolean onMove(@NonNull RecyclerView recyclerView,
                                  @NonNull RecyclerView.ViewHolder viewHolder,
                                  @NonNull RecyclerView.ViewHolder target) {
                return false;
            }

            @Override
            public void onSwiped(@NonNull RecyclerView.ViewHolder viewHolder, int direction) {
                int position = viewHolder.getBindingAdapterPosition();

                PendingMedia itemToDelete = adapter.getItemAt(position);

                if (itemToDelete != null) {
                    viewModel.deleteItem(itemToDelete);

                    adapter.removeItem(position);

                    Snackbar.make(binding.getRoot(), getString(R.string.msg_deleted, itemToDelete.getTitle()), Snackbar.LENGTH_LONG)
                            .setAction(getString(R.string.dialog_undo), v -> {
                                viewModel.addItem(itemToDelete);
                            }).show();
                }
            }
        };

        new ItemTouchHelper(callback).attachToRecyclerView(binding.rvWatchlist);
    }

    private void filtrarLista() {
        int selectedId = binding.radioGroupFilters.getCheckedRadioButtonId();
        List<PendingMedia> listaFiltrada = new ArrayList<>();

        if (selectedId == R.id.radioAll) {
            listaFiltrada.addAll(listaMaestra);
        }
        else if (selectedId == R.id.radioMovies) {
            for (PendingMedia item : listaMaestra) {
                if (MediaType.MOVIE.name().equalsIgnoreCase(item.getType())) {
                    listaFiltrada.add(item);
                }
            }
        }
        else if (selectedId == R.id.radioSeries) {
            for (PendingMedia item : listaMaestra) {
                if (MediaType.SERIE.name().equalsIgnoreCase(item.getType())) {
                    listaFiltrada.add(item);
                }
            }
        }

        actualizarUI(listaFiltrada);
    }

    private void actualizarUI(List<PendingMedia> listaParaMostrar) {
        if (listaParaMostrar.isEmpty()) {
            binding.rvWatchlist.setVisibility(View.GONE);
            binding.layoutEmptyState.setVisibility(View.VISIBLE);

            if (binding.radioMovies.isChecked()) binding.tvEmptyMessage.setText(getString(R.string.msg_no_pending_movies));
            else if (binding.radioSeries.isChecked()) binding.tvEmptyMessage.setText(getString(R.string.msg_no_pending_series));
            else binding.tvEmptyMessage.setText(getString(R.string.msg_empty_list));

        } else {
            binding.layoutEmptyState.setVisibility(View.GONE);
            binding.rvWatchlist.setVisibility(View.VISIBLE);
            adapter.setWatchlist(listaParaMostrar);
        }
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}