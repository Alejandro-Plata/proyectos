package es.iesagora.cinexplora.recyclerview.adapter;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.bumptech.glide.load.resource.bitmap.CenterCrop;
import com.bumptech.glide.load.resource.bitmap.RoundedCorners;
import com.bumptech.glide.request.RequestOptions;

import java.util.ArrayList;
import java.util.List;

import es.iesagora.cinexplora.R;
import es.iesagora.cinexplora.model.request.PersonCredit;

public class FilmographyAdapter extends RecyclerView.Adapter<FilmographyAdapter.FilmographyViewHolder> {

    private List<PersonCredit> filmographyList;
    private final Context context;
    private OnItemClickListener listener;

    public FilmographyAdapter(Context context) {
        this.context = context;
        this.filmographyList = new ArrayList<>();
    }

    public interface OnItemClickListener {
        void onItemClick(PersonCredit credit);
    }

    public void setOnItemClickListener(OnItemClickListener listener) {
        this.listener = listener;
    }

    public void setFilmographyList(List<PersonCredit> list) {
        this.filmographyList = list;
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public FilmographyViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context)
                .inflate(R.layout.item_filmography, parent, false);
        return new FilmographyViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull FilmographyViewHolder holder, int position) {
        PersonCredit credit = filmographyList.get(position);
        holder.bind(credit);
        holder.itemView.setOnClickListener(v -> {
            if (listener != null) listener.onItemClick(credit);
        });
    }

    @Override
    public int getItemCount() {
        return filmographyList.size();
    }

    class FilmographyViewHolder extends RecyclerView.ViewHolder {
        private final ImageView imgPoster;
        private final TextView txtTitle;
        private final TextView txtYear;
        private final TextView txtType;
        private final TextView txtRole;

        FilmographyViewHolder(@NonNull View itemView) {
            super(itemView);
            imgPoster = itemView.findViewById(R.id.imgFilmographyPoster);
            txtTitle = itemView.findViewById(R.id.txtFilmographyTitle);
            txtYear = itemView.findViewById(R.id.txtFilmographyYear);
            txtType = itemView.findViewById(R.id.txtFilmographyType);
            txtRole = itemView.findViewById(R.id.txtFilmographyRole);
        }

        void bind(PersonCredit credit) {
            txtTitle.setText(credit.getDisplayTitle());

            String year = credit.getYear();
            txtYear.setText(year.isEmpty() ? "-" : year);

            String role = credit.getDisplayRole();
            if (!role.isEmpty()) {
                txtRole.setVisibility(View.VISIBLE);
                txtRole.setText(role);
            } else {
                txtRole.setVisibility(View.GONE);
            }

            if ("movie".equals(credit.getMediaType())) {
                txtType.setText("Movie");
                txtType.setBackgroundResource(R.drawable.bg_type_movie);
            } else {
                txtType.setText("Serie");
                txtType.setBackgroundResource(R.drawable.bg_type_serie);
            }

            if (credit.getPosterPath() != null && !credit.getPosterPath().isEmpty()) {
                String imgUrl = "https://image.tmdb.org/t/p/w185" + credit.getPosterPath();
                Glide.with(context)
                        .load(imgUrl)
                        .apply(new RequestOptions()
                                .transform(new CenterCrop(), new RoundedCorners(12)))
                        .placeholder(R.drawable.placeholder)
                        .into(imgPoster);
            } else {
                imgPoster.setImageResource(R.drawable.placeholder);
            }
        }
    }
}
