package es.iesagora.cinexplora.recyclerview.adapter;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import java.util.Locale;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.google.android.material.imageview.ShapeableImageView;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import es.iesagora.cinexplora.R;
import es.iesagora.cinexplora.model.FavoriteActor;

public class FavoriteActorsAdapter extends RecyclerView.Adapter<FavoriteActorsAdapter.FavoriteActorViewHolder> {

    private List<FavoriteActor> actorList = new ArrayList<>();
    private final Context context;
    private OnItemClickListener listener;
    private OnItemLongClickListener longClickListener;
    private Set<Integer> birthdayPersonIds = new HashSet<>();

    public FavoriteActorsAdapter(Context context) {
        this.context = context;
    }

    public interface OnItemClickListener {
        void onItemClick(FavoriteActor actor);
    }

    public interface OnItemLongClickListener {
        void onItemLongClick(FavoriteActor actor, View view);
    }

    public void setOnItemClickListener(OnItemClickListener listener) {
        this.listener = listener;
    }

    public void setOnItemLongClickListener(OnItemLongClickListener listener) {
        this.longClickListener = listener;
    }

    public void setActorList(List<FavoriteActor> list) {
        this.actorList = new ArrayList<>(list);
        notifyDataSetChanged();
    }

    public void setBirthdayPersonIds(Set<Integer> ids) {
        this.birthdayPersonIds = ids;
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
        holder.bind(actor, birthdayPersonIds.contains(actor.getPersonId()));
        holder.itemView.setOnClickListener(v -> {
            if (listener != null) listener.onItemClick(actor);
        });
        holder.itemView.setOnLongClickListener(v -> {
            if (longClickListener != null) {
                longClickListener.onItemLongClick(actor, v);
                return true;
            }
            return false;
        });
    }

    @Override
    public int getItemCount() {
        return actorList.size();
    }

    private String translateDept(String dept) {
        int res;
        switch (dept.toLowerCase(Locale.ROOT)) {
            case "acting":          res = R.string.dept_acting; break;
            case "directing":       res = R.string.dept_directing; break;
            case "writing":         res = R.string.dept_writing; break;
            case "production":      res = R.string.dept_production; break;
            case "camera":          res = R.string.dept_camera; break;
            case "art":             res = R.string.dept_art; break;
            case "sound":           res = R.string.dept_sound; break;
            case "visual effects":  res = R.string.dept_visual_effects; break;
            case "editing":         res = R.string.dept_editing; break;
            case "costume & make-up": res = R.string.dept_costume; break;
            case "lighting":        res = R.string.dept_lighting; break;
            case "crew":            res = R.string.dept_crew; break;
            default:                return dept;
        }
        return context.getString(res);
    }

    class FavoriteActorViewHolder extends RecyclerView.ViewHolder {
        private final ShapeableImageView imgPhoto;
        private final TextView txtName;
        private final TextView txtDept;
        private final TextView txtBirthday;

        FavoriteActorViewHolder(@NonNull View itemView) {
            super(itemView);
            imgPhoto = itemView.findViewById(R.id.imgFavoriteActorPhoto);
            txtName = itemView.findViewById(R.id.txtFavoriteActorName);
            txtDept = itemView.findViewById(R.id.txtFavoriteActorDept);
            txtBirthday = itemView.findViewById(R.id.txtBirthdayBadge);
        }

        void bind(FavoriteActor actor, boolean isBirthday) {
            txtName.setText(actor.getName());

            String dept = actor.getKnownForDepartment();
            if (dept != null && !dept.isEmpty()) {
                txtDept.setText(translateDept(dept));
                txtDept.setVisibility(View.VISIBLE);
            } else {
                txtDept.setVisibility(View.GONE);
            }

            txtBirthday.setVisibility(isBirthday ? View.VISIBLE : View.GONE);

            if (actor.getProfilePath() != null && !actor.getProfilePath().isEmpty()) {
                String imgUrl = "https://image.tmdb.org/t/p/w342" + actor.getProfilePath();
                Glide.with(context)
                        .load(imgUrl)
                        .placeholder(R.drawable.ic_default_avatar)
                        .into(imgPhoto);
            } else {
                imgPhoto.setImageResource(R.drawable.ic_default_avatar);
            }
        }
    }
}
