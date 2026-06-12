package es.iesagora.cinexplora.view.tracking;

import android.content.res.ColorStateList;
import android.graphics.Color;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.PopupMenu;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;
import androidx.navigation.Navigation;
import androidx.recyclerview.widget.ItemTouchHelper;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.android.material.chip.Chip;
import com.google.android.material.dialog.MaterialAlertDialogBuilder;
import com.google.android.material.snackbar.Snackbar;

import es.iesagora.cinexplora.R;
import es.iesagora.cinexplora.databinding.FragmentTrackingBinding;
import es.iesagora.cinexplora.model.TrackingMedia;
import es.iesagora.cinexplora.recyclerview.adapter.TrackingAdapter;
import es.iesagora.cinexplora.controller.viewmodel.TrackingViewmodel;
import es.iesagora.cinexplora.utils.TrackingFilter;

public class TrackingFragment extends Fragment {

    private static final int SORT_DATE_DESC   = 0;
    private static final int SORT_DATE_ASC    = 1;
    private static final int SORT_RATING_DESC = 2;
    private static final int SORT_RATING_ASC  = 3;

    private FragmentTrackingBinding binding;
    private TrackingViewmodel viewModel;
    private TrackingAdapter adapter;
    private TrackingFilter currentFilter = new TrackingFilter();

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        binding = FragmentTrackingBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        viewModel = new ViewModelProvider(requireActivity()).get(TrackingViewmodel.class);

        setupRecyclerView();
        setupHeader();
        observeTrackingList();

        binding.fabAddMedia.setOnClickListener(v ->
                Navigation.findNavController(v).navigate(R.id.addTrackingFragment));

