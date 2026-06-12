package es.iesagora.cinexplora.view.favorites;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.PopupMenu;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;
import androidx.navigation.Navigation;
import androidx.recyclerview.widget.GridLayoutManager;

import com.google.android.material.dialog.MaterialAlertDialogBuilder;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import es.iesagora.cinexplora.R;
import es.iesagora.cinexplora.controller.viewmodel.FavoriteActorsViewmodel;
import es.iesagora.cinexplora.databinding.FragmentFavoriteActorsBinding;
import es.iesagora.cinexplora.model.FavoriteActor;
import es.iesagora.cinexplora.recyclerview.adapter.FavoriteActorsAdapter;

public class FavoriteActorsFragment extends Fragment {

    private static final int SORT_RECENTLY  = 0;
    private static final int SORT_NAME_AZ   = 1;
    private static final int SORT_DEPT      = 2;

    private FragmentFavoriteActorsBinding binding;
    private FavoriteActorsViewmodel viewModel;
    private FavoriteActorsAdapter adapter;
    private List<FavoriteActor> masterList = new ArrayList<>();
    private int currentSort = SORT_RECENTLY;
    private boolean searchVisible = false;

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        binding = FragmentFavoriteActorsBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        viewModel = new ViewModelProvider(requireActivity()).get(FavoriteActorsViewmodel.class);

