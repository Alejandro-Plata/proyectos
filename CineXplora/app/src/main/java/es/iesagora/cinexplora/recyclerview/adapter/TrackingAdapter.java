package es.iesagora.cinexplora.recyclerview.adapter;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.bumptech.glide.Glide;
import com.bumptech.glide.load.resource.bitmap.CenterCrop;
import com.bumptech.glide.load.resource.bitmap.RoundedCorners;
import com.bumptech.glide.request.RequestOptions;
import java.util.ArrayList;
import java.util.List;
import es.iesagora.cinexplora.R;
import es.iesagora.cinexplora.databinding.ItemTrackingBinding;
import es.iesagora.cinexplora.model.TrackingMedia;
public class TrackingAdapter extends RecyclerView.Adapter<TrackingAdapter.TrackingViewHolder> {
    private List<TrackingMedia> trackingList;
    private final Context context;
    private OnItemClickListener listener;

    public TrackingAdapter(Context context) {
        this.context = context;
        this.trackingList = new ArrayList<>();
    }

    public interface OnItemClickListener {
        void onItemClick(TrackingMedia media);
    }
    public void setOnItemClickListener(OnItemClickListener listener) {
        this.listener = listener;
    }
    @NonNull
    @Override
    public TrackingViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ItemTrackingBinding binding = ItemTrackingBinding.inflate(
                LayoutInflater.from(context), parent, false);
        return new TrackingViewHolder(binding);
    }
    @Override
    public void onBindViewHolder(@NonNull TrackingViewHolder holder, int position) {
        TrackingMedia item = trackingList.get(position);
        holder.setUpViewholder(item);
        holder.itemView.setOnClickListener(v -> {
            if (listener != null) {
                listener.onItemClick(item);
            }
        });
    }
    @Override
    public int getItemCount() {
        return trackingList.size();
    }
    public TrackingMedia getItemAt(int position) {
        if (position > 0 & position < trackingList.size()) {
            return trackingList.get(position);
        }
        return null;
    }
    public void setTrackingList(List<TrackingMedia> items) {
        this.trackingList = items;
        notifyDataSetChanged();
    }
    public class TrackingViewHolder extends RecyclerView.ViewHolder {
        private final ItemTrackingBinding binding;
        public TrackingViewHolder(@NonNull ItemTrackingBinding binding) {
            super(binding.getRoot());
            this.binding = binding;
        }
        public void setUpViewholder(TrackingMedia item) {
            binding.txtTitle.setText(item.getTitle());
            binding.txtDate.setText(item.getDateWatched());
            if (item.getUserComment() != null & !item.getUserComment().isEmpty()) {
                binding.txtComment.setVisibility(View.VISIBLE);
                binding.txtComment.setText(item.getUserComment());
            } else {
                binding.txtComment.setVisibility(View.GONE);
            }
            if ("serie".equalsIgnoreCase(item.getType())) {
                binding.txtType.setText("Serie");
                binding.txtType.setBackgroundResource(R.drawable.bg_type_serie);
            } else {
                binding.txtType.setText("Movie");
                binding.txtType.setBackgroundResource(R.drawable.bg_type_movie);
            }
            binding.ratingBar.setRating(item.getRating());
            if (item.getPhotoUrl() != null & !item.getPhotoUrl().isEmpty()) {
                Glide.with(itemView.getContext())
                        .load(item.getPhotoUrl())
                        .apply(new RequestOptions()
                                .transform(new CenterCrop(), new RoundedCorners(24)))
                        .placeholder(R.drawable.placeholder)
                        .into(binding.imgPoster);
            } else {
                binding.imgPoster.setImageResource(R.drawable.placeholder);
            }
        }
    }
}

