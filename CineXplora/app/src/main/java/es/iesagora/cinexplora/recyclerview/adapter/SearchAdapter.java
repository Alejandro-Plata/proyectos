package es.iesagora.cinexplora.recyclerview.adapter;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;

import java.util.ArrayList;
import java.util.List;

import es.iesagora.cinexplora.R;
import es.iesagora.cinexplora.databinding.ItemSearchResultBinding;
import es.iesagora.cinexplora.model.SearchItem;
import es.iesagora.cinexplora.model.request.Movie;
import es.iesagora.cinexplora.model.request.Serie;

public class SearchAdapter extends RecyclerView.Adapter<SearchAdapter.SearchViewHolder> {

    private List<SearchItem> searchList;
    private final LayoutInflater inflater;
    private OnItemClickListener listener;

    // Permite que, al hacer click en uno de los titulos, se cierre el adapter
    public interface OnItemClickListener {
        void onItemClick(SearchItem item);
    }

    public void setOnItemClickListener(OnItemClickListener listener) {
        this.listener = listener;
    }

    public SearchAdapter(Context context) {
        this.searchList = new ArrayList<>();
        this.inflater = LayoutInflater.from(context);
    }

    @NonNull
    @Override
    public SearchViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        // Inflamos el layout item_search_result
        View view = inflater.inflate(R.layout.item_search_result, parent, false);
        return new SearchViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull SearchViewHolder holder, int position) {
        SearchItem item = searchList.get(position);

        if (item == null || item.getType() == null) return;

        String titulo;
        String numTemp = "";
        String imgPath;

        if (item.getType().equalsIgnoreCase("serie")) {
            Serie serie = item.getSerie();
            titulo = serie.getNombre();
            imgPath = serie.getImgPoster();
            numTemp = serie.getNumeroTemporadas() == null ? "Información no disponible" : serie.getNumeroTemporadas() + " temporadas";
        } else {
            Movie movie = item.getMovie();
            titulo = movie.getTitle();
            imgPath = movie.getImgPoster();
        }

        holder.binding.txtTitleResult.setText(titulo);
        holder.binding.txtSubtitleResult.setText(numTemp);

        if (imgPath != null && !imgPath.isEmpty()) {
            String imgBaseUrl = "https://image.tmdb.org/t/p/w500" + imgPath;
            Glide.with(holder.itemView.getContext())
                    .load(imgBaseUrl)
                    .placeholder(R.drawable.placeholder)
                    .into(holder.binding.imgPosterResult);
        } else {
            holder.binding.imgPosterResult.setImageResource(R.drawable.placeholder);
        }

        holder.itemView.setOnClickListener(v -> {
            if (listener != null) {
                listener.onItemClick(item);
            }
        });
    }

    @Override
    public int getItemCount() {
        return searchList.size();
    }

    // Limpiamos la lista antes de una nueva búsqueda
    public void clear() {
        this.searchList.clear();
        notifyDataSetChanged();
    }

    public void setSearchList(List<SearchItem> searchList) {
        this.searchList = searchList;
        notifyDataSetChanged();
    }

    public static class SearchViewHolder extends RecyclerView.ViewHolder {
        private final ItemSearchResultBinding binding;

        public SearchViewHolder(@NonNull View itemView) {
            super(itemView);
            binding = ItemSearchResultBinding.bind(itemView);
        }
    }
}