package es.iesagora.cinexplora.model;

public class Comment {

    private String id;
    private String authorId;
    private String authorName;
    private String text;
    private long createdAt;

    public Comment() {}

    public Comment(String id, String authorUid, String authorName,
                   String text, long createdAt) {
        this.id = id;
        this.authorId = authorUid;
        this.authorName = authorName;
        this.text = text;
        this.createdAt = createdAt;
    }

    public String getId()         { return id; }
    public String getAuthorId()  { return authorId; }
    public String getAuthorName() { return authorName; }
    public String getText()       { return text; }
    public long getCreatedAt()    { return createdAt; }

    public void setId(String id)               { this.id = id; }
    public void setAuthorId(String authorUid) { this.authorId = authorUid; }
    public void setAuthorName(String name)     { this.authorName = name; }
    public void setText(String text)           { this.text = text; }
    public void setCreatedAt(long createdAt)   { this.createdAt = createdAt; }
}