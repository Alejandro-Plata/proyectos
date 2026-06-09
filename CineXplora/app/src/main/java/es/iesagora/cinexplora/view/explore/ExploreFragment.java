package es.iesagora.cinexplora.view.explore;

import android.os.Bundle;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.viewpager2.adapter.FragmentStateAdapter;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.google.android.material.tabs.TabLayoutMediator;

import es.iesagora.cinexplora.databinding.FragmentExploreBinding;

public class ExploreFragment extends Fragment {

    private FragmentExploreBinding binding;
    private String screenType;

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        if (getArguments() != null) {
            screenType = getArguments().getString("screen_type");
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        binding = FragmentExploreBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        setupAdapterViewPager();
        tablayoutBindViewPager();
        binding.viewPager.setOffscreenPageLimit(1); // Mantiene ambos fragmentos (Movies y Series) cargados en memoria
    }

    private void setupAdapterViewPager() {
        binding.viewPager.setAdapter(new FragmentStateAdapter(this) {
            @NonNull
            @Override
            public Fragment createFragment(int position) {
                // Pasamos el screenType (explore o watchlist) a los fragmentos hijos
                switch (position) {
                    case 0:
                        return MoviesFragment.newInstance(screenType);
                    case 1:
                        return SeriesFragment.newInstance(screenType);
                    default:
                        return MoviesFragment.newInstance(screenType);
                }
            }

            @Override
            public int getItemCount() {
                return 2;
            }
        });
    }

    private void tablayoutBindViewPager() {
        new TabLayoutMediator(binding.tabLayout, binding.viewPager, (tab, position) -> {
            if (position == 0) tab.setText("Películas");
            else tab.setText("Series");
        }).attach();
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}