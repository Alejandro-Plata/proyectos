package es.iesagora.cinexplora.view.details;

import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.bumptech.glide.Glide;
import com.bumptech.glide.load.resource.bitmap.CenterCrop;
import com.bumptech.glide.load.resource.bitmap.RoundedCorners;
import com.bumptech.glide.request.RequestOptions;

import es.iesagora.cinexplora.R;
import es.iesagora.cinexplora.databinding.FragmentDetailTrackingBinding;
import es.iesagora.cinexplora.controller.viewmodel.TrackingViewmodel;
import es.iesagora.cinexplora.model.TrackingMedia;
import es.iesagora.cinexplora.model.states.Resource;

public class DetailTrackingFragment extends Fragment {

    private FragmentDetailTrackingBinding binding;
    private TrackingViewmodel viewModel;

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        binding = FragmentDetailTrackingBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        if (getArguments() != null) {
            String titulo = getArguments().getString("TITLE");
            String tipo = getArguments().getString("TYPE");

            if (titulo != null) {
                loadMediaDetails(titulo, tipo);
            }
        }

    }

    private void loadMediaDetails(String title, String type) {
        viewModel = new ViewModelProvider(this).get(TrackingViewmodel.class);
        viewModel.loadTrackingItem(title, type);
        viewModel.trackingItem.observe(getViewLifecycleOwner(), resource -> {
            if (resource.status == Resource.Status.SUCCESS && resource.data != null) {
                TrackingMedia item = resource.data;
                binding.txtTitleDetail.setText(item.getTitle());
                if ("MOVIE".equalsIgnoreCase(item.getType())) {
                    binding.txtTypeDetail.setText(getString(R.string.type_movie));
                    binding.txtTypeDetail.setBackgroundResource(R.drawable.bg_type_movie);
                } else {
                    binding.txtTypeDetail.setText(getString(R.string.type_tv_show));
                    binding.txtTypeDetail.setBackgroundResource(R.drawable.bg_type_serie);
                }
                binding.ratingBarDetail.setRating(item.getRating());
                binding.txtCommentDetail.setText(item.getUserComment());
                RequestOptions requestOptions = new RequestOptions()
                        .transform(new CenterCrop(), new RoundedCorners(24));
                if (item.getPhotoUrl() != null & !item.getPhotoUrl().isEmpty()) {
                    Glide.with(this)
                            .load(item.getPhotoUrl())
                            .apply(requestOptions)
                            .placeholder(R.drawable.placeholder)
                            .into(binding.imgPosterDetail);
                } else {
                    binding.imgPosterDetail.setImageResource(R.drawable.placeholder);
                }
            }
        });
    }

}