        setupRecyclerView();
        setupHeader();
        observeFavorites();
        observeBirthdays();
    }

    private void setupRecyclerView() {
        adapter = new FavoriteActorsAdapter(requireContext());
        binding.rvFavoriteActors.setAdapter(adapter);
        binding.rvFavoriteActors.setLayoutManager(new GridLayoutManager(getContext(), 3));

        adapter.setOnItemClickListener(actor -> {
            Bundle bundle = new Bundle();
            bundle.putInt("PERSON_ID", actor.getPersonId());
            Navigation.findNavController(requireView())
                    .navigate(R.id.personDetailFragment, bundle);
        });

        adapter.setOnItemLongClickListener((actor, anchorView) -> showActorContextMenu(actor, anchorView));
    }

    private void setupHeader() {
        // Sort button
        binding.btnSortActors.setOnClickListener(v -> showSortMenu());

        // Search toggle
        binding.btnSearchActors.setOnClickListener(v -> {
            searchVisible = !searchVisible;
            binding.tilSearchActors.setVisibility(searchVisible ? View.VISIBLE : View.GONE);
            if (!searchVisible) {
                if (binding.etSearchActors.getText() != null) {
                    binding.etSearchActors.setText("");
                }
                applySearchAndSort(masterList);
            } else {
                binding.etSearchActors.requestFocus();
            }
        });

        // Search text watcher
        binding.etSearchActors.addTextChangedListener(new android.text.TextWatcher() {
            @Override public void beforeTextChanged(CharSequence s, int i, int c, int a) {}
            @Override public void onTextChanged(CharSequence s, int i, int b, int c) {}
            @Override
            public void afterTextChanged(android.text.Editable s) {
                applySearchAndSort(masterList);
            }
        });
    }

    private void showSortMenu() {
        PopupMenu popup = new PopupMenu(requireContext(), binding.btnSortActors);
        popup.getMenu().add(0, SORT_RECENTLY, 0, getString(R.string.sort_added_recently));
        popup.getMenu().add(0, SORT_NAME_AZ,  1, getString(R.string.sort_name_az));
        popup.getMenu().add(0, SORT_DEPT,     2, getString(R.string.sort_department));
        popup.setOnMenuItemClickListener(item -> {
            currentSort = item.getItemId();
            applySearchAndSort(masterList);
            return true;
        });
        popup.show();
    }

    private void showActorContextMenu(FavoriteActor actor, View anchor) {
        PopupMenu popup = new PopupMenu(requireContext(), anchor);
        popup.getMenu().add(0, 0, 0, getString(R.string.menu_view_filmography));
        popup.getMenu().add(0, 1, 1, getString(R.string.menu_remove_favorite));
        popup.setOnMenuItemClickListener(item -> {
            if (item.getItemId() == 0) {
                Bundle bundle = new Bundle();
                bundle.putInt("PERSON_ID", actor.getPersonId());
                Navigation.findNavController(requireView())
                        .navigate(R.id.personDetailFragment, bundle);
            } else {
                confirmRemoveFavorite(actor);
            }
            return true;
        });
        popup.show();
    }

    private void confirmRemoveFavorite(FavoriteActor actor) {
        new MaterialAlertDialogBuilder(requireContext())
                .setTitle(getString(R.string.dialog_remove_favorite_title))
                .setMessage(getString(R.string.dialog_remove_favorite_message, actor.getName()))
                .setPositiveButton(getString(R.string.dialog_delete_confirm),
                        (d, w) -> viewModel.removeFavorite(actor.getPersonId()))
                .setNegativeButton(getString(R.string.dialog_cancel), null)
                .show();
    }

    private void applySearchAndSort(List<FavoriteActor> source) {
        List<FavoriteActor> filtered = new ArrayList<>(source);

        // Search filter
        String query = binding.etSearchActors.getText() != null
                ? binding.etSearchActors.getText().toString().trim().toLowerCase() : "";
        if (!query.isEmpty()) {
            List<FavoriteActor> searched = new ArrayList<>();
            for (FavoriteActor a : filtered) {
                if (a.getName() != null && a.getName().toLowerCase().contains(query)) {
                    searched.add(a);
                }
            }
            filtered = searched;
        }

        // Sort
        switch (currentSort) {
            case SORT_NAME_AZ:
                Collections.sort(filtered, (a, b) -> {
                    String na = a.getName() != null ? a.getName() : "";
                    String nb = b.getName() != null ? b.getName() : "";
                    return na.compareToIgnoreCase(nb);
                });
                break;
            case SORT_DEPT:
                Collections.sort(filtered, (a, b) -> {
                    String da = a.getKnownForDepartment() != null ? a.getKnownForDepartment() : "";
                    String db = b.getKnownForDepartment() != null ? b.getKnownForDepartment() : "";
                    return da.compareToIgnoreCase(db);
                });
                break;
            default:
                Collections.sort(filtered, (a, b) -> Long.compare(b.getAddedAt(), a.getAddedAt()));
                break;
        }

        adapter.setActorList(filtered);
        updateCountLabel(filtered.size());
        updateEmptyState(filtered);
    }

    private void updateCountLabel(int count) {
        binding.tvActorCount.setText(getString(R.string.label_your_actors, count));
    }

    private void updateEmptyState(List<FavoriteActor> list) {
        if (list.isEmpty()) {
            binding.rvFavoriteActors.setVisibility(View.GONE);
            binding.layoutEmpty.setVisibility(View.VISIBLE);
        } else {
            binding.rvFavoriteActors.setVisibility(View.VISIBLE);
            binding.layoutEmpty.setVisibility(View.GONE);
        }
    }

    private void observeFavorites() {
        viewModel.getFavoriteActors().observe(getViewLifecycleOwner(), resource -> {
            switch (resource.status) {
                case LOADING:
                    binding.rvFavoriteActors.setVisibility(View.GONE);
                    binding.layoutEmpty.setVisibility(View.GONE);
                    break;

                case SUCCESS:
                    if (resource.data != null && !resource.data.isEmpty()) {
                        masterList = resource.data;
                        applySearchAndSort(masterList);
                        viewModel.checkBirthdaysForActors(masterList);
                    } else {
                        masterList = new ArrayList<>();
                        binding.rvFavoriteActors.setVisibility(View.GONE);
                        binding.layoutEmpty.setVisibility(View.VISIBLE);
                        updateCountLabel(0);
                    }
                    break;

                case ERROR:
                    binding.rvFavoriteActors.setVisibility(View.GONE);
                    binding.layoutEmpty.setVisibility(View.VISIBLE);
                    new MaterialAlertDialogBuilder(requireContext())
                            .setMessage(resource.message)
                            .setPositiveButton(getString(R.string.dialog_accept), null)
                            .show();
                    break;
            }
        });
    }

    private void observeBirthdays() {
        viewModel.getTodayBirthdays().observe(getViewLifecycleOwner(), ids -> {
            if (ids != null) {
                adapter.setBirthdayPersonIds(ids);
            }
        });
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}
