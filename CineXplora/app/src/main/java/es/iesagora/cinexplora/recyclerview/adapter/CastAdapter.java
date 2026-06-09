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

import java.util.ArrayList;
import java.util.List;

import es.iesagora.cinexplora.R;
import es.iesagora.cinexplora.model.request.CastMember;

public class CastAdapter extends RecyclerView.Adapter<RecyclerView.ViewHolder> {

    private static final int TYPE_CAST = 0;
    private static final int TYPE_SEE_MORE = 1;
    private static final int MAX_VISIBLE = 5;

    private List<CastMember> castList;
    private final Context context;
    private boolean expanded = false;
    private OnCastClickListener listener;

    public CastAdapter(Context context) {
        this.context = context;
        this.castList = new ArrayList<>();
    }

    public interface OnCastClickListener {
        void onCastClick(CastMember member);
        void onSeeMoreClick();
    }

    public void setOnCastClickListener(OnCastClickListener listener) {
        this.listener = listener;
    }

    public void setCastList(List<CastMember> list) {
        this.castList = list;
        this.expanded = false;
        notifyDataSetChanged();
    }

    @Override
    public int getItemViewType(int position) {
        if (!expanded && castList.size() > MAX_VISIBLE && position == MAX_VISIBLE) {
            return TYPE_SEE_MORE;
        }
        return TYPE_CAST;
    }

    @Override
    public int getItemCount() {
        if (castList.isEmpty()) return 0;
        if (!expanded && castList.size() > MAX_VISIBLE) {
            return MAX_VISIBLE + 1;
        }
        return castList.size();
    }

    @NonNull
    @Override
    public RecyclerView.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        if (viewType == TYPE_SEE_MORE) {
            View view = LayoutInflater.from(context)
                    .inflate(R.layout.item_cast_see_more, parent, false);
            return new SeeMoreViewHolder(view);
        }
        View view = LayoutInflater.from(context)
                .inflate(R.layout.item_cast, parent, false);
        return new CastViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull RecyclerView.ViewHolder holder, int position) {
        if (holder instanceof SeeMoreViewHolder) {
            holder.itemView.setOnClickListener(v -> {
                expanded = true;
                notifyDataSetChanged();
                if (listener != null) listener.onSeeMoreClick();
            });
        } else if (holder instanceof CastViewHolder) {
            CastMember member = castList.get(position);
            ((CastViewHolder) holder).bind(member);
            holder.itemView.setOnClickListener(v -> {
                if (listener != null) listener.onCastClick(member);
            });
        }
    }

    class CastViewHolder extends RecyclerView.ViewHolder {
        private final ShapeableImageView imgPhoto;
        private final TextView txtName;
        private final TextView txtCharacter;

        CastViewHolder(@NonNull View itemView) {
            super(itemView);
            imgPhoto = itemView.findViewById(R.id.imgCastPhoto);
            txtName = itemView.findViewById(R.id.txtCastName);
            txtCharacter = itemView.findViewById(R.id.txtCastCharacter);
        }

        void bind(CastMember member) {
            txtName.setText(member.getName());
            txtCharacter.setText(member.getCharacter());

            if (member.getProfilePath() != null && !member.getProfilePath().isEmpty()) {
                String imgUrl = "https://image.tmdb.org/t/p/w185" + member.getProfilePath();
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

    static class SeeMoreViewHolder extends RecyclerView.ViewHolder {
        SeeMoreViewHolder(@NonNull View itemView) {
            super(itemView);
        }
    }
}