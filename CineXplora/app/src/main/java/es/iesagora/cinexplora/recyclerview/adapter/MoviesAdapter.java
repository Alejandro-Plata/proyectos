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

public class MoviesAdapter extends RecyclerView.Adapter<MoviesAdapter.MoviesViewHolder> {

    private List<Movie> listaPeliculas;
    private final LayoutInflater inflater;
    private OnMovieAddListener addListener;

    public interface OnMovieAddListener {
        void onAddClick(Movie movie);
    }

    // Método para asignar el listener desde el fragmento
    public void setOnMovieAddListener(OnMovieAddListener listener) {
        this.addListener = listener;
    }

    public MoviesAdapter(Context context) {
        this.listaPeliculas = new ArrayList<>();
        this.inflater = LayoutInflater.from(context);
    }

    @NonNull
    @Override
    public MoviesViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {

        View view = inflater.inflate(R.layout.viewholder_resource, parent, false);
        return new MoviesViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull MoviesViewHolder holder, int position) {
        Movie pelicula = listaPeliculas.get(position);

        String imgBaseUrl = "https://image.tmdb.org/t/p/w500" + pelicula.getImgPoster();

        holder.binding.txtTitle.setText(pelicula.getTitle());
        holder.binding.txtDescription.setText(pelicula.getDescripcion());

        if (pelicula.getRating() > 0) {
            holder.binding.txtRating.setText(String.format("%.1f", pelicula.getRating()));
        } else {
            holder.binding.txtRating.setText("-");
        }

        Glide.with(holder.itemView.getContext())
                .load(imgBaseUrl)
                .placeholder(R.drawable.gradient_overlay)
                .error(R.drawable.gradient_overlay)
                .into(holder.binding.imgResource);

        holder.itemView.setOnClickListener(v -> {
            Bundle bundle = new Bundle();
            bundle.putInt("MOVIE_ID", pelicula.getId());
            Navigation.findNavController(v).navigate(R.id.moviesDetailFragment, bundle);
        });

        holder.binding.btnAddWatchlist.setOnClickListener(v -> {
            if (addListener != null) {
                addListener.onAddClick(pelicula);
            }
        });
    }

    @Override
    public int getItemCount() {
        return listaPeliculas.size();
    }
    public void setMovieList(List<Movie> listaPeliculas) {
        this.listaPeliculas = listaPeliculas;
        notifyDataSetChanged();
    }
    public void addMovieList(List<Movie> nuevasPeliculas) {
        int positionStart = listaPeliculas.size();

        this.listaPeliculas.addAll(nuevasPeliculas);

        notifyDataSetChanged();
    }

    public static class MoviesViewHolder extends RecyclerView.ViewHolder {
        private final ViewholderResourceBinding binding;

        public MoviesViewHolder(@NonNull View itemView) {
            super(itemView);

            binding = ViewholderResourceBinding.bind(itemView);

        }
    }

}




