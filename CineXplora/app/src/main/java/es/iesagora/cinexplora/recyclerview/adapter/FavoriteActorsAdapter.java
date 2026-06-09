package es.iesagora.cinexplora.recyclerview.adapter;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.bumptech.glide.load.resource.bitmap.CircleCrop;
import com.bumptech.glide.request.RequestOptions;
import com.google.android.material.imageview.ShapeableImageView;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import es.iesagora.cinexplora.R;
import es.iesagora.cinexplora.model.FavoriteActor;

public class FavoriteActorsAdapter extends RecyclerView.Adapter<FavoriteActorsAdapter.FavoriteActorViewHolder> {

    private List<FavoriteActor> actorList;
    private final Context context;
    private OnItemClickListener listener;

    public FavoriteActorsAdapter(Context context) {
        this.context = context;
        this.actorList = new ArrayList<>();
    }

    public interface OnItemClickListener {
        void onItemClick(FavoriteActor actor);
    }

    public void setOnItemClickListener(OnItemClickListener listener) {
        this.listener = listener;
    }

    public void setActorList(List<FavoriteActor> list) {
        this.actorList = list;
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public FavoriteActorViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context)
                .inflate(R.layout.item_favorite_actor, parent, false);
        return new FavoriteActorViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull FavoriteActorViewHolder holder, int position) {
        FavoriteActor actor = actorList.get(position);
        holder.bind(actor);
        holder.itemView.setOnClickListener(v -> {
            if (listener != null) listener.onItemClick(actor);
        });
    }

    @Override
    public int getItemCount() {
        return actorList.size();
    }

    class FavoriteActorViewHolder extends RecyclerView.ViewHolder {
        private final ShapeableImageView imgPhoto;
        private final TextView txtName;
        private final TextView txtDate;

        FavoriteActorViewHolder(@NonNull View itemView) {
            super(itemView);
            imgPhoto = itemView.findViewById(R.id.imgFavoriteActorPhoto);
            txtName = itemView.findViewById(R.id.txtFavoriteActorName);
            txtDate = itemView.findViewById(R.id.txtFavoriteActorDate);
        }

        void bind(FavoriteActor actor) {
            txtName.setText(actor.getName());

            SimpleDateFormat sdf = new SimpleDateFormat("d/M/yyyy", Locale.getDefault());
            txtDate.setText(sdf.format(new Date(actor.getAddedAt())));

            if (actor.getProfilePath() != null && !actor.getProfilePath().isEmpty()) {
                String imgUrl = "https://image.tmdb.org/t/p/w185" + actor.getProfilePath();
                Glide.with(context)
                        .load(imgUrl)
                        .apply(new RequestOptions().transform(new CircleCrop()))
                        .placeholder(R.drawable.ic_default_avatar)
                        .into(imgPhoto);
            } else {
                imgPhoto.setImageResource(R.drawable.ic_default_avatar);
            }
        }
    }
}
