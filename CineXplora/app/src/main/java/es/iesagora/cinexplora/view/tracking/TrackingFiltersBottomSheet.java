package es.iesagora.cinexplora.view.tracking;

import android.app.DatePickerDialog;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.RatingBar;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.google.android.material.bottomsheet.BottomSheetDialogFragment;
import com.google.android.material.button.MaterialButton;
import com.google.android.material.chip.ChipGroup;
import com.google.android.material.textfield.TextInputEditText;

import java.util.Calendar;

import es.iesagora.cinexplora.R;
import es.iesagora.cinexplora.utils.TrackingFilter;

public class TrackingFiltersBottomSheet extends BottomSheetDialogFragment {

    public interface OnApplyFiltersListener {
        void onFiltersApplied(TrackingFilter filter);
    }

    private OnApplyFiltersListener applyListener;
    private TrackingFilter currentFilter;

    public void setOnApplyFiltersListener(OnApplyFiltersListener listener) {
        this.applyListener = listener;
    }

    public void setCurrentFilter(TrackingFilter filter) {
        this.currentFilter = filter;
    }

    @Override
    public int getTheme() {
        return R.style.CineXplora_BottomSheet;
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.bottom_sheet_tracking_filters, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        TextInputEditText etDateFrom = view.findViewById(R.id.etDateFrom);
        TextInputEditText etDateTo = view.findViewById(R.id.etDateTo);
        RatingBar ratingBarMin = view.findViewById(R.id.ratingBarMin);
        TextView tvRatingValue = view.findViewById(R.id.tvRatingValue);
        ChipGroup chipGroupType = view.findViewById(R.id.chipGroupType);
        MaterialButton btnApply = view.findViewById(R.id.btnApplySheet);
        MaterialButton btnClear = view.findViewById(R.id.btnClearSheet);

        // Populate with current filter state
        if (currentFilter != null) {
            if (currentFilter.getDateFrom() != null) etDateFrom.setText(currentFilter.getDateFrom());
            if (currentFilter.getDateTo() != null) etDateTo.setText(currentFilter.getDateTo());
            if (currentFilter.getRatingMin() != null) {
                ratingBarMin.setRating(currentFilter.getRatingMin());
                tvRatingValue.setText(String.valueOf(currentFilter.getRatingMin()));
            }
            if ("movie".equalsIgnoreCase(currentFilter.getMediaType())) {
                chipGroupType.check(R.id.chipMovie);
            } else if ("serie".equalsIgnoreCase(currentFilter.getMediaType())) {
                chipGroupType.check(R.id.chipSerie);
            } else {
                chipGroupType.check(R.id.chipAll);
            }
        }

        // Rating bar listener
        ratingBarMin.setOnRatingBarChangeListener((bar, rating, fromUser) ->
                tvRatingValue.setText(rating > 0 ? String.valueOf(rating) : "0.0"));

        // Date picker listeners
        etDateFrom.setOnClickListener(v -> showDatePicker(etDateFrom));
        etDateTo.setOnClickListener(v -> showDatePicker(etDateTo));

        // Clear all
        btnClear.setOnClickListener(v -> {
            etDateFrom.setText("");
            etDateTo.setText("");
            ratingBarMin.setRating(0);
            tvRatingValue.setText("0.0");
            chipGroupType.check(R.id.chipAll);
        });

        // Apply
        btnApply.setOnClickListener(v -> {
            TrackingFilter filter = new TrackingFilter();

            // Preserve sort and search from the current filter
            if (currentFilter != null) {
                filter.setSortField(currentFilter.getSortField());
                filter.setSortAscending(currentFilter.isSortAscending());
                if (currentFilter.getSearchQuery() != null) {
                    filter.setSearchQuery(currentFilter.getSearchQuery());
                }
            }

            String dateFrom = etDateFrom.getText() != null ? etDateFrom.getText().toString().trim() : "";
            if (!dateFrom.isEmpty()) filter.setDateFrom(dateFrom);

            String dateTo = etDateTo.getText() != null ? etDateTo.getText().toString().trim() : "";
            if (!dateTo.isEmpty()) filter.setDateTo(dateTo);

            float rating = ratingBarMin.getRating();
            if (rating > 0) filter.setRatingMin(rating);

            int checkedChip = chipGroupType.getCheckedChipId();
            if (checkedChip == R.id.chipMovie) {
                filter.setMediaType("movie");
            } else if (checkedChip == R.id.chipSerie) {
                filter.setMediaType("serie");
            } else {
                filter.setMediaType("all");
            }

            if (applyListener != null) applyListener.onFiltersApplied(filter);
            dismiss();
        });
    }

    private void showDatePicker(TextInputEditText target) {
        Calendar c = Calendar.getInstance();
        new DatePickerDialog(requireContext(),
                (view, year, month, day) ->
                        target.setText(day + "/" + (month + 1) + "/" + year),
                c.get(Calendar.YEAR),
                c.get(Calendar.MONTH),
                c.get(Calendar.DAY_OF_MONTH)).show();
    }
}
