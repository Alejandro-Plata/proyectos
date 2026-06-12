package es.iesagora.cinexplora.view.explore;

import android.os.Bundle;
import android.view.ContextThemeWrapper;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.google.android.material.bottomsheet.BottomSheetDialogFragment;
import com.google.android.material.chip.Chip;
import com.google.android.material.chip.ChipGroup;

import java.util.List;

import es.iesagora.cinexplora.R;
import es.iesagora.cinexplora.model.request.Genre;

public class ExploreGenreBottomSheet extends BottomSheetDialogFragment {

    public interface OnGenreSelectedListener {
        void onGenreSelected(Integer genreId, String genreName);
    }

    private List<Genre> genres;
    private Integer currentGenreId;
    private OnGenreSelectedListener listener;

    public static ExploreGenreBottomSheet newInstance(List<Genre> genres, Integer currentGenreId) {
        ExploreGenreBottomSheet sheet = new ExploreGenreBottomSheet();
        sheet.genres = genres;
        sheet.currentGenreId = currentGenreId;
        return sheet;
    }

    public void setOnGenreSelectedListener(OnGenreSelectedListener listener) {
        this.listener = listener;
    }

    @Override
    public int getTheme() {
        return R.style.CineXplora_BottomSheet;
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.bottom_sheet_genre_filter, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        ChipGroup chipGroup = view.findViewById(R.id.chipGroupSheet);

        // Chip "Todos"
        Chip chipAll = buildChip(getString(R.string.label_all_genres), null);
        chipAll.setChecked(currentGenreId == null);
        chipGroup.addView(chipAll);

        // Chip por género
        if (genres != null) {
            for (Genre genre : genres) {
                Chip chip = buildChip(genre.getName(), genre.getId());
                chip.setChecked(currentGenreId != null && currentGenreId == genre.getId());
                chipGroup.addView(chip);
            }
        }

        view.findViewById(R.id.btnClearGenre).setOnClickListener(v -> {
            if (listener != null) {
                listener.onGenreSelected(null, getString(R.string.label_all_genres));
            }
            dismiss();
        });

        view.findViewById(R.id.btnApplyGenre).setOnClickListener(v -> {
            int checkedId = chipGroup.getCheckedChipId();
            if (checkedId == View.NO_ID) {
                if (listener != null) {
                    listener.onGenreSelected(null, getString(R.string.label_all_genres));
                }
            } else {
                Chip checked = chipGroup.findViewById(checkedId);
                if (checked != null) {
                    Integer tag = (Integer) checked.getTag();
                    String name = checked.getText().toString();
                    if (listener != null) {
                        listener.onGenreSelected(tag, name);
                    }
                }
            }
            dismiss();
        });
    }

    private Chip buildChip(String text, Integer genreId) {
        Chip chip = new Chip(new ContextThemeWrapper(requireContext(),
                com.google.android.material.R.style.Widget_Material3_Chip_Filter));
        chip.setText(text);
        chip.setCheckable(true);
        chip.setCheckedIconVisible(false);
        chip.setTag(genreId);
        return chip;
    }
}