        setupSwipeToDelete();
    }

    private void setupRecyclerView() {
        adapter = new TrackingAdapter(requireContext());
        binding.rvTracking.setAdapter(adapter);
        binding.rvTracking.setLayoutManager(new LinearLayoutManager(getContext()));
        adapter.setOnItemClickListener(item -> {
            Bundle bundle = new Bundle();
            bundle.putString("TITLE", item.getTitle());
            bundle.putString("TYPE", item.getType());
            Navigation.findNavController(requireView())
                    .navigate(R.id.action_followUpFragment_to_detailTrackingFragment, bundle);
        });
    }

    private void setupHeader() {
        binding.etSearch.addTextChangedListener(new android.text.TextWatcher() {
            @Override public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
            @Override public void onTextChanged(CharSequence s, int start, int before, int count) {}
            @Override
            public void afterTextChanged(android.text.Editable s) {
                currentFilter.setSearchQuery(s.toString().trim());
                applyCurrentFilters();
            }
        });

        binding.btnSort.setOnClickListener(v -> showSortMenu());
        binding.btnFilters.setOnClickListener(v -> showFiltersSheet());
    }

    private void showSortMenu() {
        PopupMenu popup = new PopupMenu(requireContext(), binding.btnSort);
        popup.getMenu().add(0, SORT_DATE_DESC,   0, getString(R.string.sort_newest));
        popup.getMenu().add(0, SORT_DATE_ASC,    1, getString(R.string.sort_oldest));
        popup.getMenu().add(0, SORT_RATING_DESC, 2, getString(R.string.sort_best_rated));
        popup.getMenu().add(0, SORT_RATING_ASC,  3, getString(R.string.sort_worst_rated));

        popup.setOnMenuItemClickListener(item -> {
            int id = item.getItemId();
            if (id == SORT_DATE_DESC) {
                currentFilter.setSortField("createdAt");
                currentFilter.setSortAscending(false);
            } else if (id == SORT_DATE_ASC) {
                currentFilter.setSortField("createdAt");
                currentFilter.setSortAscending(true);
            } else if (id == SORT_RATING_DESC) {
                currentFilter.setSortField("rating");
                currentFilter.setSortAscending(false);
            } else if (id == SORT_RATING_ASC) {
                currentFilter.setSortField("rating");
                currentFilter.setSortAscending(true);
            }
            applyCurrentFilters();
            return true;
        });
        popup.show();
    }

    private void showFiltersSheet() {
        TrackingFiltersBottomSheet sheet = new TrackingFiltersBottomSheet();
        sheet.setCurrentFilter(currentFilter);
        sheet.setOnApplyFiltersListener(filter -> {
            currentFilter = filter;
            String search = binding.etSearch.getText() != null
                    ? binding.etSearch.getText().toString().trim() : "";
            currentFilter.setSearchQuery(search);
            updateActiveFilterChips();
            applyCurrentFilters();
        });
        sheet.show(getChildFragmentManager(), "TrackingFilters");
    }

    private void applyCurrentFilters() {
        viewModel.applyFilter(currentFilter);
    }

    private void updateActiveFilterChips() {
        binding.chipGroupActiveFilters.removeAllViews();
        int count = 0;

        if (currentFilter.getDateFrom() != null || currentFilter.getDateTo() != null) {
            String from = currentFilter.getDateFrom() != null ? currentFilter.getDateFrom() : "…";
            String to = currentFilter.getDateTo() != null ? currentFilter.getDateTo() : "…";
            addActiveChip(getString(R.string.chip_date, from, to), () -> {
                currentFilter.setDateFrom(null);
                currentFilter.setDateTo(null);
                updateActiveFilterChips();
                applyCurrentFilters();
            });
            count++;
        }

        if (currentFilter.getRatingMin() != null && currentFilter.getRatingMin() > 0) {
            addActiveChip(getString(R.string.chip_rating,
                    String.valueOf(currentFilter.getRatingMin())), () -> {
                currentFilter.setRatingMin(null);
                updateActiveFilterChips();
                applyCurrentFilters();
            });
            count++;
        }

        if ("movie".equalsIgnoreCase(currentFilter.getMediaType())) {
            addActiveChip(getString(R.string.chip_type_movie), () -> {
                currentFilter.setMediaType("all");
                updateActiveFilterChips();
                applyCurrentFilters();
            });
            count++;
        } else if ("serie".equalsIgnoreCase(currentFilter.getMediaType())) {
            addActiveChip(getString(R.string.chip_type_serie), () -> {
                currentFilter.setMediaType("all");
                updateActiveFilterChips();
                applyCurrentFilters();
            });
            count++;
        }

        binding.scrollActiveFilters.setVisibility(count > 0 ? View.VISIBLE : View.GONE);
    }

    private void addActiveChip(String label, Runnable onRemove) {
        Chip chip = new Chip(requireContext());
        chip.setText(label);
        chip.setCloseIconVisible(true);
        chip.setCheckable(false);
        chip.setChipBackgroundColor(ColorStateList.valueOf(Color.TRANSPARENT));
        chip.setOnCloseIconClickListener(v -> onRemove.run());
        binding.chipGroupActiveFilters.addView(chip);
    }

    private void setupSwipeToDelete() {
        ItemTouchHelper.SimpleCallback callback = new ItemTouchHelper.SimpleCallback(
                0, ItemTouchHelper.LEFT | ItemTouchHelper.RIGHT) {
            @Override
            public boolean onMove(@NonNull RecyclerView recyclerView,
                                  @NonNull RecyclerView.ViewHolder viewHolder,
                                  @NonNull RecyclerView.ViewHolder target) {
                return false;
            }

            @Override
            public void onSwiped(@NonNull RecyclerView.ViewHolder viewHolder, int direction) {
                int position = viewHolder.getBindingAdapterPosition();
                if (position != RecyclerView.NO_POSITION) {
                    TrackingMedia mediaToDelete = adapter.getItemAt(position);
                    if (mediaToDelete != null) {
                        new MaterialAlertDialogBuilder(requireContext())
                                .setTitle(getString(R.string.dialog_delete_title))
                                .setMessage(getString(R.string.dialog_delete_message,
                                        mediaToDelete.getTitle()))
                                .setPositiveButton(getString(R.string.dialog_delete_confirm),
                                        (dialog, which) -> {
                                            viewModel.deleteTracking(mediaToDelete);
                                            Snackbar.make(binding.getRoot(),
                                                    getString(R.string.msg_deleted,
                                                            mediaToDelete.getTitle()),
                                                    Snackbar.LENGTH_LONG).show();
                                        })
                                .setNegativeButton(getString(R.string.dialog_cancel),
                                        (dialog, which) -> adapter.notifyItemChanged(position))
                                .setCancelable(false)
                                .show();
                    }
                }
            }
        };
        new ItemTouchHelper(callback).attachToRecyclerView(binding.rvTracking);
    }

    public void observeTrackingList() {
        viewModel.getWatchedList().observe(getViewLifecycleOwner(), resource -> {
            switch (resource.status) {
                case LOADING:
                    binding.rvTracking.setVisibility(View.GONE);
                    binding.layoutEmpty.setVisibility(View.GONE);
                    binding.tvNoResults.setVisibility(View.GONE);
                    break;

                case SUCCESS:
                    if (resource.data != null && !resource.data.isEmpty()) {
                        adapter.setTrackingList(resource.data);
                        binding.rvTracking.setVisibility(View.VISIBLE);
                        binding.layoutEmpty.setVisibility(View.GONE);
                        binding.tvNoResults.setVisibility(View.GONE);
                    } else {
                        binding.rvTracking.setVisibility(View.GONE);
                        if (currentFilter.hasActiveFilters()) {
                            binding.layoutEmpty.setVisibility(View.GONE);
                            binding.tvNoResults.setVisibility(View.VISIBLE);
                        } else {
                            binding.layoutEmpty.setVisibility(View.VISIBLE);
                            binding.tvNoResults.setVisibility(View.GONE);
                        }
                    }
                    break;

                case ERROR:
                    binding.rvTracking.setVisibility(View.GONE);
                    binding.layoutEmpty.setVisibility(View.VISIBLE);
                    binding.tvNoResults.setVisibility(View.GONE);
                    new MaterialAlertDialogBuilder(requireContext())
                            .setMessage(resource.message)
                            .setPositiveButton(getString(R.string.dialog_accept), null)
                            .show();
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
