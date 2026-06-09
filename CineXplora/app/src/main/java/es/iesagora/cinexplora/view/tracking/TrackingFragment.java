package es.iesagora.cinexplora.view.tracking;

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
import androidx.recyclerview.widget.ItemTouchHelper;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.google.android.material.snackbar.Snackbar;
import es.iesagora.cinexplora.R;
import es.iesagora.cinexplora.databinding.FragmentTrackingBinding;
import es.iesagora.cinexplora.model.TrackingMedia;
import es.iesagora.cinexplora.recyclerview.adapter.TrackingAdapter;
import es.iesagora.cinexplora.controller.viewmodel.TrackingViewmodel;
import es.iesagora.cinexplora.utils.TrackingFilter;

public class TrackingFragment extends Fragment {
    private FragmentTrackingBinding binding;
    private TrackingViewmodel viewModel;
    private TrackingAdapter adapter;
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        binding = FragmentTrackingBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        viewModel = new ViewModelProvider(requireActivity()).get(TrackingViewmodel.class);

        setupRecyclerView();
        setupFilters();

        observeTrackingList();
        binding.fabAddMedia.setOnClickListener(v -> {
            Navigation.findNavController(v).navigate(R.id.addTrackingFragment);
        });

        eliminarItem();

    }
    public void setupRecyclerView() {
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
    public void eliminarItem() {
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
                        new AlertDialog.Builder(requireContext())
                                .setTitle(getString(R.string.dialog_delete_title))
                                .setMessage(getString(R.string.dialog_delete_message,
                                        mediaToDelete.getTitle()))
                                .setPositiveButton(getString(R.string.dialog_delete_confirm), (dialog, which) -> {
                                    viewModel.deleteTracking(mediaToDelete);
                                    Snackbar.make(binding.getRoot(),
                                            getString(R.string.msg_deleted, mediaToDelete.getTitle()),
                                            Snackbar.LENGTH_LONG).show();
                                })
                                .setNegativeButton(getString(R.string.dialog_cancel), (dialog, which) -> {
                                    adapter.notifyItemChanged(position);
                                })
                                .setCancelable(false)
                                .show();
                    }
                }
            }
        };
        new ItemTouchHelper(callback).attachToRecyclerView(binding.rvTracking);
    }

    private void setupFilters() {
        binding.etSearch.addTextChangedListener(new android.text.TextWatcher() {
            @Override public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
            @Override public void onTextChanged(CharSequence s, int start, int before, int count) {}
            @Override
            public void afterTextChanged(android.text.Editable s) {
                applyCurrentFilters();
            }
        });

        binding.toggleSort.addOnButtonCheckedListener((group, checkedId, isChecked) -> {
            if (isChecked) {
                applyCurrentFilters();
            }
        });

        binding.btnAdvancedFilters.setOnClickListener(v -> {
            boolean visible = binding.layoutAdvancedFilters.getVisibility() == View.VISIBLE;
            binding.layoutAdvancedFilters.setVisibility(visible ? View.GONE : View.VISIBLE);
        });

        binding.etDateFrom.setOnClickListener(v -> showFilterDatePicker(binding.etDateFrom));
        binding.etDateTo.setOnClickListener(v -> showFilterDatePicker(binding.etDateTo));

        binding.btnApplyFilters.setOnClickListener(v -> {
            if (validateFilters()) {
                applyCurrentFilters();
            }
        });

        binding.btnClearFilters.setOnClickListener(v -> {
            binding.etSearch.setText("");
            binding.etDateFrom.setText("");
            binding.etDateTo.setText("");
            binding.ratingBarMin.setRating(0);
            binding.ratingBarMax.setRating(0);
            binding.tilDateFrom.setError(null);
            binding.tilDateTo.setError(null);
            binding.toggleSort.check(R.id.btnSortDateDesc);
            applyCurrentFilters();
        });
    }

    private boolean validateFilters() {
        boolean valid = true;

        float ratingMin = binding.ratingBarMin.getRating();
        float ratingMax = binding.ratingBarMax.getRating();

        binding.tilDateFrom.setError(null);
        binding.tilDateTo.setError(null);

        if (ratingMin > 0 && ratingMax > 0 && ratingMin > ratingMax) {
            valid = false;
        }

        String dateFrom = binding.etDateFrom.getText().toString().trim();
        String dateTo = binding.etDateTo.getText().toString().trim();

        if (!dateFrom.isEmpty() && !dateTo.isEmpty()) {
            try {
                java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("d/M/yyyy");
                java.util.Date from = sdf.parse(dateFrom);
                java.util.Date to = sdf.parse(dateTo);
                if (from.after(to)) {
                    binding.tilDateFrom.setError(
                            getString(R.string.error_date_from_after_to));
                    valid = false;
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        if (!valid) {
            new AlertDialog.Builder(requireContext())
                    .setTitle(getString(R.string.title_validation_error))
                    .setMessage(getString(R.string.msg_fix_filter_errors))
                    .setPositiveButton(getString(R.string.dialog_accept), null)
                    .show();
        }

        return valid;
    }

    private void applyCurrentFilters() {
        TrackingFilter filter = new TrackingFilter();

        String search = binding.etSearch.getText().toString().trim();
        if (!search.isEmpty()) {
            filter.setSearchQuery(search);
        }

        // Ordenacion
        int checkedSort = binding.toggleSort.getCheckedButtonId();
        if (checkedSort == R.id.btnSortDateDesc) {
            filter.setSortField("createdAt");
            filter.setSortAscending(false);
        } else if (checkedSort == R.id.btnSortDateAsc) {
            filter.setSortField("createdAt");
            filter.setSortAscending(true);
        } else if (checkedSort == R.id.btnSortRatingDesc) {
            filter.setSortField("rating");
            filter.setSortAscending(false);
        } else if (checkedSort == R.id.btnSortRatingAsc) {
            filter.setSortField("rating");
            filter.setSortAscending(true);
        }

        String dateFrom = binding.etDateFrom.getText().toString().trim();
        if (!dateFrom.isEmpty()) {
            filter.setDateFrom(dateFrom);
        }

        String dateTo = binding.etDateTo.getText().toString().trim();
        if (!dateTo.isEmpty()) {
            filter.setDateTo(dateTo);
        }

        float ratingMin = binding.ratingBarMin.getRating();
        if (ratingMin > 0) filter.setRatingMin(ratingMin);

        float ratingMax = binding.ratingBarMax.getRating();
        if (ratingMax > 0) filter.setRatingMax(ratingMax);

        viewModel.applyFilter(filter);
    }

    private void showFilterDatePicker(
            com.google.android.material.textfield.TextInputEditText target) {
        final java.util.Calendar c = java.util.Calendar.getInstance();
        new android.app.DatePickerDialog(requireContext(),
                (view, year, month, day) -> {
                    target.setText(day + "/" + (month + 1) + "/" + year);
                },
                c.get(java.util.Calendar.YEAR),
                c.get(java.util.Calendar.MONTH),
                c.get(java.util.Calendar.DAY_OF_MONTH)).show();
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
                        String search = binding.etSearch.getText().toString().trim();
                        boolean hasFilters = !search.isEmpty()
                                             || !binding.etDateFrom.getText().toString().isEmpty()
                                             || !binding.etDateTo.getText().toString().isEmpty()
                                             || binding.ratingBarMin.getRating() > 0
                                             || binding.ratingBarMax.getRating() > 0;

                        if (hasFilters) {
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
                    new AlertDialog.Builder(requireContext())
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

