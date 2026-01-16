package com.thaledi.blogpost.myBlogPost;
import jakarta.persistence.*;


import java.time.LocalDate;

@Entity
@Table(name = "post")  // Explicitly specify table name for clarity
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 255)  // Enforce constraints
    private String title;

    @Column(nullable = false, length = 255)
    private String subtitle;

    @Column(nullable = false)
    private LocalDate dateOfPost;

    @Column(length = 255)
    private String imageUrl;  // Use camelCase for consistency

    @Column(nullable = false, columnDefinition = "TEXT")  // Specify TEXT for large text
    private String postData;  // Use camelCase for consistency

    @Lob
    @Column(name = "image_data", columnDefinition = "LONGBLOB")
    private byte[] imageData;

    @Column(name = "image_content_type")
    private String imageContentType;

    // Getters and setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSubtitle() {
        return subtitle;
    }

    public void setSubtitle(String subtitle) {
        this.subtitle = subtitle;
    }

    public LocalDate getDateOfPost() {
        return dateOfPost;
    }

    public void setDateOfPost(LocalDate dateOfPost) {
        this.dateOfPost = dateOfPost;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getPostData() {
        return postData;
    }

    public void setPostData(String postData) {
        this.postData = postData;
    }

    public byte[] getImageData() {
        return imageData;
    }

    public void setImageData(byte[] imageData) {
        this.imageData = imageData;
    }

    public String getImageContentType() {
        return imageContentType;
    }

    public void setImageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
    }


    @Override
    public String toString() {
        return "Post{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", subtitle='" + subtitle + '\'' +
                ", dateOfPost=" + dateOfPost +
                ", imageUrl='" + imageUrl + '\'' +
                ", postData='" + postData + '\'' +
                ", imageContentType='" + imageContentType + '\'' +
                '}';
    }
}
