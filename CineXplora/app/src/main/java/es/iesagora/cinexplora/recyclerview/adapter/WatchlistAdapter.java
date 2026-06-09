package es.iesagora.cinexplora.recyclerview.adapter;

import android.content.Context;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.navigation.Navigation;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.bumptech.glide.load.resource.bitmap.CenterCrop;
import com.bumptech.glide.load.resource.bitmap.RoundedCorners;
import com.bumptech.glide.request.RequestOptions;

import java.util.ArrayList;
import java.util.List;

import es.iesagora.cinexplora.R;
import es.iesagora.cinexplora.databinding.ItemWatchlistBinding;
import es.iesagora.cinexplora.model.PendingMedia;

public class WatchlistAdapter extends RecyclerView.Adapter<WatchlistAdapter.WatchlistViewHolder> {

    private List<PendingMedia> watchlistItems;
    private final LayoutInflater inflater;
    private final Context context;

    public WatchlistAdapter(Context context) {
        this.context = context;
        this.watchlistItems = new ArrayList<>();
        this.inflater = LayoutInflater.from(context);
    }

    @NonNull
    @Override
    public WatchlistViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = inflater.inflate(R.layout.item_watchlist, parent, false);
        return new WatchlistViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull WatchlistViewHolder holder, int position) {
        PendingMedia item = watchlistItems.get(position);
        String imgBaseUrl = "https://image.tmdb.org/t/p/w500" + item.getPosterPath();

        holder.binding.txtTitle.setText(item.getTitle());

        Glide.with(context)
                .load(imgBaseUrl)
                .apply(new RequestOptions().transform(new CenterCrop(), new RoundedCorners(24)))
                .placeholder(R.drawable.placeholder)
                .into(holder.binding.imgPoster);

        holder.itemView.setOnClickListener(v -> {
            Bundle bundle = new Bundle();
            // Dependiendo del tipo, mandamos a un fragmento u otro
            if ("serie".equals(item.getType())) {
                bundle.putInt("SERIE_ID", item.getTmdbId());
                Navigation.findNavController(v).navigate(R.id.seriesDetailFragment, bundle);
            } else {
                bundle.putInt("MOVIE_ID", item.getTmdbId());
                Navigation.findNavController(v).navigate(R.id.moviesDetailFragment, bundle);
            }
        });
    }

    @Override
    public int getItemCount() {
        return watchlistItems.size();
    }

    public void setWatchlist(List<PendingMedia> items) {
        this.watchlistItems = items;
        notifyDataSetChanged();
    }

    public static class WatchlistViewHolder extends RecyclerView.ViewHolder {
        private final ItemWatchlistBinding binding;

        public WatchlistViewHolder(@NonNull View itemView) {
            super(itemView);
            binding = ItemWatchlistBinding.bind(itemView);
        }
    }

    public PendingMedia getItemAt(int position) {
        return watchlistItems.get(position);
    }

    public void removeItem(int position) {
        watchlistItems.remove(position);
        notifyItemRemoved(position);
    }
}