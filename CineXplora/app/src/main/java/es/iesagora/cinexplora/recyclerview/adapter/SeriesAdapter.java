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

import java.util.ArrayList;
import java.util.List;

import es.iesagora.cinexplora.R;
import es.iesagora.cinexplora.databinding.ViewholderResourceBinding;
import es.iesagora.cinexplora.model.request.Movie;
import es.iesagora.cinexplora.model.request.Serie;

public class SeriesAdapter extends RecyclerView.Adapter<SeriesAdapter.SeriesViewHolder> {

    private List<Serie> listaSeries;
    private final LayoutInflater inflater;

    private SeriesAdapter.OnSerieAddListener addListener;

    public interface OnSerieAddListener {
        void onAddClick(Serie serie);
    }

    // Método para asignar el listener desde el fragmento
    public void setOnSerieAddListener(SeriesAdapter.OnSerieAddListener listener) {
        this.addListener = listener;
    }

    public SeriesAdapter(Context context) {
        this.listaSeries = new ArrayList<>();
        this.inflater = LayoutInflater.from(context);
    }

    @NonNull
    @Override
    public SeriesViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {

        View view = inflater.inflate(R.layout.viewholder_resource, parent, false);
        return new SeriesViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull SeriesViewHolder holder, int position) {
        Serie serie = listaSeries.get(position);

        String imgBaseUrl = "https://image.tmdb.org/t/p/w500" + serie.getImgPoster();

        holder.binding.txtTitle.setText(serie.getNombre());
        holder.binding.txtDescription.setText(serie.getDescripcion());

        if (serie.getRating() > 0) {
            holder.binding.txtRating.setText(String.format("%.1f", serie.getRating()));
        } else {
            holder.binding.txtRating.setText("-");
        }

        Glide.with(holder.itemView.getContext())
                .load(imgBaseUrl)
                .placeholder(R.drawable.gradient_overlay)
                .into(holder.binding.imgResource);

        holder.itemView.setOnClickListener(v -> {
            Bundle bundle = new Bundle();

            bundle.putInt("SERIE_ID", serie.getId());
            Navigation.findNavController(v).navigate(R.id.seriesDetailFragment, bundle);
        });

        holder.binding.btnAddWatchlist.setOnClickListener(v -> {
            if (addListener != null) {
                addListener.onAddClick(serie);
            }
        });
    }

    @Override
    public int getItemCount() {
        return listaSeries.size();
    }

    public void setSerieList(List<Serie> listaSeries) {
        this.listaSeries = listaSeries;
        notifyDataSetChanged();
    }

    public void addSerieList(List<Serie> nuevasSeries) {
        this.listaSeries.addAll(nuevasSeries);
        notifyDataSetChanged();
    }

    public static class SeriesViewHolder extends RecyclerView.ViewHolder {
        private final ViewholderResourceBinding binding;

        public SeriesViewHolder(@NonNull View itemView) {
            super(itemView);

            binding = ViewholderResourceBinding.bind(itemView);

        }
    }

}

