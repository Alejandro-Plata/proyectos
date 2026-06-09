package es.iesagora.cinexplora.recyclerview.adapter;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import android.text.format.DateUtils;
import java.util.ArrayList;
import java.util.List;

import es.iesagora.cinexplora.databinding.ViewholderCommentBinding;
import es.iesagora.cinexplora.model.Comment;

public class CommentsAdapter extends RecyclerView.Adapter<CommentsAdapter.CommentViewHolder> {

    private List<Comment> commentList;
    private final Context context;

    public CommentsAdapter(Context context) {
        this.context = context;
        this.commentList = new ArrayList<>();
    }

    @NonNull
    @Override
    public CommentViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ViewholderCommentBinding binding =
                ViewholderCommentBinding.inflate(LayoutInflater.from(context), parent, false);
        return new CommentViewHolder(binding);
    }

    @Override
    public void onBindViewHolder(@NonNull CommentViewHolder holder, int position) {
        holder.setUpViewholder(commentList.get(position));
    }

    @Override
    public int getItemCount() {
        return commentList.size();
    }

    public void setCommentList(List<Comment> items) {
        this.commentList = items;
        notifyDataSetChanged();
    }

    public class CommentViewHolder extends RecyclerView.ViewHolder {

        private final ViewholderCommentBinding binding;

        public CommentViewHolder(@NonNull ViewholderCommentBinding binding) {
            super(binding.getRoot());
            this.binding = binding;
        }

        public void setUpViewholder(Comment comment) {
            binding.tvAuthorName.setText(comment.getAuthorName());
            binding.tvCommentText.setText(comment.getText());
            binding.tvCommentDate.setText(formatDate(comment.getCreatedAt()));
        }

        private String formatDate(long timestamp) {
            return DateUtils.getRelativeTimeSpanString(
                    timestamp,
                    System.currentTimeMillis(),
                    DateUtils.MINUTE_IN_MILLIS
            ).toString();
        }
    }
}