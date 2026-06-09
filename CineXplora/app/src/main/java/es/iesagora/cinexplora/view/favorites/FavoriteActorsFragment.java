package es.iesagora.cinexplora.view.favorites;

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

import es.iesagora.cinexplora.R;
import es.iesagora.cinexplora.controller.viewmodel.FavoriteActorsViewmodel;
import es.iesagora.cinexplora.databinding.FragmentFavoriteActorsBinding;
import es.iesagora.cinexplora.recyclerview.adapter.FavoriteActorsAdapter;

public class FavoriteActorsFragment extends Fragment {

    private FragmentFavoriteActorsBinding binding;
    private FavoriteActorsViewmodel viewModel;
    private FavoriteActorsAdapter adapter;

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
        observeFavorites();
    }

    private void setupRecyclerView() {
        adapter = new FavoriteActorsAdapter(requireContext());
        binding.rvFavoriteActors.setAdapter(adapter);
        binding.rvFavoriteActors.setLayoutManager(
                new GridLayoutManager(getContext(), 3));

        adapter.setOnItemClickListener(actor -> {
            Bundle bundle = new Bundle();
            bundle.putInt("PERSON_ID", actor.getPersonId());
            Navigation.findNavController(requireView())
                    .navigate(R.id.personDetailFragment, bundle);
        });
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
                        adapter.setActorList(resource.data);
                        binding.rvFavoriteActors.setVisibility(View.VISIBLE);
                        binding.layoutEmpty.setVisibility(View.GONE);
                    } else {
                        binding.rvFavoriteActors.setVisibility(View.GONE);
                        binding.layoutEmpty.setVisibility(View.VISIBLE);
                    }
                    break;

                case ERROR:
                    binding.rvFavoriteActors.setVisibility(View.GONE);
                    binding.layoutEmpty.setVisibility(View.VISIBLE);
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
